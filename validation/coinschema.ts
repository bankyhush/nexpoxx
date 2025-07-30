import { z } from "zod";

export const coinSchema = z.object({
  coinName: z.string().max(50, "coinName must be 50 characters or fewer"),
  coinTitle: z.string().max(100, "coinTitle must be 100 characters or fewer"),
  coinRate: z.union([z.string(), z.number()]), // will parse this to number later
  photo: z.string().max(255).optional().nullable(),
  withMin: z.coerce.number().int().nonnegative().optional(),
  withMax: z.coerce.number().int().nonnegative().optional(),
  withInstructions: z.string().optional().nullable(),
  depositInstructions: z.string().optional().nullable(),
  depositAddress: z.string().max(255).optional().nullable(),
  percent: z.string().max(10).optional().nullable(),
  desc: z.string().optional().nullable(),
  coinVisible: z.boolean().optional().default(true),
});
