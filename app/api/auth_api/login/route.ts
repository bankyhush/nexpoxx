import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import prisma from "@/connections/prisma";
import { SignJWT } from "jose";

// Helper to generate JWT using jose
async function createToken(payload: {
  id: string;
  email: string;
  role: string;
}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  const encoder = new TextEncoder();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("myapp")
    .setExpirationTime("1h")
    .sign(encoder.encode(secret));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 403 }
      );
    }

    // JWT generation with jose
    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    const oneDayInSeconds = 60 * 60 * 24;

    (await cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: oneDayInSeconds,
    });

    const { password: _, ...userData } = user;
    const redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";

    return NextResponse.json({
      message: "Login successful",
      user: userData,
      redirectPath,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
