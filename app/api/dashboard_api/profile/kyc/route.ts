import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/getAuthUser";
import prisma from "@/connections/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export const config = { api: { bodyParser: false } };

export async function POST(req: Request) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const front = formData.get("frontImage") as unknown as File;
  const back = formData.get("backImage") as unknown as File;

  if (!front || !back) {
    return NextResponse.json({ error: "Files missing" }, { status: 400 });
  }

  // Simple server-side save logic (replace with cloud storage in prod)
  const uploadDir = path.join(process.cwd(), "uploads", `${user.id}`);
  await writeFile(
    path.join(uploadDir, "front" + front.name),
    Buffer.from(await front.arrayBuffer())
  );
  await writeFile(
    path.join(uploadDir, "back" + back.name),
    Buffer.from(await back.arrayBuffer())
  );

  const frontUrl = `/uploads/${user.id}/front${front.name}`;
  const backUrl = `/uploads/${user.id}/back${back.name}`;

  await prisma.user.update({
    where: { id: Number(user.id) },
    data: { frontImage: frontUrl, backImage: backUrl, kycStatus: "Verified" },
  });

  return NextResponse.json({
    message: "Verification images uploaded",
    frontImage: frontUrl,
    backImage: backUrl,
  });
}
