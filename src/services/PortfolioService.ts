import { supabaseClient } from "@/config/supabaseClient";
import { ISupaPortfolio, IUser } from "@/types/types";
import { ROUND } from "@/utils/round";
import axios from "axios";
import moment from "moment";
import { StockPortfolioService } from "./StockPortfolioService";

export class PortfolioService {
  static async addTransaction(
    ticker: string,
    price: string,
    count: string,
    type: "buy" | "sell",
    date: string,
    portfolioId: string | undefined,
    userId: string
  ) {
    const response = await axios.post("/api/portfolio/add-transaction", {
      ticker,
      price: Number(price.replace(",", ".")),
      count: Number(count),
      type,
      date,
      portfolioId,
      userId: userId,
    });
    return response;
  }

  static async getPortfolioSectors(portfolio: ISupaPortfolio | null) {
    let sectors: { sector: string; count: number }[] = [];

    const stockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("is_trading", true)
      .eq("portfolio_id", portfolio?.id)
      .order("gain_margin", {
        ascending: false,
        nullsFirst: false,
      });

    if (stockPortfolio.data) {
      const arrayTickers = stockPortfolio.data.map((item) => item.ticker);
      const stocks = await supabaseClient
        .from("stock")
        .select()
        .in("ticker", arrayTickers);
      if (stocks.data) {
        stocks.data.forEach((stock) => {
          const sector = stock.sector;
          const existingSectorIndex = sectors.findIndex(
            (item) => item.sector === sector
          );
          if (existingSectorIndex !== -1) {
            sectors[existingSectorIndex].count++;
          } else {
            sectors.push({ sector, count: 1 });
          }
        });
      }
    }

    return sectors.sort((a, b) => b.count - a.count);
  }

  static async getDividendIncomeInMonth(
    year: number,
    portfolio: ISupaPortfolio | null
  ) {
    const resposne = await supabaseClient
      .from("dividend")
      .select()
      .eq("portfolio_id", portfolio?.id)
      .eq("year", year);

    const result = [
      {
        monthNumber: "01",
        monthName: "January",
        amount: 0,
      },
      {
        monthNumber: "02",
        monthName: "February",
        amount: 0,
      },
      {
        monthNumber: "03",
        monthName: "March",
        amount: 0,
      },
      {
        monthNumber: "03",
        monthName: "April",
        amount: 0,
      },
      {
        monthNumber: "05",
        monthName: "May",
        amount: 0,
      },
      {
        monthNumber: "06",
        monthName: "June",
        amount: 0,
      },
      {
        monthNumber: "07",
        monthName: "July",
        amount: 0,
      },
      {
        monthNumber: "08",
        monthName: "August",
        amount: 0,
      },
      {
        monthNumber: "09",
        monthName: "September",
        amount: 0,
      },
      {
        monthNumber: "10",
        monthName: "October",
        amount: 0,
      },
      {
        monthNumber: "11",
        monthName: "November",
        amount: 0,
      },
      {
        monthNumber: "12",
        monthName: "December",
        amount: 0,
      },
    ];

    if (resposne.data) {
      resposne.data.forEach((item) => {
        const month = moment(item.payDate).format("MM");
        const current = result.find((item) => item.monthNumber === month);
        if (current) {
          current.amount += item.totalAmount;
        }
      });
    }

    return result;
  }

  static async getDividendIncomeByYear(
    year: number,
    portfolio: ISupaPortfolio | null
  ) {
    const resposne = await supabaseClient
      .from("dividend")
      .select()
      .eq("portfolio_id", portfolio?.id)
      .eq("year", year);

    if (resposne.data) {
      const result = resposne.data.reduce(
        (acc, item) => (acc += item.totalAmount),
        0
      );
      return ROUND(result);
    }
  }

  static async getUpcomingDividends(portfolio: ISupaPortfolio | null) {
    const result = [
      {
        monthNumber: "01",
        monthName: "January",
        amount: 0,
      },
      {
        monthNumber: "02",
        monthName: "February",
        amount: 0,
      },
      {
        monthNumber: "03",
        monthName: "March",
        amount: 0,
      },
      {
        monthNumber: "03",
        monthName: "April",
        amount: 0,
      },
      {
        monthNumber: "05",
        monthName: "May",
        amount: 0,
      },
      {
        monthNumber: "06",
        monthName: "June",
        amount: 0,
      },
      {
        monthNumber: "07",
        monthName: "July",
        amount: 0,
      },
      {
        monthNumber: "08",
        monthName: "August",
        amount: 0,
      },
      {
        monthNumber: "09",
        monthName: "September",
        amount: 0,
      },
      {
        monthNumber: "10",
        monthName: "October",
        amount: 0,
      },
      {
        monthNumber: "11",
        monthName: "November",
        amount: 0,
      },
      {
        monthNumber: "12",
        monthName: "December",
        amount: 0,
      },
    ];

    if (portfolio && portfolio.id) {
      const supaStockPortfolio = await supabaseClient
        .from("stock_portfolio")
        .select()
        .eq("portfolio_id", portfolio.id)
        .eq("is_trading", true);

      if (supaStockPortfolio.data) {
        const tickers = supaStockPortfolio.data.map((item) => item.ticker);

        if (tickers.length) {
          const response = await supabaseClient
            .from("stock")
            .select()
            .in("ticker", tickers)
            .not("dividend_upcoming_value", "is", null);

          if (response.data) {
            response.data.forEach((item) => {
              const month = moment(item.dividend_upcoming_date).format("MM");
              const current = result.find((item) => item.monthNumber === month);
              if (current) {
                const newValue = ROUND(
                  (current.amount += item.dividend_upcoming_value ?? 0)
                );
                current.amount = newValue;
              }
            });
          }
        }

        return result;
      }
    }
  }

