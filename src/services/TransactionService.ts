import { supabaseClient } from "@/config/supabaseClient";
import { ISupaPortfolio } from "@/types/types";

export class TransactionService {
  static async getTransactionByPortfolio(portfolio: ISupaPortfolio | null) {
    if (portfolio) {
      const supaPortfolio = await supabaseClient
        .from("transaction")
        .select()
        .order("date", { ascending: false })
        .eq("portfolio_id", portfolio.id);
      if (supaPortfolio.data) {
        return supaPortfolio.data;
      }
    }
    return null;
  }
}
