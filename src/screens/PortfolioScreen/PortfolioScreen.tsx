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
  return (
    <>
      <TableDynamic />
    </>
  );
};
