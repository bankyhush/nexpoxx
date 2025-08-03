import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const balances = await prisma.userBalance.findMany({
      where: { userId: Number(user.id) },
      select: {
        available: true,
        onOrder: true,
        coin: {
          select: {
            coinRate: true,
          },
        },
      },
    });

    const totalBalance = balances.reduce((sum, balance) => {
      const holdings = Number(balance.available) + Number(balance.onOrder);
      const usdValue = holdings * Number(balance.coin.coinRate);
      return sum + usdValue;
    }, 0);

    return NextResponse.json({
      totalBalance: totalBalance < 0.01 ? "<0.01" : totalBalance.toFixed(2),
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: "Internal Error",
        details: [
          {
            field: "server",
            message: err.message || "Failed to fetch balance",
          },
        ],
      },
      { status: 500 }
    );
  }
}
