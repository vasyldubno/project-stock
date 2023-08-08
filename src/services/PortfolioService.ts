import { supabaseClient } from "@/config/supabaseClient";
import {
  ISupaStockPortfolio,
  ISupaDividendsInMonth,
  IPortfolio,
  IStockPortfolio,
  ISupaPortfolio,
  IUser,
} from "@/types/types";
import axios from "axios";
import { UserService } from "./UserService";
import { auth, db } from "@/config/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User, onAuthStateChanged } from "firebase/auth";
import moment from "moment";
import { ROUND } from "@/utils/round";
import { StockPortfolioService } from "./StockPortfolioService";

interface IResponseGetStocks {
  stocks: [];
}

interface IResponseGetPortfolio {
  gainRealizedPercentage: number;
  gainUnrealizedPercentage: number;
  portfolio: ISupaStockPortfolio[];
}

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
    // const user = await UserService.getUser();
    // console.log(user);
    // if (user.data.user) {
    //   return axios.post("/api/portfolio/add-transaction", {
    //     ticker,
    //     price: Number(price),
    //     count: Number(count),
    //     type,
    //     date,
    //     portfolioId,
    //     userId: user.data.user.id,
    //   });
    // }

    const response = await axios.post("/api/portfolio/add-transaction", {
      ticker,
      price: Number(price),
      count: Number(count),
      type,
      date,
      portfolioId,
      userId: userId,
    });
    return response;
  }

  // static async getStocks() {
  //   const stocks = await supabaseClient
  //     .from("stock")
  //     .select()
  //     .gte("roe", 20)
  //     .gte("price_growth", 15)
  //     .gte("analystRatingBuy", 10)
  //     .lte("pe", 30)
  //     .gt("pe", 0)
  //     .gte("gfValue", 10)
  //     .lte("de", 3)
  //     .order("price_growth", { ascending: false });

  //   const stockPortfolio = await supabaseClient
  //     .from("stock_portfolio")
  //     .select()
  //     .eq("is_trading", true);

  //   if (stocks.data && stockPortfolio.data) {
  //     return stocks.data.filter(
  //       (stock) =>
  //         !stockPortfolio.data.some(
  //           (stockPortfolio) => stockPortfolio.ticker === stock.ticker
  //         )
  //     );
  //   }
  // }

  static async getPortfolioStocks() {
    const user = await UserService.getUser();
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

  static async getPortfolioMap() {
    const portfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("is_trading", true)
      .order("perc_of_portfolio", {
        ascending: false,
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
      .order("gain_margin", {
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

  // static async updatePortfolio() {
  //   return axios.get(
  //     `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-portfolio`
  //   );
  // }

  static async updateDividends(userId: string) {
    return axios.post(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/portfolio/update-dividends`,
      { userId }
    );
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

    const response = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolio?.id)
      .not("dividend_upcoming_value", "is", null)
      .order("dividend_upcoming_date", { ascending: true });

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

    return result;
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

  static async getPortfolios(user: IUser | null) {
    if (user) {
      const portfolios = await supabaseClient
        .from("portfolio")
        .select()
        .eq("user_id", user.id);

      return portfolios;
    }

    // if (user && user.uid) {
    //   const portfolioRef = query(
    //     collection(db, "portfolio"),
    //     where("userId", "==", user.uid)
    //   );
    //   const portfolios = (await getDocs(portfolioRef)).docs.map((item) => {
    //     return { ...item.data(), id: item.id };
    //   });
    //   return portfolios as IPortfolio[];
    // }
  }

  static async getMarketValue(portfolioId: string) {
    // const stockPortfolioRef = query(
    //   collection(db, "stock_portfolio"),
    //   where("portfolioId", "==", portfolioId)
    // );
    // const stockPortfolio = (await getDocs(stockPortfolioRef)).docs.map((item) =>
    //   item.data()
    // ) as IStockPortfolio[];
    // const result = stockPortfolio.reduce(
    //   (acc, item) => (acc += item.amountActiveShares * item.priceCurrent),
    //   0
    // );
    // return result;

    const supaStockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolioId);
    if (supaStockPortfolio.data) {
      const result = supaStockPortfolio.data.reduce(
        (acc, item) =>
          (acc +=
            Number(item.amount_active_shares) * Number(item.price_current)),
        0
      );
      return result;
    }
  }

  static async getGainValue(portfolio: ISupaPortfolio | null) {
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
