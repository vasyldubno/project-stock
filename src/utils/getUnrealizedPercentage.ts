import { xataClient } from "@/config/xataClient";

export const getUnrealizedPercentage = async (
  ticker: string,
  marketPrice: number
) => {
  const transactions = await xataClient.db.transaction
    .filter("ticker", ticker)
    .getAll();

  const result = transactions.reduce((acc, item) => {
    if (item.price) {
      const res = Number(
        (((marketPrice - item.price) / item.price) * 100).toFixed(2)
      );
      return (acc += res);
    }
    return acc;
  }, 0);

  return result;
};
