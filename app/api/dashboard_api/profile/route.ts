import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";

const profileSchema = z.object({
  email: z.string().email().max(255).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255)
    .optional(),
});

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: Number(user.id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        country: true,
        kycStatus: true,
      },
    });
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: profile.id.toString(),
      nickname: profile.fullName || profile.email.split("@")[0],
      email: profile.email,
      phoneNumber: profile.phoneNumber || "Not set",
      country: profile.country || "Not set",
      kycStatus:
        profile.kycStatus === "Approved" ? "Verified" : profile.kycStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.parse(body);

    // Check if the new email is already taken (if provided)
    if (parsed.email && parsed.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: parsed.email },
      });
      if (existingUser) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: [{ field: "email", message: "Email already in use" }],
          },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (parsed.email) updateData.email = parsed.email;
    if (parsed.password)
      updateData.password = await bcrypt.hash(parsed.password, 10);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        country: true,
        kycStatus: true,
      },
    });

    return NextResponse.json({
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber || "Not set",
      country: updatedUser.country || "Not set",
      kycStatus:
        updatedUser.kycStatus === "Approved"
          ? "Verified"
          : updatedUser.kycStatus,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: [{ field: "email", message: "Email already in use" }],
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
