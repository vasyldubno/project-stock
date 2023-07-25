import { ISupaStock } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import millify from "millify";

const columnHelper = createColumnHelper<ISupaStock>();

export const columns = [
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("marketCap", {
    header: "Market Cap",
    cell: ({ getValue, row: { original } }) => (
      <>
        {original.marketCap && (
          <p>
            {millify(Number(original.marketCap), {
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
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("price_growth", {
    header: "Target",
    cell: ({ row: { original } }) => (
      <>
        <p>{original.price_target}</p>
        <p>{original.price_growth}%</p>
      </>
    ),
  }),
  columnHelper.accessor("pe", {
    header: "PE",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("roe", {
    header: "ROE",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("sector", {
    header: "Sector",
    cell: ({ getValue }) => getValue(),
  }),
  columnHelper.accessor("subIndustry", {
    header: "Industry",
    cell: ({ getValue }) => getValue(),
  }),
];
