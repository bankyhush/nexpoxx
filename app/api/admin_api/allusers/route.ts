// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";

export async function GET(req: Request) {
  const authUser = await getAuthUser();
  if (!authUser || authUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      country: true,
      verified: true,
      walletAddress: true,
      accountType: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