  static async getDividendsListByYear(
    portfolio: ISupaPortfolio | null,
    year: number
  ) {
    const result = await supabaseClient
      .from("dividend")
      .select()
      .order("payDate", { ascending: false })
      .eq("portfolio_id", portfolio?.id)
      .eq("year", year);

    if (result.data) {
      return result.data;
    }
    return null;
  }

  static async getUpcomingDividendsList(portfolio: ISupaPortfolio | null) {
    const supaStockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolio?.id)
      .eq("is_trading", true);

    if (supaStockPortfolio.data) {
      const tickers = supaStockPortfolio.data.map((item) => item.ticker);

      const response = await supabaseClient
        .from("stock")
        .select()
        .in("ticker", tickers)
        .not("dividend_upcoming_value", "is", null)
        .order("dividend_upcoming_date", { ascending: true });

      if (response.data) {
        return response.data;
      }
      return null;
    }
  }

  static async addPortfolio(title: string, user: IUser | null) {
    if (user && user.id) {
      const exist = await supabaseClient
        .from("portfolio")
        .select()
        .eq("title", title)
        .eq("user_id", user.id)
        .single();
      if (exist.data) {
        return {
          status: "Error",
          errorMessage: "Portfolio with this name exist. Select another name",
        };
      } else {
        const response = await supabaseClient
          .from("portfolio")
          .insert({
            title,
            user_id: user.id,
          })
          .select();
        if (response.data) {
          return { status: "Ok" };
        }
      }
    }
  }

  static async deletePortfolio(
    portfolio: ISupaPortfolio | null,
    user: IUser | null
  ) {
    const supaStockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolio?.id);

    if (supaStockPortfolio.data) {
      supaStockPortfolio.data.forEach(async (stockPortfolio) => {
        const today = moment(new Date()).format("YYYY-MM-DD");
        const supaStock = await supabaseClient
          .from("stock")
          .select()
          .eq("ticker", stockPortfolio.ticker)
          .single();

        if (supaStock.data && user && user.id) {
          await this.addTransaction(
            stockPortfolio.ticker,
            Number(supaStock.data.price_current).toString(),
            Number(stockPortfolio.amount_active_shares).toString(),
            "sell",
            today,
            portfolio?.id,
            user.id
          );
        }
      });
      await supabaseClient.from("portfolio").delete().eq("id", portfolio?.id);
    }
  }

  static async getPortfolios(user: IUser | null) {
    if (user && user.id) {
      const portfolios = await supabaseClient
        .from("portfolio")
        .select()
        .eq("user_id", user.id);

      return portfolios;
    }
  }

  static async getMarketValue(portfolio: ISupaPortfolio | null) {
    const supaStockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolio?.id);

    if (supaStockPortfolio.data) {
      const tickers = supaStockPortfolio.data.map((item) => item.ticker);

      if (tickers) {
        const supaStock = await supabaseClient
          .from("stock")
          .select()
          .in("ticker", tickers);

        if (supaStock.data) {
          const result = supaStock.data.reduce(
            (acc, stock) =>
              (acc +=
                Number(stock.price_current) *
                Number(
                  supaStockPortfolio.data.find(
                    (stockPortfolio) => stockPortfolio.ticker === stock.ticker
                  )?.amount_active_shares
                )),
            0
          );
          return ROUND(result);
        }
      }
    }
  }

  static async getCost(portfolio: ISupaPortfolio | null) {
    const supaStockPortfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("id", portfolio?.id)
      .single();
    if (supaStockPortfolio.data) {
      return supaStockPortfolio.data.cost;
    }
  }

  static async getGainValue(portfolio: ISupaPortfolio | null) {
    const stocks = await StockPortfolioService.getStocks(portfolio);

    if (Array.isArray(stocks) && stocks.length > 0) {
      const cost = stocks.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) *
            Number(item.average_cost_per_share)),
        0
      );

      const value = stocks.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) * Number(item.price_current)),
        0
      );

      const result = value - cost;
      return ROUND(result);
    }
  }

  static async getGainMargin(portfolio: ISupaPortfolio | null) {
    const stocks = await StockPortfolioService.getStocks(portfolio);
    if (stocks) {
      const cost = stocks.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) *
            Number(item.average_cost_per_share)),
        0
      );

      const value = stocks.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) * Number(item.price_current)),
        0
      );

      const result = ((value - cost) / cost) * 100;
      return ROUND(result);
    }
  }
}
