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

// GET: Fetch all staking records

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const stakingRecords = await prisma.staking.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(stakingRecords);
}

// POST: Create a new staking record

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = stakingSchema.parse(body);
    const staking = await prisma.staking.create({ data: parsed });
    return NextResponse.json(staking, { status: 201 });
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
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
