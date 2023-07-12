export const getRealizedPercentage = (
  price: number,
  count: number,
  averageCostPerShare: number
) => {
  const sellSumm = price * count;
  const buySumm = averageCostPerShare * count;

  const result = Number((((sellSumm - buySumm) / buySumm) * 100).toFixed(2));

  return result;
};
