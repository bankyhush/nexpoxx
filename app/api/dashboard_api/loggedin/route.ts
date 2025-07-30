// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";

export async function GET() {
  const authUser = await getAuthUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(authUser.id) },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      walletAddress: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}
