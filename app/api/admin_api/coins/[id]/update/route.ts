import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PUT(
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

  const data = await req.json();

  try {
    const updatedCoin = await prisma.coin.update({
      where: { id: coinId },
      data: {
        coinName: data.coinName,
        coinTitle: data.coinTitle,
        coinRate: parseFloat(data.coinRate),
        photo: data.photo,
        withMin: data.withMin,
        withMax: data.withMax,
        withInstructions: data.withInstructions,
        depositInstructions: data.depositInstructions,
        depositAddress: data.depositAddress,
        percent: data.percent,
        desc: data.desc,
        coinVisible: data.coinVisible === "true" || data.coinVisible === true,
      },
    });

    return NextResponse.json(updatedCoin);
  } catch (error) {
    console.error("Error updating coin:", error);
    return NextResponse.json(
      { error: "Failed to update coin" },
      { status: 500 }
    );
  }
}
