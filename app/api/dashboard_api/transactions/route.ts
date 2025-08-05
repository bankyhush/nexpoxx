import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const transactions = await prisma.transactionHistory.findMany({
      where: {
        userId: Number(user.id),
      },
      orderBy: {
        createdAt: "desc", // Most recent first
      },
      skip,
      take: limit,
      select: {
        id: true,
        type: true,
        amount: true,
        createdAt: true,
        title: true,
        status: true,
      },
    });

    const total = await prisma.transactionHistory.count({
      where: { userId: Number(user.id) },
    });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ transactions, totalPages });
  } catch (err: any) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json(
      { error: `Failed to fetch transactions: ${err.message}` },
      { status: 500 }
    );
  }
}
