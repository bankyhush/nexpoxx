import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const coinId = parseInt(params.id);
  if (isNaN(coinId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const coin = await prisma.coin.findUnique({
      where: { id: coinId },
    });

    if (!coin) {
      return NextResponse.json({ error: "Coin not found" }, { status: 404 });
    }

    return NextResponse.json(coin);
  } catch (error) {
    console.error("Error fetching coin:", error);
    return NextResponse.json(
      { error: "Failed to fetch coin" },
      { status: 500 }
    );
  }
}
