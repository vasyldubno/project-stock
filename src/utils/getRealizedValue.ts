export const getRealizedValue = (
  price: number,
  count: number,
  averageCostPerShare: number
) => {
  const sellSumm = price * count;
  const buySumm = averageCostPerShare * count;

  const result = Number((sellSumm - buySumm).toFixed(2));

  return result;
};
