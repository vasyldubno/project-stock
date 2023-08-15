import { PortfolioService } from "@/services/PortfolioService";
import { ISupaTransaction } from "@/types/types";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FC, useEffect, useState } from "react";
import { SortIcon } from "@/icons/SortIcon";
import moment from "moment";
import { columns } from "./table";
import s from "./styles.module.scss";
import { Button } from "../Button/Button";
import { Pagination } from "../Pagination/Pagination";

type Props = {
  data: ISupaTransaction[];
};

export const TableActivity: FC<Props> = ({ data }) => {
  // const [data, setData] = useState<ISupaTransaction[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // useEffect(() => {
  //   PortfolioService.getTransactions().then((res) => setData(res));
  // }, []);

  const table = useReactTable({
    columns: columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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

  useEffect(() => {
    table.setPageSize(10);
  }, []);

  return (
    <>
      <table className={s.table}>
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
                <td key={`${cell.id}-${cellIndex}`} className={s.tbody__td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
      <Pagination table={table} />
    </>
  );
};
