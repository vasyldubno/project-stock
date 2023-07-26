import { supabaseClient } from "@/config/supabaseClient";
import { Dispatch, SetStateAction } from "react";

export class UserService {
  static async getBalance() {
    const result = await supabaseClient
      .from("user")
      .select()
      .eq("username", "vasyldubno")
      .single();

    if (result.data) {
      return result.data.balance;
    }
  }
}
