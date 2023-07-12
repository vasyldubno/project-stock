import { xataClient } from "@/config/xataClient";

export const getAmountActiveShares = async (ticker: string) => {
  const activeShares = await xataClient.db.transaction
    .filter({ ticker, type: "buy" })
    .getAll();

  const amountActiveShares = activeShares.reduce((acc, item) => {
    if (item.count) {
      return (acc += item.count);
    }
    return acc;
  }, 0);

  return amountActiveShares;
};
