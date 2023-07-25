import { CLIENT_URL } from "@/config/consts";
import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";

export class StockService {
  static async updatePriceCurrent() {
    return axios.get(`${CLIENT_URL}/api/stock/price-current`);
  }

  static async getCalendarEarnings() {
    const response = await axios.get(
      `${CLIENT_URL}/api/stock/calendar-earnings`
    );
    return response.data;
  }

  static async updateFundamentals() {
    return axios.get(`${CLIENT_URL}/api/stock/fundamentals`);
  }

  static async updateUpcomingDividends() {
    return axios.get(`${CLIENT_URL}/api/stock/update-upcome-dividends`);
  }

  static async getStocksDividends() {
    const response = await supabaseClient
      .from("stock")
      .select()
      .gte("dividendYield", 1)
      // .lte("payoutRation", 70)
      // .lte("pe", 30)
      // .lte("de", 3)
      .gte("price_growth", 5)
      // .gte("roe", 20)
      .gte("analystRatingBuy", 5)
      .or("isDividendAristocrat.eq.true,isDividendKing.eq.true");

    return response.data;
  }
}
