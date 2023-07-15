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
      .gte("priceGrowth", 20)
      .gte("analystRatingBuy", 10)
      .lte("pe", 30)
      .gt("pe", 0);

    const stockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("isTrading", true);

    if (stocks.data && stockPortfolio.data) {
      return stocks.data.filter(
        (stock) =>
          !stockPortfolio.data.some(
            (stockPortfolio) => stockPortfolio.ticker === stock.ticker
          )
      );
    }

    // return axios.get<IResponseGetStocks>("/api/stock/get-stocks");
  }

  static async getPortfolio() {
    const portfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .order("gain_unrealized_percentage", {
        ascending: false,
        nullsFirst: false,
      });

    const gainRealizedPercentage = async () => {
      if (portfolio.data) {
        const result = portfolio.data.reduce((acc, stock) => {
          if (!stock.gainRealizedPercentage) {
            return acc;
          } else {
            return (acc += stock.gainRealizedPercentage);
          }
        }, 0);
        return Number(result.toFixed(2));
      }
    };

    function isNegative(num: number) {
      if (Math.sign(num) === -1) {
        return true;
      }

      return false;
    }

    const gainUnrealizedPercentage = async () => {
      const portfolio = await supabaseClient
        .from("stock_portfolio")
        .select()
        .eq("isTrading", true)
        .order("gain_unrealized_percentage", { ascending: false });

      if (portfolio.data) {
        const result = portfolio.data.reduce((acc, stock) => {
          if (stock.gain_unrealized_percentage) {
            if (!stock.gain_unrealized_percentage) {
              return acc;
            } else {
              if (isNegative(stock.gain_unrealized_percentage)) {
                return (acc -= Math.abs(stock.gain_unrealized_percentage));
              }
              return (acc += stock.gain_unrealized_percentage);
            }
          }

          return acc;
        }, 0);

        return Number(result.toFixed(2));
      }
    };

    return {
      gainRealizedPercentage: await gainRealizedPercentage(),
      gainUnrealizedPercentage: await gainUnrealizedPercentage(),
      portfolio: portfolio.data,
    };
  }

  static async updatePortfolio() {
    return axios.get(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-portfolio`
    );
  }
}
