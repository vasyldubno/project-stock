import { xataClient } from "@/config/xataClient";

export const averageCostPerShare = async (
  ticker: string,
  price: number,
  count: number,
  type: "buy" | "sell"
) => {
  const xataStock = await xataClient.db.transaction
    .filter("ticker", ticker)
    .getAll();

  if (!xataStock) {
    return price;
  }

  if (xataStock) {
    const prevSumm = xataStock.reduce((acc, item) => {
      if (item.price && item.count && item.type === "buy") {
        return (acc += item.price * item.count);
      }

      if (item.price && item.count && item.type === "sell") {
        return (acc -= item.price * item.count);
      }

      return acc;
    }, 0);

    const prevCount = xataStock.reduce((acc, item) => {
      if (item.count && item.type === "buy") {
        return (acc += item.count);
      }

      if (item.count && item.type === "sell") {
        return (acc -= item.count);
      }

      return acc;
    }, 0);

    const updatedSumm = () => {
      if (type === "buy") {
        return prevSumm + price * count;
      }
      if (type === "sell") {
        return prevSumm - price * count;
      }
      return 0;
    };

    const updatedCount = () => {
      if (type === "buy") {
        return prevCount + count;
      }
      if (type === "sell") {
        return prevCount - count;
      }
      return 0;
    };

    const result = updatedSumm() / updatedCount();

    return result;
  }
};
