import { FormAddStock } from "@/components/FormAddStock/FormAddStock";
import { Table } from "@/components/Table/Table";
import { xataClient } from "@/config/xataClient";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect } from "react";

const TableDynamic = dynamic(
  () => import("@/components/Table/Table").then((res) => res.Table),
  { ssr: false }
);

export default function Home(props: { b: number }) {
  console.log(props.b);
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

export const getStaticProps = async () => {
  const a = await xataClient.db.transaction.getAll();
  const b = a.reduce((acc, item) => {
    if (item.price && item.count) {
      const res = item.price * item.count;
      return (acc += res);
    } else {
      return acc;
    }
  }, 0);

  return {
    props: { b },
  };
};
