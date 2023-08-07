import { supabaseClient } from "@/config/supabaseClient";
import { ScreenerService } from "@/services/ScreenerService";
import { ISupaScreener, IUser } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const supaScreenerInsert = (
  user: IUser | null,
  setScreeners: Dispatch<SetStateAction<ISupaScreener[] | null>>
) => {
  return supabaseClient
    .channel("screener-insert")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "screener",
      },
      async (payload) => {
        console.log(payload);
        if (user) {
          const newState = await ScreenerService.getScreeners(user);
          setScreeners(newState.data);
        }
      }
    )
    .subscribe();
};

export const supaScreenerDelete = (
  user: IUser | null,
  setScreeners: Dispatch<SetStateAction<ISupaScreener[] | null>>
) => {
  return supabaseClient
    .channel("screener-delete")
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "screener",
      },
      async (payload) => {
        if (user) {
          const newState = await ScreenerService.getScreeners(user);
          setScreeners(newState.data);
        }
      }
    )
    .subscribe();
};
