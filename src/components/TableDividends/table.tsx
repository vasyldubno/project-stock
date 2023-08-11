import { ISupaDividend, ISupaStockPortfolio } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import s from "./styles.module.scss";
import moment from "moment";

const columnHelper = createColumnHelper<ISupaDividend>();

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
  columnHelper.accessor("payDate", {
    header: "Pay Date",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ textAlign: "center" }}>
            {moment(getValue()).format("DD.MM.YYYY")}
          </p>
        ) : (
          <p>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("dividendYield", {
    header: "Dividend Yield",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ textAlign: "center" }}>{getValue()}%</p>
        ) : (
          <p>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("dividendValue", {
    header: "Dividend / Share",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ textAlign: "center" }}>${getValue().toFixed(2)}</p>
        ) : (
          <p>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("totalAmount", {
    header: "Total Dividends",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ textAlign: "center" }}>${getValue().toFixed(2)}</p>
        ) : (
          <p>-- --</p>
        )}
      </>
    ),
  }),
];
