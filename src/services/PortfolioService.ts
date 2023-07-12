import axios from "axios";

interface IResponseGetStocks {
  stocks: [];
}

interface IResponseGetPortfolio {
  gainRealizedPercentage: number;
  gainUnrealizedPercentage: number;
  portfolio: {
    averageCostPerShare: number;
    exchange: string;
    gainRealizedPercentage: number;
    gainRealizedValue: number;
    gainUnrealizedPercentage: number;
    gainUnrealizedValue: number;
    id: string;
    isTrading: true;
    lastDividendPayDate: string;
    marketPrice: number;
    startTradeDate: string;
    ticker: string;
  }[];
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
    return axios.get<IResponseGetStocks>("/api/stock/get-stocks");
  }

  static async getPortfolio() {
    return axios.get<IResponseGetPortfolio>("/api/portfolio/get-portfolio");
  }
}
