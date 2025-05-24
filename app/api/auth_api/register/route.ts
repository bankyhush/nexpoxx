import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import prisma from "@/connections/prisma";
import { sendOtpEmail } from "@/lib/email";
import { createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // === Validate Input ===
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // === Check if User Exists ===
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    // === Secure User Creation ===
    const hashedPassword = await bcrypt.hash(password, 10);
    const walletAddress = `NX0${nanoid(31)}`;
    const inviteCode = nanoid(8);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        walletAddress,
        inviteCode,
        accountType: "standard",
        stoken: otp,
      },
    });

    // === Initialize User Balances ===
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

    // === Send OTP Email ===
    await sendOtpEmail(email, otp);

    // === Create JWT Token ===
    const token = await createToken({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful, OTP sent to email",
      token,
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
