import { ScreenerScreen } from "@/screens/ScreenerScreen/ScreenerScreen";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import { GetStaticProps } from "next";
import { useEffect } from "react";

const ScreenerPage = ({ data }: { data: ISupaStock[] }) => {
  useEffect(() => {
    StockService.updatePriceCurrent();
  }, []);

  return <ScreenerScreen data={data} />;
};

export default ScreenerPage;

export const getStaticProps: GetStaticProps = async () => {
  const data = await PortfolioService.getStocks();
  return { props: { data } };
};
