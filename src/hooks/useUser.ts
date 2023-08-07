import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useUser = () => {
  const user = useContext(AuthContext);
  return user;
};
