import { supabaseClient } from "@/config/supabaseClient";

export const averageCostPerShare = async (
  ticker: string,
  price: number,
  count: number,
  type: "buy" | "sell",
  portfolioId: string
) => {
  const stock = await supabaseClient
    .from("transaction")
    .select()
    .eq("ticker", ticker)
    .eq("portfolio_id", portfolioId);

  if (!stock.data) {
    return price;
  }

  if (stock.data) {
    const prevSumm = stock.data.reduce((acc, item) => {
      if (item.price && item.count && item.type === "buy") {
        return (acc += item.price * item.count);
      }
      if (item.price && item.count && item.type === "sell") {
        return (acc -= item.price * item.count);
      }
      return acc;
    }, 0);

    const prevCount = stock.data.reduce((acc, item) => {
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

    return Number(result.toFixed(2));
  }
};
