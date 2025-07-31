import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt"; // Assuming bcrypt for password hashing

const profileSchema = z.object({
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255)
    .optional(),
});

export async function PUT(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.parse(body);

    // Check if the new email is already taken by another user
    if (parsed.email !== user.email) {
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
    const updateData: any = { email: parsed.email };
    if (parsed.password) {
      updateData.password = await bcrypt.hash(parsed.password, 10); // Hash the new password
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: Number(user.id) },
      data: updateData,
      select: { id: true, email: true, role: true }, // Return limited fields for security
    });

    return NextResponse.json(updatedUser);
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
