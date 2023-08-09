import { PortfolioService } from "@/services/PortfolioService";
import { StockPortfolioService } from "@/services/StockPortfolioService";
import { StockService } from "@/services/StockService";
import { UserService } from "@/services/UserService";
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

export const useCalendarEarning = (
  user: IUser | null,
  portfolio: ISupaPortfolio | null
) => {
  const { data } = useQuery({
    queryKey: ["calendarEarning", { user, portfolio }],
    queryFn: () => StockService.getCalendarEarnings(user, portfolio),
    enabled: !!user,
  });
  return data ?? null;
};

export const useDividendIncomeInMonth = (
  selectedPortfolio: ISupaPortfolio | null
) => {
  const { data } = useQuery({
    queryKey: ["dividendIncomeInMonth", { selectedPortfolio }],
    queryFn: () =>
      PortfolioService.getDividendIncomeInMonth(
        new Date().getUTCFullYear(),
        selectedPortfolio
      ),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const useUpcomingDividends = (
  selectedPortfolio: ISupaPortfolio | null
) => {
  const { data } = useQuery({
    queryKey: ["upcomingDividends", { selectedPortfolio }],
    queryFn: () => PortfolioService.getUpcomingDividends(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const useStockPortfolio = (selectedPortfolio: ISupaPortfolio | null) => {
  const { data } = useQuery({
    queryKey: ["stockPortfolio", { selectedPortfolio }],
    queryFn: () => StockPortfolioService.getStocks(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const usePortfolioGainValue = (
  selectedPortfolio: ISupaPortfolio | null
) => {
  const { data } = useQuery({
    queryKey: ["gainValue", { selectedPortfolio }],
    queryFn: () => PortfolioService.getGainValue(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const usePortfolioGainMargin = (
  selectedPortfolio: ISupaPortfolio | null
) => {
  const { data } = useQuery({
    queryKey: ["gainMargin", { selectedPortfolio }],
    queryFn: () => PortfolioService.getGainMargin(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const usePortfolioValue = (selectedPortfolio: ISupaPortfolio | null) => {
  const { data } = useQuery({
    queryKey: ["value", { selectedPortfolio }],
    queryFn: () => PortfolioService.getMarketValue(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};

export const usePortfolioCost = (selectedPortfolio: ISupaPortfolio | null) => {
  const { data } = useQuery({
    queryKey: ["cost", { selectedPortfolio }],
    queryFn: () => PortfolioService.getCost(selectedPortfolio),
    enabled: !!selectedPortfolio,
  });
  return data ?? null;
};
