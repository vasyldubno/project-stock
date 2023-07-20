export const getTotalReturnMarginStock = (
  totalReturnValue: number | null,
  currentReturnValue: number,
  amountActiveShares: number,
  averageCostPerShare: number
) => {
  if (totalReturnValue) {
    const updatedTotalReturnValue = totalReturnValue + currentReturnValue;
    const marketCap = amountActiveShares * averageCostPerShare;

    const result = Number(
      ((updatedTotalReturnValue / marketCap) * 100).toFixed(2)
    );

    return result;
  } else {
    const updatedTotalReturnValue = currentReturnValue;
    const marketCap = amountActiveShares * averageCostPerShare;

    const result = Number(
      ((updatedTotalReturnValue / marketCap) * 100).toFixed(2)
    );

    return result;
  }
};
