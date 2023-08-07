import { ROUND } from "../round";

export const getTotalReturnMarginStock = (
  totalReturnValue: number | null,
  currentReturnValue: number,
  amountActiveShares: number,
  averageCostPerShare: number
) => {
  const updatedTotalReturnValue = Number(totalReturnValue) + currentReturnValue;
  const marketCap = amountActiveShares * averageCostPerShare;

  const result = ROUND((updatedTotalReturnValue / marketCap) * 100);

  return result;
};
