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
      <div style={{ width: "60px" }}>
        <Link href={`/stock/${info.getValue()}`} className={s.cell__ticker}>
          {info.getValue()}
        </Link>
      </div>
    ),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ getValue }) => (
      <p
        style={{
          width: "150px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {getValue()}
      </p>
    ),
  }),
  columnHelper.accessor("sector", {
    header: "Sector",
    cell: ({ getValue }) => (
      <p
        style={{
          width: "150px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {getValue()}
      </p>
    ),
  }),
  columnHelper.accessor("subIndustry", {
    header: "Industry",
    cell: ({ getValue }) => (
      <p
        style={{
          width: "150px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {getValue()}
      </p>
    ),
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    cell: ({ getValue, row: { original } }) => (
      <>
        {getValue() && (
          <p style={{ width: "80px" }}>
            {millify(Number(getValue()), {
              precision: 2,
              locales: "en",
            })}
          </p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("price_current", {
    header: "Price Current",
    cell: ({ getValue }) => <p style={{ width: "80px" }}>{getValue()}</p>,
  }),
  columnHelper.accessor("pe", {
    header: "PE",
    cell: ({ getValue }) => (
      <>
        {getValue() ? (
          <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
        ) : (
          <p style={{ width: "80px", textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("roe", {
    header: "ROE",
    cell: ({ getValue }) => (
      <>
        <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
      </>
    ),
  }),
  columnHelper.accessor("de", {
    header: "D/E",
    cell: ({ getValue }) => (
      <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
    ),
  }),
  columnHelper.accessor("gross_margin", {
    header: "Gross Margin",
    cell: ({ getValue }) => (
      <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
    ),
  }),
  columnHelper.accessor("net_margin", {
    header: "Net Margin",
    cell: ({ getValue }) => (
      <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
    ),
  }),
  columnHelper.accessor("beta", {
    header: "Beta",
    cell: ({ getValue }) => (
      <p style={{ width: "80px", textAlign: "center" }}>{getValue()}</p>
    ),
  }),
  columnHelper.accessor("yearRange", {
    header: "52 Week Range",
    cell: (info) => {
      const yearRange = info.getValue() ?? 0;
      return (
        <>
          <div
            style={{
              width: "140px",
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
  columnHelper.accessor("gfValueMargin", {
    header: "Intrinsic Margin",
    cell: (info) => (
      <p style={{ width: "100px", textAlign: "center" }}>{info.getValue()}%</p>
    ),
  }),
  columnHelper.accessor("dividendYield", {
    header: "Dividend Yield",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ width: "90px", textAlign: "center" }}>
            {info.getValue()}%
          </p>
        ) : (
          <p style={{ width: "90px", textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("payoutRation", {
    header: "Payout Ration",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ width: "90px", textAlign: "center" }}>
            {info.getValue()}%
          </p>
        ) : (
          <p style={{ width: "90px", textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
  columnHelper.accessor("annualDividend", {
    header: "Annual Dividends",
    cell: (info) => (
      <>
        {info.getValue() ? (
          <p style={{ width: "110px", textAlign: "center" }}>
            {info.getValue()}%
          </p>
        ) : (
          <p style={{ width: "110px", textAlign: "center" }}>-- --</p>
        )}
      </>
    ),
  }),
];
