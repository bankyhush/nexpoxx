import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { coinId: string } }
) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { coinId } = params;

  try {
    const transactions = await prisma.transactionHistory.findMany({
      where: {
        userId: Number(user.id),
        coinId: Number(coinId),
      },
      orderBy: {
        createdAt: "desc", // Most recent first
      },
      select: {
        id: true,
        type: true,
        amount: true,
        createdAt: true,
        status: true, // Include status in the response
        title: true, // Include title for coin name context
      },
    });

    return NextResponse.json(transactions);
  } catch (err: any) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json(
      { error: `Failed to fetch transactions: ${err.message}` },
      { status: 500 }
    );
  }
}
