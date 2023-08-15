import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { IUser } from "@/types/types";
import { useQuery } from "react-query";

export const usePortfolios = (user: IUser | null) => {
  const { data } = useQuery({
    queryKey: ["portfolios", { user }],
    queryFn: () => PortfolioService.getPortfolios(user),
    enabled: !!user,
  });
  return data?.data ?? null;
};

export const usePriceCurrent = (ticker: string) => {
  const { data } = useQuery({
    queryKey: ["priceCurrent", { ticker }],
    queryFn: () => StockService.getPriceCurrentByTicker(ticker),
    enabled: !!ticker,
  });
  return data ?? null;
};
