import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import nodemailer from "nodemailer";

// Environment variables for email configuration
const { ADMIN_EMAIL, EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } =
  process.env;

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    console.log("Authentication failed: No user");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const coinId = formData.get("coinId") as string;
  const amount = formData.get("amount") as string;
  const userName = formData.get("userName") as string;
  const title = (formData.get("title") as string) || "Deposit";

  console.log("Received data:", { coinId, amount, title });

  if (!coinId || !amount) {
    console.log("Validation failed: Missing required fields");
    return NextResponse.json(
      { error: "Coin ID and amount are required" },
      { status: 400 }
    );
  }

  if (isNaN(Number(amount))) {
    console.log("Validation failed: Invalid amount");
    return NextResponse.json(
      { error: "Amount must be a valid number" },
      { status: 400 }
    );
  }

  try {
    // Create TransactionHistory record
    const transaction = await prisma.transactionHistory.create({
      data: {
        coinId: Number(coinId),
        userId: Number(user.id),
        amount: Number(amount),
        type: "DEPOSIT",
        status: "Pending",
        title: title,
      },
    });

    console.log("Transaction created:", transaction.id);

    // Send notification email to admin
    if (ADMIN_EMAIL && EMAIL_USER && EMAIL_PASS && EMAIL_HOST && EMAIL_PORT) {
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: ADMIN_EMAIL,
        subject: "New Deposit Verification Request",
        text: `A new payment verification has been submitted:\n\n
          Transaction ID: ${transaction.id}\n
          User: ${userName}\n
          Amount: ${amount} USD\n
          Coin: ${title}\n
          Status: Pending\n\n
          Please review and update the status accordingly.`,
      };

      await transporter.sendMail(mailOptions);
      // console.log("Notification email sent to admin");
    } else {
      // console.log("Email notification skipped: Missing environment variables");
    }

    return NextResponse.json({
      message: "Payment verification submitted successfully",
      transactionId: transaction.id,
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { error: `Failed to process payment verification: ${err.message}` },
      { status: 500 }
    );
  }
}
