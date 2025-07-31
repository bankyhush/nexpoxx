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
});

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const plans = await prisma.plan.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = planSchema.parse(body);
    const plan = await prisma.plan.create({ data: parsed });
    return NextResponse.json(plan, { status: 201 });
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
