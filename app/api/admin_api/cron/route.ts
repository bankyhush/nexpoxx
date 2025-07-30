import { NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import axios from "axios";

export async function GET() {
  try {
    const coins = await prisma.coin.findMany();

    const ids = coins.map((c) => c.coinTitle.toLowerCase()).join(",");

    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids, // comma-separated list of coin names
          vs_currencies: "usd",
        },
      }
    );

    const updates = await Promise.all(
      coins.map(async (coin) => {
        const rate = res.data[coin.coinTitle.toLowerCase()]?.usd;

        if (rate) {
          await prisma.coin.update({
            where: { id: coin.id },
            data: { coinRate: parseFloat(rate.toFixed(3)) },
          });
          return { coin: coin.coinTitle, updated: true };
        }

        return { coin: coin.coinTitle, updated: false };
      })
    );

    return NextResponse.json({ success: true, updates });
  } catch (error) {
    console.error("Coin rate update failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update coin rates" },
      { status: 500 }
    );
  }
}
