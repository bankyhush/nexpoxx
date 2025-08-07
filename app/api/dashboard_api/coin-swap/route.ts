// /api/dashboard_api/swap/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import nodemailer from "nodemailer";

const { ADMIN_EMAIL, EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } =
  process.env;

// Define the expected user type
interface AuthUser {
  id: string;
  email: string;
  fullName?: string;
}

export async function POST(req: NextRequest) {
  const user = (await getAuthUser()) as AuthUser | null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fromCoinId, toCoinId, fromAmount, toAmount, userName } =
      await req.json();

    // Validate input
    if (!fromCoinId || !toCoinId || !fromAmount || !toAmount || !userName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (fromCoinId === toCoinId) {
      return NextResponse.json(
        { error: "Cannot swap the same coin" },
        { status: 400 }
      );
    }

    if (
      isNaN(fromAmount) ||
      fromAmount <= 0 ||
      isNaN(toAmount) ||
      toAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Get user balances and coin info
    const [fromBalance, toBalance, fromCoin, toCoin] = await Promise.all([
      prisma.userBalance.findUnique({
        where: {
          userId_coinId: {
            userId: Number(user.id),
            coinId: Number(fromCoinId),
          },
        },
      }),
      prisma.userBalance.findUnique({
        where: {
          userId_coinId: {
            userId: Number(user.id),
            coinId: Number(toCoinId),
          },
        },
      }),
      prisma.coin.findUnique({ where: { id: Number(fromCoinId) } }),
      prisma.coin.findUnique({ where: { id: Number(toCoinId) } }),
    ]);

    if (!fromCoin || !toCoin) {
      return NextResponse.json(
        { error: "Invalid source or target coin" },
        { status: 400 }
      );
    }

    // Check balances
    if (!fromBalance || fromBalance.available < fromAmount) {
      return NextResponse.json(
        { error: "Insufficient balance for source coin" },
        { status: 400 }
      );
    }

    // Check minimum swap
    if (fromAmount * Number(fromCoin.coinRate) < (fromCoin.withMin || 0)) {
      return NextResponse.json(
        { error: `Amount below minimum swap (${fromCoin.withMin} USD)` },
        { status: 400 }
      );
    }

    // Verify toAmount with 0.1% fee
    const feeRate = 0.001;
    const expectedToAmount =
      (Number(fromAmount) * Number(fromCoin.coinRate) * (1 - feeRate)) /
      Number(toCoin.coinRate);
    if (Math.abs(toAmount - expectedToAmount) > 0.00000001) {
      return NextResponse.json(
        { error: "Incorrect target amount calculation" },
        { status: 400 }
      );
    }

    // Start transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Deduct from source coin
      await prisma.userBalance.update({
        where: {
          userId_coinId: {
            userId: Number(user.id),
            coinId: Number(fromCoinId),
          },
        },
        data: {
          available: {
            decrement: fromAmount,
          },
        },
      });

      // Add to destination coin
      await prisma.userBalance.upsert({
        where: {
          userId_coinId: {
            userId: Number(user.id),
            coinId: Number(toCoinId),
          },
        },
        update: {
          available: {
            increment: toAmount,
          },
        },
        create: {
          userId: Number(user.id),
          coinId: Number(toCoinId),
          available: toAmount,
          onOrder: 0,
          staked: 0,
        },
      });

      // Create transaction records
      const outgoingTx = await prisma.transactionHistory.create({
        data: {
          userId: Number(user.id),
          coinId: Number(fromCoinId),
          amount: fromAmount,
          type: "SWAP_OUT",
          status: "Completed",
          title: `Swap to ${toCoin?.coinName}`,
          info: `Swapped ${fromAmount.toFixed(8)} ${
            fromCoin?.coinName
          } to ${toAmount.toFixed(8)} ${toCoin?.coinName}`,
        },
      });

      const incomingTx = await prisma.transactionHistory.create({
        data: {
          userId: Number(user.id),
          coinId: Number(toCoinId),
          amount: toAmount,
          type: "SWAP_IN",
          status: "Completed",
          title: `Swap from ${fromCoin?.coinName}`,
          info: `Received ${toAmount.toFixed(8)} ${
            toCoin?.coinName
          } from ${fromAmount.toFixed(8)} ${fromCoin?.coinName}`,
        },
      });

      return { outgoingTx, incomingTx };
    });

    // Send admin notification
    if (ADMIN_EMAIL && EMAIL_USER && EMAIL_PASS && EMAIL_HOST && EMAIL_PORT) {
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Crypto Platform" <${EMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: "New Coin Swap Completed",
        html: `
          <h3>New Coin Swap Completed</h3>
          <p><strong>User:</strong> ${user.email} (${
          user.fullName || "No name"
        })</p>
          <p><strong>From:</strong> ${fromAmount.toFixed(8)} ${
          fromCoin?.coinName
        }</p>
          <p><strong>To:</strong> ${toAmount.toFixed(8)} ${toCoin?.coinName}</p>
          <p><strong>Fee:</strong> 0.10%</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Transaction IDs:</strong></p>
          <ul>
            <li>Outgoing: ${result.outgoingTx.id}</li>
            <li>Incoming: ${result.incomingTx.id}</li>
          </ul>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Swap completed successfully",
    });
  } catch (error: any) {
    console.error("Swap error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process swap" },
      { status: 500 }
    );
  }
}
