import { ISupaExit, ISupaStockPortfolio } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import s from "./TablePortfolio.module.scss";
import { FC } from "react";
import moment from "moment";

const columnHelper = createColumnHelper<ISupaExit>();

const Cell: FC<{ value: string | number | null }> = ({ value }) => {
  return (
    <>
      <p style={{ textAlign: "center" }}>{value}</p>
    </>
  );
};

export const columns = [
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: ({ getValue }) => <Cell value={getValue()} />,
  }),
  columnHelper.accessor("average_price_per_share", {
    header: "Average Buy Price",
    cell: ({ getValue }) => <Cell value={getValue()} />,
  }),
  columnHelper.accessor("finish_date", {
    header: "Exit Date",
    cell: ({ getValue }) => (
      <Cell value={moment(getValue()).format("DD.MM.YYYY")} />
    ),
  }),
  columnHelper.accessor("profit_margin", {
    header: "Margin",
    cell: ({ getValue }) => <Cell value={getValue()} />,
  }),
];
