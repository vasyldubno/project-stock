import { ISupaStockPortfolio } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import s from "./TablePortfolio.module.scss";
import { TableCardPrice } from "../TableCardPrice/TableCardPrice";

const columnHelper = createColumnHelper<ISupaStockPortfolio>();

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
  columnHelper.accessor("amount_active_shares", {
    header: "Shares",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ textAlign: "center" }}>{getValue()}</p>
        ) : (
          <p>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("gain_margin", {
    header: "Gain",
    cell: (info) => (
      <>
        {info.row.original.is_trading ? (
          <TableCardPrice content={info.getValue()?.toFixed(2)} />
        ) : (
          <TableCardPrice content={null} />
        )}
      </>
    ),
  }),
  columnHelper.accessor("price_growth_todat_perc", {
    header: "Today's Gain",
    cell: ({ getValue }) => (
      <p style={{ padding: "0 1rem" }}>
        {getValue() ? (
          <TableCardPrice content={getValue()?.toFixed(2)} />
        ) : (
          <TableCardPrice content={0} />
        )}
      </p>
    ),
  }),
  columnHelper.accessor("price_current", {
    header: "Market Price",
    cell: (info) => (
      <p style={{ textAlign: "center" }}>{info.getValue()?.toFixed(2)}</p>
    ),
  }),
  columnHelper.accessor("average_cost_per_share", {
    header: "Cost / Share",
    cell: ({ getValue }) => <p style={{ textAlign: "center" }}>{getValue()}</p>,
  }),
  columnHelper.accessor("total_dividend_income", {
    header: "Total Dividends",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()?.toFixed(2)}</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("total_return_margin", {
    header: "Total Return",
    cell: (info) => (
      <div style={{ textAlign: "center" }}>
        {info.row.original.total_return_margin ? (
          <p style={{ fontSize: "0.8rem" }}>
            {info.row.original.total_return_margin.toFixed(2)}%
          </p>
        ) : (
          <p style={{ fontSize: "0.8rem" }}>-- --</p>
        )}

        {info.row.original.total_return_margin ? (
          <p style={{ fontSize: "0.8rem" }}>
            {info.row.original.total_return_margin.toFixed(2)}
          </p>
        ) : (
          <p style={{ fontSize: "0.8rem" }}>-- --</p>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("price_growth", {
    header: "Target",
    cell: (info) => (
      <div style={{ textAlign: "center" }}>
        {/* {info.getValue()} */}
        {info.row.original.price_target ? (
          <p style={{ fontSize: "0.8rem" }}>
            {info.row.original.price_target.toFixed(2)}
          </p>
        ) : (
          <p style={{ fontSize: "0.8rem" }}>-- --</p>
        )}
        {info.row.original.price_growth ? (
          <p style={{ fontSize: "0.8rem" }}>
            {`${info.row.original.price_growth.toFixed(2)}`}%
          </p>
        ) : (
          <p style={{ fontSize: "0.8rem" }}>-- --</p>
        )}
      </div>
    ),
  }),

  columnHelper.accessor("perc_of_portfolio", {
    header: "% of Portfolio",
    cell: (info) => (
      <>
        <p style={{ textAlign: "center" }}>{info.getValue()?.toFixed(2)}%</p>
      </>
    ),
  }),
];
