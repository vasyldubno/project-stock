import { ISupaExit, ISupaStockPortfolio } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import s from "./styles.module.scss";
import { FC } from "react";
import moment from "moment";
import { TableCardPrice } from "@/components/TableCardPrice/TableCardPrice";

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
    cell: ({ getValue }) => (
      <p className={s.cell__ticker}>
        <Link href={`/stock/${getValue()}`}>{getValue()}</Link>
      </p>
    ),
  }),
  columnHelper.accessor("average_price_per_share", {
    header: "Average Buy Price",
    cell: ({ getValue }) => <Cell value={`$${getValue()}`} />,
  }),
  columnHelper.accessor("profit_margin", {
    header: "Margin",
    cell: ({ getValue }) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <TableCardPrice content={getValue()} />
      </div>
    ),
  }),
  columnHelper.accessor("start_date", {
    header: "Start Date",
    cell: ({ getValue }) => (
      <Cell value={moment(getValue()).format("DD.MM.YYYY")} />
    ),
  }),
  columnHelper.accessor("finish_date", {
    header: "Exit Date",
    cell: ({ getValue }) => (
      <Cell value={moment(getValue()).format("DD.MM.YYYY")} />
    ),
  }),
];
