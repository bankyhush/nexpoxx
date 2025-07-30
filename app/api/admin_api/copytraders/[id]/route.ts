// app/api/admin_api/copytraders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

const copyTraderSchema = z.object({
  name: z.string().min(2),
  photo: z.string().optional(),
  noTrades: z.string(),
  noCopiers: z.string(),
  status: z.string(),
  noWins: z.string(),
  rank: z.string(),
  strategyDesc: z.string().optional(),
  noLoss: z.string(),
  profit: z.string(),
  loss: z.string(),
  edate: z.string(),
  commission: z.string().default("100"),
});

// 🔹 GET
export async function GET(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const trader = await prisma.copyTrader.findUnique({
    where: { id: Number(params.id) },
  });

  if (!trader) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(trader);
}

// 🔹 PUT
export async function PUT(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = copyTraderSchema.parse(body);

    const updated = await prisma.copyTrader.update({
      where: { id: Number(params.id) },
      data: parsed,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Error updating trader" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE
export async function DELETE(
  req: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.copyTrader.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
