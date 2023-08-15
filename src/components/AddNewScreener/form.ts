import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1),
  peExpression: z.enum(["less", "greater"]),
  roeExpression: z.enum(["less", "greater"]),
  deExpression: z.enum(["less", "greater"]),
  priceGrowthExpression: z.enum(["less", "greater"]),
  marginSafetyExpression: z.enum(["less", "greater"]),
  analystExpression: z.enum(["less", "greater"]),
  payoutRatioExpression: z.enum(["less", "greater"]),
  dividendYieldExpression: z.enum(["less", "greater"]),
  pe: z.string().optional(),
  roe: z.string().optional(),
  de: z.string().optional(),
  priceGrowth: z.string().optional(),
  marginSafety: z.string().optional(),
  analyst: z.string().optional(),
  payoutRatio: z.string().optional(),
  dividendYield: z.string().optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
