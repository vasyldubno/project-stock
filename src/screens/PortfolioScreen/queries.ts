import { PortfolioService } from "@/services/PortfolioService";
import { StockPortfolioService } from "@/services/StockPortfolioService";
import { ISupaPortfolio, IUser } from "@/types/types";
import { useQuery } from "react-query";

export const usePortfolios = (user: IUser | null) => {
  const { data } = useQuery({
    queryKey: ["portfolios", { user }],
    queryFn: () => PortfolioService.getPortfolios(user),
    enabled: !!user,
  });
  return data?.data ?? null;
};

export const useStocks = (selectedPortfolio: ISupaPortfolio | null) => {
  const { data, isFetching } = useQuery({
    queryKey: ["stocks", { selectedPortfolio }],
    queryFn: () => StockPortfolioService.getStocks(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return {
    data: data ?? null,
    isFetching,
  };
};
