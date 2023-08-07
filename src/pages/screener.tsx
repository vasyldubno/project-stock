import { TITLE } from "@/config/consts";
import { ScreenerScreen } from "@/screens/ScreenerScreen/ScreenerScreen";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useEffect } from "react";

const ScreenerPage = () => {
  return (
    <>
      <ScreenerScreen />
    </>
  );
};

export default ScreenerPage;
