import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

const signalSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.string().min(1).max(50),
  strength: z.string().min(1).max(50),
});

// GET: Fetch all signals

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const signals = await prisma.signal.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(signals);
}

// POST: Create a new signal

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = signalSchema.parse(body);
    const signal = await prisma.signal.create({ data: parsed });
    return NextResponse.json(signal, { status: 201 });
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
