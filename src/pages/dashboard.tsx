import { supabaseClient } from "@/config/supabaseClient";
import { DashboardScreen } from "@/screens/DashboardScreen/DashboardScreen";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { UserService } from "@/services/UserService";
import { IPortfolioStock, ISupaPortfolio, ISupaStock } from "@/types/types";
import { GetStaticProps, NextPage } from "next";

type DashboardPageProps = {
  portfolio: ISupaPortfolio | null;
  calendarEarning: ISupaStock[] | null;
  balance: number | null;
  stockPortfolio: IPortfolioStock[] | null;
};

const DashboardPage: NextPage<DashboardPageProps> = ({
  portfolio,
  calendarEarning,
  balance,
  stockPortfolio,
}) => {
  return (
    <>
      <DashboardScreen
        portfolio={portfolio}
        calendarEarning={calendarEarning}
        balance={balance}
        stockPortfolio={stockPortfolio}
      />
    </>
  );
};

export default DashboardPage;

export const getStaticProps: GetStaticProps = async () => {
  const supaPortfolio = await supabaseClient
    .from("portfolio")
    .select()
    .single();

  const supaCalendarEarning = await StockService.getCalendarEarnings();

  const responseBalance = await UserService.getBalance();

  const supaStockPortfolio = await PortfolioService.getPortfolioMap();

  return {
    props: {
      portfolio: supaPortfolio.data,
      calendarEarning: supaCalendarEarning.stocks,
      balance: responseBalance ?? null,
      stockPortfolio: supaStockPortfolio.portfolio,
    },
  };
};
