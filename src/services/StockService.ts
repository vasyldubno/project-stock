import { CLIENT_URL } from "@/config/consts";
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
}
