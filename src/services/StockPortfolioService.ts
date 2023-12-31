import { supabaseClient } from "@/config/supabaseClient";
import { ISupaPortfolio, ISupaStockPortfolio } from "@/types/types";

export class StockPortfolioService {
  static async getStocks(portfolio: ISupaPortfolio | null) {
    const supaStockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolio?.id)
      .eq("is_trading", true)
      .order("price_growth", { ascending: true });

    if (supaStockPortfolio.data) {
      const portfolioValue = supaStockPortfolio.data.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) * Number(item.price_current)),
        0
      );

      const tickers = supaStockPortfolio.data.map((item) => item.ticker);

      const supaStock = await supabaseClient
        .from("stock")
        .select()
        .in("ticker", tickers);

      if (supaStock.data) {
        const results = supaStockPortfolio.data.map((stockPortfolio) => {
          const stock = supaStock.data.find(
            (item) => item.ticker === stockPortfolio.ticker
          );
          const cost =
            Number(stockPortfolio.amount_active_shares) *
            Number(stockPortfolio.average_cost_per_share);
          const value =
            Number(stockPortfolio.amount_active_shares) *
            Number(stock?.price_current);
          const percOfPortfolio = (value / portfolioValue) * 100;

          const result: ISupaStockPortfolio = {
            amount_active_shares: stockPortfolio.amount_active_shares,
            average_cost_per_share: stockPortfolio.average_cost_per_share,
            created_at: stockPortfolio.created_at,
            exchange: stockPortfolio.exchange,
            id: stockPortfolio.id,
            is_trading: stockPortfolio.is_trading,
            ticker: stockPortfolio.ticker,
            portfolio_id: stockPortfolio.portfolio_id,
            startTradeDate: stockPortfolio.startTradeDate,
            total_dividend_income: stockPortfolio.total_dividend_income,
            total_return_margin: stockPortfolio.total_return_margin,
            total_return_value: stockPortfolio.total_return_value,
            lastDividendPayDate: stockPortfolio.lastDividendPayDate,
            last_change_portfolio: stockPortfolio.last_change_portfolio,
            gain_margin: ((value - cost) / cost) * 100,
            gain_value: value - cost,
            price_current: Number(stock?.price_current),
            price_growth: Number(stock?.price_growth),
            price_target: Number(stock?.price_target),
            dividend_upcoming_date: stock?.dividend_upcoming_date ?? null,
            dividend_upcoming_value: stock?.dividend_upcoming_value ?? null,
            perc_of_portfolio: percOfPortfolio,
            price_growth_todat_perc: stock?.price_growth_today_perc,
          };

          return result;
        });

        return results.sort(
          (a, b) => Number(a.price_growth) - Number(b.price_growth)
        );
      }
    }
  }
}
