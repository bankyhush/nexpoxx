import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import prisma from "@/connections/prisma";
import { sendOtpEmail } from "@/lib/email";
import { SignJWT } from "jose";

// JWT Token generator (using jose)
async function createToken(payload: {
  id: string;
  email: string;
  role: string;
}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("myapp")
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, password } = body;

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const walletAddress = `NX0${nanoid(31)}`;
    const inviteCode = nanoid(8);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: hashedPassword,
        walletAddress,
        inviteCode,
        accountType: "standard",
        stoken: otp,
      },
    });

    const coins = await prisma.coin.findMany({ where: { coinVisible: true } });
    await prisma.userBalance.createMany({
      data: coins.map((coin) => ({
        userId: user.id,
        coinId: coin.id,
        available: 0,
        onOrder: 0,
        staked: 0,
      })),
    });

    await sendOtpEmail(email, otp);

    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    const oneDayInSeconds = 60 * 60 * 24;

    // Set secure HTTP-only cookie
    (
      await // Set secure HTTP-only cookie
      cookies()
    ).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: oneDayInSeconds,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful, OTP sent to email",
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
