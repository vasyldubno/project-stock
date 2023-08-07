import { User } from "firebase/auth";
import { Dispatch, SetStateAction, createContext } from "react";

export const AuthContext = createContext<{
  email?: string;
  id?: string;
  setUser: Dispatch<
    SetStateAction<{
      email: string;
      id: string;
    } | null>
  >;
} | null>(null);
