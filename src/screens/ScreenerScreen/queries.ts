import { ScreenerService } from "@/services/ScreenerService";
import { StockService } from "@/services/StockService";
import { ISupaScreener, ISupaStock, IUser } from "@/types/types";
import { Dispatch, SetStateAction } from "react";
import { useQuery } from "react-query";

export const useStocks = (
  selectedScreener: ISupaScreener | null,
  user: IUser | null
) => {
  const { data } = useQuery({
    queryKey: ["stocks", { selectedScreener, user }],
    queryFn: () => StockService.getStocks(selectedScreener, user),
    enabled: !!user && !!selectedScreener,
  });

  if (data) {
    const result: ISupaStock[] = data.map((item) => ({
      ...item,
      yearRange:
        (Number(item.price_current) / Number(item.price_year_high)) * 100,
    }));
    return result;
  }
};

export const useScreeners = (
  user: IUser | null,
  setScreeners: Dispatch<SetStateAction<ISupaScreener[] | null>>,
  setSelectedScreener: Dispatch<SetStateAction<ISupaScreener | null>>
) => {
  useQuery({
    queryKey: ["screeners", { user }],
    queryFn: () => ScreenerService.getScreeners(user),
    enabled: !!user,
    onSuccess(data) {
      if (data.data) {
        setScreeners(data.data);
        setSelectedScreener((prev) => {
          if (!prev) {
            return data.data[0];
          }
          return prev;
        });
      }
    },
  });
};
