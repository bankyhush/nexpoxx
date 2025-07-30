import { NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const coins = await prisma.coin.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(coins);
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
