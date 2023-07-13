import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock } from "@/types/types";
import {
  ColumnDef,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import s from "./Table.module.scss";

export const Table = () => {
  const [data, setData] = useState<IPortfolioStock[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    PortfolioService.getPortfolio().then((res) => setData(res.data.portfolio));
  }, []);

  const columnHelper = createColumnHelper<IPortfolioStock>();

  const columns = [
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("gainUnrealizedPercentage", {
      header: "Total Gain (Unrealized)",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}%</p>,
    }),
    columnHelper.accessor("marketPrice", {
      header: "Market Price",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("dividendValue", {
      header: "Total Dividends",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("gainRealizedPercentage", {
      header: "Total Return",
      cell: (info) => {
        if (info.getValue()) {
          return <p style={{ textAlign: "center" }}>{info.getValue()}%</p>;
        }
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting: sorting },
    onSortingChange: setSorting,
  });

  const toggleSortingHandler = (columnId: string) => () => {
    const sortConfig = sorting.find((sort) => sort.id === columnId);
    if (sortConfig) {
      if (sortConfig.desc) {
        setSorting(sorting.filter((sort) => sort.id !== columnId));
      } else {
        setSorting(
          sorting.map((sort) =>
            sort.id === columnId ? { ...sort, desc: true } : sort
          )
        );
      }
    } else {
      setSorting([{ id: columnId, desc: false }]);
    }
  };

  return (
    <table className={s.table}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                onClick={toggleSortingHandler(header.column.id)}
              >
                {header.isPlaceholder ? null : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {sorting.some((sort) => sort.id === header.column.id) && (
                      <span>
                        {sorting.find((sort) => sort.id === header.column.id)
                          ?.desc
                          ? "🔽"
                          : "🔼"}
                      </span>
                    )}
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      {table.getRowModel().rows.map((row) => (
        <tbody key={row.id}>
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        </tbody>
      ))}
    </table>
  );
};
