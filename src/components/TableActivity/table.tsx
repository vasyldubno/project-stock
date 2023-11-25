import { ISupaTransaction } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import moment from "moment";

const columnHelper = createColumnHelper<ISupaTransaction>();

export const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
  columnHelper.accessor("ticker", {
    header: "Ticker",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => (
      <p style={{ textAlign: "center" }}>
        {moment(info.getValue()).format("DD.MM.YYYY")}
      </p>
    ),
  }),
  columnHelper.accessor("count", {
    header: "Shares",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
  columnHelper.accessor("change", {
    header: "Change",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
  }),
];
