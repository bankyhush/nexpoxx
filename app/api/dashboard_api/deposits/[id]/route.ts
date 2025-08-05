// /api/dashboard_api/deposits/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";

export async function GET(request: NextRequest, { params }: any) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const coinId = parseInt(await params.id, 10);
  if (!Number.isInteger(coinId)) {
    return NextResponse.json({ error: "Invalid coin ID" }, { status: 400 });
  }

  const coin = await prisma.coin.findUnique({
    where: { id: coinId },
    select: {
      id: true,
      coinName: true,
      coinTitle: true,
      coinRate: true,
      photo: true,
      desc: true,
      depositAddress: true,
      depositInstructions: true,
      withMin: true,
      withMax: true,
    },
  });

  if (!coin) {
    return NextResponse.json({ error: "Coin not found" }, { status: 404 });
  }

  const balance = await prisma.userBalance.findFirst({
    where: { userId: Number(user.id), coinId },
    select: { available: true, onOrder: true, staked: true },
  });

  return NextResponse.json({ coin, balance });
}
