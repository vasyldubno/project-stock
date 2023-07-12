import { FormAddStock } from "@/components/FormAddStock/FormAddStock";
import { Table } from "@/components/Table/Table";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

const TableDynamic = dynamic(
  () => import("@/components/Table/Table").then((res) => res.Table),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <FormAddStock />
      <button
        onClick={async () => {
          const response = await PortfolioService.getStocks();
          console.log(response.data.stocks);
        }}
      >
        get stocks
      </button>
      <button
        onClick={async () => {
          const response = await PortfolioService.getPortfolio();
          console.log(response.data);
        }}
      >
        get portfolio
      </button>
      <Link href={"/portfolio"}>Portfolio</Link>
      {/* <Table /> */}
      <TableDynamic />
    </>
  );
}
