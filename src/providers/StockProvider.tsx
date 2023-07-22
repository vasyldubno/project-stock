import { StockService } from "@/services/StockService";
import { FC, PropsWithChildren, useEffect } from "react";

export const StockProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    StockService.updatePriceCurrent();
    StockService.updateFundamentals();
  }, []);
  return <>{children}</>;
};