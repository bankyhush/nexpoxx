import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user balances with associated coin data
    const balances = await prisma.userBalance.findMany({
      where: { userId: Number(user.id) },
      select: {
        available: true,
        onOrder: true,
        staked: true,
        coin: {
          select: {
            coinRate: true,
          },
        },
      },
    });

    // Calculate total balance in USD
    const totalBalance = balances.reduce((sum, balance) => {
      const holdings =
        Number(balance.available) +
        Number(balance.onOrder) +
        Number(balance.staked);

      const usdValue = holdings;
      return sum + usdValue;
    }, 0);

    const availableHoldings = balances.reduce((sum, balance) => {
      const holdings = Number(balance.available);
      return sum + holdings;
    }, 0);

    const orderHoldings = balances.reduce((sum, balance) => {
      const holdings = Number(balance.onOrder);
      return sum + holdings;
    }, 0);

    const formattedOrder =
      orderHoldings < 0.01
        ? "0.00"
        : orderHoldings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    // Format available balance
    const formattedAvailable =
      availableHoldings < 0.01
        ? "0.00"
        : availableHoldings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    const formattedBalance =
      totalBalance < 0.01
        ? "<0.00"
        : totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

    return NextResponse.json({
      totalBalance: formattedBalance,
      availableBalance: formattedAvailable,
      orderBalance: formattedOrder,
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
