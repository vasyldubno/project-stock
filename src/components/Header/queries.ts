import { UserService } from "@/services/UserService";
import { IUser } from "@/types/types";
import { useQuery } from "react-query";

export const useBalance = (user: IUser | null) => {
  const { data } = useQuery({
    queryKey: ["balance", { user }],
    queryFn: () => UserService.getBalance(user),
    enabled: !!user,
  });
  return data ?? null;
};
