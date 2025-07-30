import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { coinSchema } from "@/validation/coinschema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    // ✅ Validate with Zod
    const parsed = coinSchema.parse(body);

    // ✅ Create coin
    const coin = await prisma.coin.create({
      data: {
        coinName: parsed.coinName,
        coinTitle: parsed.coinTitle,
        coinRate: parsed.coinRate, // already coerced to number
        photo: parsed.photo,
        withMin: parsed.withMin ?? null,
        withMax: parsed.withMax ?? null,
        withInstructions: parsed.withInstructions,
        depositInstructions: parsed.depositInstructions,
        depositAddress: parsed.depositAddress,
        percent: parsed.percent,
        desc: parsed.desc,
        coinVisible: parsed.coinVisible,
      },
    });

    // ✅ Get all users
    const users = await prisma.user.findMany({ select: { id: true } });

    // ✅ Create balances for all users for the new coin
    const balanceData = users.map((u) => ({
      userId: u.id,
      coinId: coin.id,
      available: 0,
      onOrder: 0,
      staked: 0,
    }));

    if (balanceData.length > 0) {
      await prisma.userBalance.createMany({
        data: balanceData,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(coin, { status: 201 });
  } catch (error: any) {
    console.error("Error creating coin:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
