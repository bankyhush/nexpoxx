import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

const signalSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.string().min(1).max(50),
  strength: z.string().min(1).max(50),
});

// GET: Fetch Single signals

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const signal = await prisma.signal.findUnique({
    where: { id: Number(context.params.id) },
  });
  if (!signal)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(signal);
}

// PUT: Update a signal

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = signalSchema.parse(body);
    const updated = await prisma.signal.update({
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

// DELETE: Delete a signal

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await prisma.signal.delete({ where: { id: Number(context.params.id) } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}
