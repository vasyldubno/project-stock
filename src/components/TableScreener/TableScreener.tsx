import { ISupaStock } from "@/types/types";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "../Button/Button";
import { FormAddStock } from "../FormAddStock/FormAddStock";
import { Modal } from "../Modal/Modal";
import { columns } from "./table";

export const TableScreener = ({ data }: { data: ISupaStock[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<ISupaStock | null>(null);

  const table = useReactTable({
    columns: columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting: sorting, columnVisibility: {} },
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
    <div style={{ overflow: "auto", maxHeight: "100dvh" }}>
      <table
        style={{
          borderCollapse: "collapse",
          borderSpacing: "0",
          overflowX: "scroll",
          width: "100%",
        }}
      >
        <thead
          style={{
            fontSize: "0.8rem",
            position: "sticky",
            top: "0",
            backgroundColor: "white",
          }}
        >
          {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
            <tr key={`${headerGroup.id}-${headerGroupIndex}`}>
              {headerGroup.headers.map((header, headerIndex) => (
                <th
                  key={`${header.id}-${headerIndex}`}
                  onClick={toggleSortingHandler(header.column.id)}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ cursor: "pointer" }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {table.getRowModel().rows.map((row, rowIndex) => (
          <tbody
            key={`data-${row.id}-${rowIndex}`}
            style={{ fontSize: "0.8rem" }}
          >
            <tr>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{
                    padding: "10px 5px",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
                <Button
                  title="BUY"
                  onClick={() => {
                    setIsOpenModal(true);
                    setSelectedStock(row.original);
                  }}
                />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <FormAddStock
          ticker={selectedStock?.ticker}
          onClose={() => setIsOpenModal(false)}
          type="buy"
        />
      </Modal>
    </div>
  );
};
