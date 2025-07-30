// /app/api/admin_api/coins/[id]/delete/route.ts

import { NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const coinId = await parseInt(params.id);
  if (isNaN(coinId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.coin.delete({ where: { id: coinId } });
    return NextResponse.json({ message: "Coin deleted successfully" });
  } catch (error) {
    console.error("Failed to delete coin:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}
