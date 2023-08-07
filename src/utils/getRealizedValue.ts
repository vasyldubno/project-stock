import { ROUND } from "./round";

export const getRealizedValue = (
  price: number,
  count: number,
  averageCostPerShare: number
) => {
  const sellSumm = price * count;
  const buySumm = averageCostPerShare * count;

  const result = ROUND(sellSumm - buySumm);

  return result;
};
