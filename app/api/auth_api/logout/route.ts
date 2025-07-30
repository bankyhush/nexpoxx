// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  // Clear the cookie by setting an expired date
  res.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  return res;
}
