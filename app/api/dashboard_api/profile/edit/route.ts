import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";

export async function PUT(req: Request) {
  const authUser = await getAuthUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fullName, phoneNumber, country } = await req.json();

  try {
    const updated = await prisma.user.update({
      where: { id: Number(authUser.id) },
      data: {
        fullName,
        phoneNumber,
        country,
      },
    });

    return NextResponse.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
