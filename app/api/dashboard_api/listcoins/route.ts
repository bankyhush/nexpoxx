//api/dashboard_api/listcoins/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch visible coins
    const coins = await prisma.coin.findMany({
      where: { coinVisible: true },
      select: {
        id: true,
        coinName: true,
        coinTitle: true,
        coinRate: true,
        photo: true,
      },
    });

    // Fetch user balances
    const balances = await prisma.userBalance.findMany({
      where: { userId: Number(user.id) },
      select: {
        coinId: true,
        available: true,
        onOrder: true,
        staked: true,
      },
    });

    // Combine coins with user balances
    const assets = coins.map((coin) => {
      const balance = balances.find((b) => b.coinId === coin.id) || {
        available: 0,
        onOrder: 0,
        staked: 0,
      };
      const totalHolding =
        Number(balance.available) +
        Number(balance.onOrder) +
        Number(balance.staked);
      const totalHoldings = totalHolding / Number(coin.coinRate);
      const holdingsUsd =
        Number(balance.available) +
        Number(balance.onOrder) +
        Number(balance.staked);

      return {
        id: coin.id.toString(),
        name: coin.coinName,
        fullName: coin.coinTitle,
        holdings: totalHoldings.toFixed(5),
        holdingsUsdValue: holdingsUsd,
        holdingsUsd:
          holdingsUsd < 0.01
            ? "$0.00"
            : `$${holdingsUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
        spotPrice: `$${Number(coin.coinRate).toFixed(3)}`,
        priceChange: "", // Placeholder, as no price change data in schema
        photo: coin.photo || null,
      };
    });

    // Sort by highest holdingsUsdValue
    assets.sort((a, b) => b.holdingsUsdValue - a.holdingsUsdValue);

    // Remove the raw value before sending the response
    const sortedAssets = assets.map(({ holdingsUsdValue, ...rest }) => rest);

    return NextResponse.json(assets);
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: "Internal Error",
        details: [
          { field: "server", message: err.message || "Failed to fetch assets" },
        ],
      },
      { status: 500 }
    );
  }
}
