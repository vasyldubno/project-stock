import { supabaseClient } from "@/config/supabaseClient";
import { IPortfolioStock, ISupaDividendsInMonth } from "@/types/types";
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
      .gte("gfValue", 10)
      .lte("de", 3)
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
      .eq("is_trading", true)
      .order("price_growth", {
        ascending: true,
        nullsFirst: false,
      });

    return {
      portfolio: portfolio.data,
    };
  }

  static async getPortfolioSectors() {
    let sectors: { sector: string; count: number }[] = [];

    const stocks = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("is_trading", true)
      .order("gain_unrealized_percentage", {
        ascending: false,
        nullsFirst: false,
      });

    if (stocks.data) {
      const arrayTickers = stocks.data.map((item) => item.ticker);
      const resultPromise = arrayTickers.map(async (ticker) => {
        const stock = await supabaseClient
          .from("stock")
          .select()
          .eq("ticker", ticker)
          .select()
          .single();
        if (stock.data) {
          const sector = stock.data.sector;
          const existingSectorIndex = sectors.findIndex(
            (item) => item.sector === sector
          );
          if (existingSectorIndex !== -1) {
            sectors[existingSectorIndex].count++;
          } else {
            sectors.push({ sector: sector, count: 1 });
          }
        }
      });
      await Promise.all(resultPromise);
    }

    return sectors.sort((a, b) => b.count - a.count);
  }

  static async getTransactions() {
    const response = await supabaseClient
      .from("transaction")
      .select()
      .order("date", { ascending: false });
    if (response.data) {
      return response.data;
    }
    return [];
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

  static async getDividendIncomeInMonth(year: number) {
    const resposne = await supabaseClient
      .from("dividend_in_month")
      .select()
      .eq("year", year)
      .single();

    const filtered = {};

    if (resposne.data) {
      for (const key in resposne.data) {
        // @ts-ignore
        if (
          // @ts-ignore
          key !== "id" &&
          key !== "year" &&
          key !== "created_at"
        ) {
          // @ts-ignore
          filtered[key] = resposne.data[key];
        }
      }
    }

    return filtered;
  }

  static async getUpcomingDividends() {
    const convertMonth = (month: string) => {
      if (month === "01") {
        return "January";
      }
      if (month === "02") {
        return "February";
      }
      if (month === "03") {
        return "March";
      }
      if (month === "04") {
        return "April";
      }
      if (month === "05") {
        return "May";
      }
      if (month === "06") {
        return "June";
      }
      if (month === "07") {
        return "July";
      }
      if (month === "08") {
        return "August";
      }
      if (month === "09") {
        return "September";
      }
      if (month === "10") {
        return "October";
      }
      if (month === "11") {
        return "November";
      }
      if (month === "12") {
        return "December";
      }
      return "January";
    };

    function sumValuesByMonth(arr: IPortfolioStock[]) {
      const monthlySums = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
      };

      arr.forEach((item) => {
        if (item.dividend_upcoming_date && item.dividend_upcoming_value) {
          const month = item.dividend_upcoming_date.slice(5, 7);
          const nameMonth = convertMonth(month);
          // if (!monthlySums[month]) {
          //   monthlySums[month] = 0;
          // }
          monthlySums[nameMonth] += item.dividend_upcoming_value;
        }
      });

      return Object.keys(monthlySums).map((month) => {
        return {
          month: month.padStart(2, "0"),
          //@ts-ignore
          value: monthlySums[month],
        };
      });
    }

    const response = await supabaseClient
      .from("stock_portfolio")
      .select()
      .not("dividend_upcoming_value", "is", null)
      .order("dividend_upcoming_date", { ascending: true });

    if (response.data) {
      const result = sumValuesByMonth(response.data);
      const sortedResult = result.sort(
        (a, b) => parseInt(a.month) - parseInt(b.month)
      );
      return sortedResult;
    }
  }
}
