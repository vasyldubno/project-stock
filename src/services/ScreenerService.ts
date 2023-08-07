import { supabaseClient } from "@/config/supabaseClient";
import { IUser } from "@/types/types";

type AddScreener = {
  title: string;
  user: IUser | null;
  analyst?: string | undefined;
  de?: string | undefined;
  marginSafety?: string | undefined;
  pe?: string | undefined;
  priceGrowth?: string | undefined;
  roe?: string | undefined;
  sector?: string | undefined;
  industry?: string | undefined;
  payoutRatio?: string | undefined;
  dividendYield?: string | undefined;
};

export class ScreenerService {
  static async addScreener({
    analyst,
    de,
    marginSafety,
    pe,
    priceGrowth,
    roe,
    title,
    user,
    sector,
    dividendYield,
    industry,
    payoutRatio,
  }: AddScreener) {
    if (user && user.id) {
      return supabaseClient
        .from("screener")
        .insert({
          title,
          user_id: user.id,
          analyst: analyst && analyst.length > 1 ? analyst : null,
          de: de && de.length > 1 ? de : null,
          margin_safety:
            marginSafety && marginSafety.length > 1 ? marginSafety : null,
          pe: pe && pe.length > 1 ? pe : null,
          priceGrowth:
            priceGrowth && priceGrowth.length > 1 ? priceGrowth : null,
          roe: roe && roe.length > 1 ? roe : null,
          sector: sector && sector.length > 1 ? sector : null,
          industry: industry && industry.length > 1 ? industry : null,
          dividend_yield:
            dividendYield && dividendYield.length > 1 ? dividendYield : null,
          payout_ratio:
            payoutRatio && payoutRatio.length > 1 ? payoutRatio : null,
        })
        .select();
    }
  }

  static async getScreeners(user: IUser | null) {
    const response = await supabaseClient
      .from("screener")
      .select()
      .eq("user_id", user?.id);

    return response;
  }

  static async deleteScreener({
    screenerId,
    userId,
  }: {
    userId: string;
    screenerId: string;
  }) {
    await supabaseClient
      .from("screener")
      .delete()
      .eq("user_id", userId)
      .eq("id", screenerId);
  }
}
