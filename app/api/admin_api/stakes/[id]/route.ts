import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

const stakingSchema = z.object({
  name: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  photo: z.string().min(1).max(255),
  duration: z.string().min(1).max(50),
  roi: z.string().min(1).max(50),
  min: z.string().min(1).max(50),
  max: z.string().min(1).max(50),
});

// GET: Fetch a staking record

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const staking = await prisma.staking.findUnique({
    where: { id: Number(context.params.id) },
  });
  if (!staking)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(staking);
}

// PUT: Update a staking record

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = stakingSchema.parse(body);
    const updated = await prisma.staking.update({
      where: { id: Number(context.params.id) },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}

// DELETE: Delete a staking record

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await prisma.staking.delete({ where: { id: Number(context.params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "Staking not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
