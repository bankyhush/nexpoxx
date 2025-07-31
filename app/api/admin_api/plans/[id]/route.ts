import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

const planSchema = z.object({
  plan_name: z.string().min(1),
  plan_des: z.string(),
  min_ins: z.string(),
  max_ins: z.string(),
  days_duration: z.string(),
  daily_interest: z.string(),
  status: z.string(),
  image: z.string().optional(),
});

// GET all plans

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const plan = await prisma.plan.findUnique({
    where: { id: Number(context.params.id) },
  });
  if (!plan) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(plan);
}

// UPDATE  a  plan

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = planSchema.parse(body);
    const updated = await prisma.plan.update({
      where: { id: Number(context.params.id) },
      data: parsed,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof ZodError)
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
    return NextResponse.json({ error: "Error updating" }, { status: 500 });
  }
}

// DELETE a plan

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.plan.delete({ where: { id: Number(context.params.id) } });
  return NextResponse.json({ success: true });
}
