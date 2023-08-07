import { supabaseClient } from "@/config/supabaseClient";
import { ISupaPortfolio } from "@/types/types";
import axios from "axios";

export class ExitService {
  static async getExits(portfolio: ISupaPortfolio | null) {
    const supaExit = await supabaseClient
      .from("exit")
      .select()
      .eq("portfolio_id", portfolio?.id);
    return supaExit;
  }
}
