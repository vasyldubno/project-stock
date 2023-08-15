export const data: {
  label: string;
  select:
    | "peExpression"
    | "roeExpression"
    | "deExpression"
    | "priceGrowthExpression"
    | "marginSafetyExpression"
    | "analystExpression"
    | "payoutRatioExpression"
    | "dividendYieldExpression";
  input:
    | "pe"
    | "roe"
    | "de"
    | "priceGrowth"
    | "marginSafety"
    | "analyst"
    | "payoutRatio"
    | "dividendYield";
}[] = [
  { label: "PE", select: "peExpression", input: "pe" },
  { label: "ROE", select: "roeExpression", input: "roe" },
  { label: "Debt/Equity", select: "deExpression", input: "de" },
  {
    label: "Price Growth",
    select: "priceGrowthExpression",
    input: "priceGrowth",
  },
  {
    label: "Margin of Safety",
    select: "marginSafetyExpression",
    input: "marginSafety",
  },
  {
    label: "Analyst Rating Buy",
    select: "analystExpression",
    input: "analyst",
  },
  {
    input: "payoutRatio",
    label: "Payout Ratio",
    select: "payoutRatioExpression",
  },
  {
    input: "dividendYield",
    label: "Dividend Yield",
    select: "dividendYieldExpression",
  },
];
