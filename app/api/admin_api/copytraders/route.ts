import { NextRequest, NextResponse } from "next/server";
import prisma from "@/connections/prisma";
import { getAuthUser } from "@/lib/getAuthUser";
import { ZodError, z } from "zod";

// CopyTrader schema (you can move this to a separate file if preferred)
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

// 🔹 GET - list all CopyTraders
export async function GET(req: NextRequest) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const traders = await prisma.copyTrader.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(traders);
}

// 🔹 POST - create a CopyTrader
export async function POST(req: NextRequest) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = copyTraderSchema.parse(body);

    const trader = await prisma.copyTrader.create({
      data: parsed,
    });

    return NextResponse.json(trader, { status: 201 });
  } catch (error: any) {
    console.error("Error creating CopyTrader:", error);

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
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
