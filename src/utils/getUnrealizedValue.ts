import { xataClient } from "@/config/xataClient";

export const getUnrealizedValue = async (
  ticker: string,
  marketPrice: number
) => {
  const transactions = await xataClient.db.transaction
    .filter("ticker", ticker)
    .getAll();

  const result = transactions.reduce((acc, item) => {
    if (item.price) {
      const res = Number((marketPrice - item.price).toFixed(2));
      return (acc += res);
    }
    return acc;
  }, 0);

  return result;
};
