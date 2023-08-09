import { User } from "firebase/auth";
import { Dispatch, SetStateAction, createContext } from "react";

export const AuthContext = createContext<{
  email: string | null;
  id: string | null;
  isLoaded: boolean;
  setUser: Dispatch<
    SetStateAction<{
      email: string;
      id: string;
    } | null>
  >;
} | null>(null);
