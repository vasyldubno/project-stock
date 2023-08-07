import { PortfolioService } from "@/services/PortfolioService";
import { ISupaTransaction } from "@/types/types";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { SortIcon } from "@/icons/SortIcon";
import moment from "moment";

export const TableActivity = () => {
  const [data, setData] = useState<ISupaTransaction[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    PortfolioService.getTransactions().then((res) => setData(res));
  }, []);

  const columnHelper = createColumnHelper<ISupaTransaction>();

  const columns = [
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("count", {
      header: "Amount Shares",
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
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("change", {
      header: "Change",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
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
        setSorting(
          sorting.map((sort) =>
            sort.id === columnId ? { ...sort, desc: false } : sort
          )
        );
      } else {
        setSorting(sorting.filter((sort) => sort.id !== columnId));
      }
    } else {
      setSorting([{ id: columnId, desc: true }]);
    }
  };

  return (
    <>
      <table
        style={{
          width: "100%",
          border: "1px solid var(--color-gray)",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
            <tr key={`${headerGroup.id}-${headerGroupIndex}`}>
              {headerGroup.headers.map((header, headerIndex) => (
                <th
                  key={`${header.id}-${headerIndex}`}
                  onClick={toggleSortingHandler(header.column.id)}
                  style={{
                    border: "1px solid var(--color-gray)",
                    padding: "5px 0",
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <div style={{ cursor: "pointer" }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                      {sorting.some((sort) => sort.id === header.column.id) ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {sorting.find((sort) => sort.id === header.column.id)
                            ?.desc ? (
                            <SortIcon size="1rem" type="desc" />
                          ) : (
                            <SortIcon size="1rem" type="asc" />
                          )}
                        </span>
                      ) : (
                        <div
                          style={{
                            backgroundColor: "white",
                            width: "1rem",
                            height: "1rem",
                          }}
                        ></div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {table.getRowModel().rows.map((row, rowIndex) => (
          <tbody key={`data-${row.id}-${rowIndex}`}>
            <tr>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{
                    padding: "5px 0",
                    border: "1px solid var(--color-gray)",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
    </>
  );
};
