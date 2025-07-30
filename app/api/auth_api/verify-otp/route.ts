import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Missing email or code" },
        { status: 400 }
      );
    }

    // ✅ MOCK: Replace this with real DB or Redis check
    const storedOTP = "123456"; // Replace with fetched OTP from DB or cache

    if (code !== storedOTP) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      );
    }

    // ✅ MOCK: OTP is valid, mark email as verified in DB
    console.log(`Email ${email} verified.`);

    // Optionally store session info or return auth token

    return NextResponse.json({
      message: "Verification successful",
      redirectPath: "/dashboard",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
