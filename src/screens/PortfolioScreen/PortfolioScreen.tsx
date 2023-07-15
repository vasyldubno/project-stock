import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock } from "@/types/types";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TableDynamic = dynamic(
  () => import("@/components/Table/Table").then((res) => res.Table),
  { ssr: false }
);

export const PortfolioScreen = () => {
  useEffect(() => {
    const fetch = async () => {
      await axios.get(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/api/stock/price-current`
      );
    };
    // fetch();
  }, []);
  return (
    <>
      <TableDynamic />
    </>
  );
};
