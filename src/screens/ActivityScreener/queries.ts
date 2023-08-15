import { PortfolioService } from "@/services/PortfolioService";
import { TransactionService } from "@/services/TransactionService";
import { ISupaPortfolio, IUser } from "@/types/types";
import { useQuery } from "react-query";

export const useTransactions = ({
  portfolio,
}: {
  portfolio: ISupaPortfolio | null;
}) => {
  const { data } = useQuery({
    queryKey: ["transactions", { portfolio }],
    queryFn: () => TransactionService.getTransactionByPortfolio(portfolio),
    enabled: !!portfolio,
  });
  return data ?? null;
};

export const usePortfolios = (user: IUser | null) => {
  const { data } = useQuery({
    queryKey: ["portfolios", { user }],
    queryFn: () => PortfolioService.getPortfolios(user),
    enabled: !!user,
  });
  return data?.data ?? null;
};
