import { ISupaStock } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import millify from "millify";
import Link from "next/link";
import s from "./styles.module.scss";

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
  columnHelper.accessor("price_current", {
    header: "Price Current",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    cell: (info) => (
      <p style={{ textAlign: "center" }}>
        {millify(Number(info.getValue()), { precision: 1 })}
      </p>
    ),
  }),
  columnHelper.accessor("pe", {
    header: "PE",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("roe", {
    header: "ROE",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("de", {
    header: "D/E",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("gross_margin", {
    header: "Gross Margin",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("net_margin", {
    header: "Net Margin",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("eps_growth_past_5y", {
    header: "EPS Growth 5y",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("beta", {
    header: "Beta",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("gfValueMargin", {
    header: "Instrinic Margin",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}%</p>,
  }),
  columnHelper.accessor("price_year_high", {
    header: "52 Week Range",
    cell: (info) => {
      const yearRange =
        (Number(info.row.original.price_current) /
          Number(info.row.original.price_year_high)) *
        100;
      return (
        <>
          <div
            style={{
              width: "100%",
              height: "25px",
              border: "1px solid black",
            }}
          >
            <div
              style={{
                backgroundColor: yearRange > 60 ? "red" : "green",
                width: `${yearRange}%`,
                height: "100%",
              }}
            />
          </div>
        </>
      );
    },
  }),
  columnHelper.accessor("payoutRation", {
    header: "Payout Ration",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("dividendYield", {
    header: "Dividend Yield",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
        ) : (
          <p style={{ textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("annualDividend", {
    header: "Annual Dividend",
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
];
