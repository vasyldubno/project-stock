import { TITLE } from "@/config/consts";
import { ScreenerScreen } from "@/screens/ScreenerScreen/ScreenerScreen";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

const ScreenerPage = ({ data }: { data: ISupaStock[] }) => {
  return (
    <>
      {/* <Head>
        <title>Screener | {TITLE}</title>
      </Head> */}
      <ScreenerScreen data={data} />
    </>
  );
};

export default ScreenerPage;

export const getStaticProps: GetStaticProps = async () => {
  const data = await PortfolioService.getStocks();
  return { props: { data } };
};
