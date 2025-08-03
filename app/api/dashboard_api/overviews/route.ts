import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const coinId = searchParams.get("coinId");

  if (!coinId || isNaN(Number(coinId))) {
    return NextResponse.json(
      {
        error: "Invalid Request",
        details: [
          {
            field: "coinId",
            message: "Coin ID is required and must be a number",
          },
        ],
      },
      { status: 400 }
    );
  }

  try {
    // Fetch user balance and associated coin data for the specific coinId
    const balance = await prisma.userBalance.findFirst({
      where: {
        userId: Number(user.id),
        coinId: Number(coinId),
      },
      select: {
        available: true,
        onOrder: true,
        staked: true,
        coin: {
          select: {
            id: true,
            coinName: true,
            coinTitle: true,
            coinRate: true,
            photo: true,
            desc: true,
          },
        },
      },
    });

    if (!balance) {
      return NextResponse.json(
        {
          error: "Coin not found",
          details: [
            { field: "coin", message: "No balance found for this coin" },
          ],
        },
        { status: 404 }
      );
    }

    // Calculate holdings and USD value
    const holdings = Number(balance.available) + Number(balance.onOrder);
    const holdingsUsd = holdings * Number(balance.coin.coinRate);

    const coinData = {
      id: balance.coin.id.toString(),
      name: balance.coin.coinName,
      fullName: balance.coin.coinTitle,
      holdings: holdings.toFixed(8), // 8 decimals for crypto precision
      holdingsUsd: holdingsUsd < 0.01 ? "<$0.01" : `$${holdingsUsd.toFixed(2)}`,
      spotPrice: `$${Number(balance.coin.coinRate).toFixed(3)}`,
      photo: balance.coin.photo || null,
    };

    return NextResponse.json(coinData);
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: "Internal Error",
        details: [
          {
            field: "server",
            message: err.message || "Failed to fetch coin data",
          },
        ],
      },
      { status: 500 }
    );
  }
}
