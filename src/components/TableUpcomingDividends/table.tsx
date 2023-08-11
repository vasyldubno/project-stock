import { ISupaDividend, ISupaStock, ISupaStockPortfolio } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import s from "./styles.module.scss";
import moment from "moment";

const columnHelper = createColumnHelper<ISupaStock>();

export const columns = [
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: (info) => (
      <div style={{ textAlign: "center" }}>
        <Link className={s.cell__ticker} href={`/stock/${info.getValue()}`}>
          {info.getValue()}
        </Link>
      </div>
    ),
  }),

  columnHelper.accessor("dividend_upcoming_date", {
    header: "Date",
    cell: ({ getValue }) => (
      <p style={{ textAlign: "center" }}>
        {moment(getValue()).format("DD.MM.YYYY")}
      </p>
    ),
  }),

  columnHelper.accessor("dividend_upcoming_value", {
    header: "Dividend / Share",
    cell: ({ getValue }) => (
      <p style={{ textAlign: "center" }}>${getValue()?.toFixed(2)}</p>
    ),
  }),
];
