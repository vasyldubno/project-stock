import { supabaseClient } from "@/config/supabaseClient";
import { IPortfolioStock } from "@/types/types";
import axios from "axios";

interface IResponseGetStocks {
  stocks: [];
}

interface IResponseGetPortfolio {
  gainRealizedPercentage: number;
  gainUnrealizedPercentage: number;
  portfolio: IPortfolioStock[];
}

export class PortfolioService {
  static async addTransaction(
    ticker: string,
    price: number,
    count: number,
    type: "buy" | "sell"
  ) {
    return axios.post("/api/portfolio/add-transaction", {
      ticker,
      price,
      count,
      type,
    });
  }

  static async getStocks() {
    const stocks = await supabaseClient
      .from("stock")
      .select()
      .gte("roe", 20)
      .gte("price_growth", 15)
      .gte("analystRatingBuy", 10)
      .lte("pe", 30)
      .gt("pe", 0)
      .order("price_growth", { ascending: false });

    const stockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("is_trading", true);

    if (stocks.data && stockPortfolio.data) {
      return stocks.data.filter(
        (stock) =>
          !stockPortfolio.data.some(
            (stockPortfolio) => stockPortfolio.ticker === stock.ticker
          )
      );
    }
  }

  static async getPortfolio() {
    const portfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .order("gain_unrealized_percentage", {
        ascending: false,
        nullsFirst: false,
      });

    return {
      portfolio: portfolio.data,
    };
  }

  static async updatePortfolio() {
    return axios.get(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-portfolio`
    );
  }

  static async updateDividends() {
    return axios.get(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-dividends`
    );
  }
}
