import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ MOCK: Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ MOCK: Store OTP in DB or cache (e.g. Redis)
    console.log(`Generated OTP for ${email}: ${newOTP}`);

    // ✅ MOCK: Send OTP via email (replace with real email logic)
    // await sendEmail({ to: email, subject: 'Your OTP', text: `Your code is ${newOTP}` });

    return NextResponse.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
