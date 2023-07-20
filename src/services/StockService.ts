import { CLIENT_URL } from "@/config/consts";
import axios from "axios";

export class StockService {
  static async updatePriceCurrent() {
    return axios.get(`${CLIENT_URL}/api/stock/price-current`);
  }

  static async getCalendarEarnings() {
    const year = new Date().getUTCFullYear();
    const month = new Date().getUTCMonth() + 1;
    const day = new Date().getUTCDate();

    const response = await axios.get(
      `${CLIENT_URL}/api/stock/calendar-earnings`
    );
    return response.data;
  }
}
