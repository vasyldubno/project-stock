import { db } from "@/config/firebaseConfig";
import { supabaseClient } from "@/config/supabaseClient";
import { IUser } from "@/types/types";
import { doc, getDoc } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export class UserService {
  static async getBalance(user: IUser | null) {
    // const user = (await getDoc(doc(db, "user", email))).data();
    // if (user) {
    //   return user.balance;
    // }

    const supaUser = await supabaseClient
      .from("user")
      .select()
      .eq("id", user?.id)
      .single();

    if (supaUser.data) {
      return supaUser.data.balance;
    }
  }

  static async getUser() {
    const response = await supabaseClient.auth.getUser();
    if (response.error) {
      return { error: response.error.message };
    }

    if (response.data) {
      const userSupa = await supabaseClient
        .from("user")
        .select()
        .eq("id", response.data.user?.id)
        .single();
      if (userSupa.data) {
        return {
          email: userSupa.data.email,
          id: userSupa.data.id,
        };
      }
    }
  }

  static async signOut() {
    await supabaseClient.auth.signOut();
  }
}
