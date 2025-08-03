import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const front = formData.get("frontImage") as File | null;
    const back = formData.get("backImage") as File | null;
    const certificateType = formData.get("certificateType") as string;

    if (!front || !back || !certificateType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads", `${user.id}`);
    await mkdir(uploadDir, { recursive: true });

    // Save files to disk
    const frontFilename = `front_${Date.now()}_${front.name}`;
    const backFilename = `back_${Date.now()}_${back.name}`;

    const frontPath = path.join(uploadDir, frontFilename);
    const backPath = path.join(uploadDir, backFilename);

    await writeFile(frontPath, Buffer.from(await front.arrayBuffer()));
    await writeFile(backPath, Buffer.from(await back.arrayBuffer()));

    // File URLs to store in database (local path reference)
    const frontUrl = `/uploads/${user.id}/${frontFilename}`;
    const backUrl = `/uploads/${user.id}/${backFilename}`;

    // Save to database
    await prisma.user.update({
      where: { id: Number(user.id) },
      data: {
        frontImage: frontUrl,
        backImage: backUrl,
        kycStatus: "Verified", // or "Submitted"
      },
    });

    return NextResponse.json({
      message: "Verification submitted successfully",
      frontImage: frontUrl,
      backImage: backUrl,
    });
  } catch (error: any) {
    console.error("KYC Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
