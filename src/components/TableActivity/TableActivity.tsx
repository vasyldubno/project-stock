import { ArrowRight } from "@/icons/ArrowRight";
import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock, ISupaStock, ISupaTransaction } from "@/types/types";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TableCardPrice } from "../TableCardPrice/TableCardPrice";
import { TableDetails } from "../TableDetails/TableDetails";
import { TableDivider } from "../TableDivider/TableDivider";

import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { FormAddStock } from "../FormAddStock/FormAddStock";

export const TableActivity = () => {
  const [data, setData] = useState<ISupaTransaction[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTicker, setSelectedTicker] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<IPortfolioStock | null>(
    null
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

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
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
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
    // console.log(sortConfig);
    if (sortConfig) {
      if (sortConfig.desc) {
        setSorting(
          sorting.map((sort) =>
            sort.id === columnId ? { ...sort, desc: false } : sort
          )
        );
        // setSorting(sorting.filter((sort) => sort.id !== columnId));
      } else {
        setSorting(sorting.filter((sort) => sort.id !== columnId));
        // setSorting(
        //   sorting.map((sort) =>
        //     sort.id === columnId ? { ...sort, desc: true } : sort
        //   )
        // );
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
        }}
      >
        <thead>
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

        {table.getRowModel().rows.map((row, rowIndex) => (
          <tbody key={`data-${row.id}-${rowIndex}`}>
            <tr>
              <td colSpan={columns.length + 2}>
                <TableDivider />
              </td>
            </tr>
            <tr>
              {/* <td>
                <div
                  style={{ cursor: "pointer" }}
                  // onClick={() => showDetail(row.original.ticker)}
                >
                  <ArrowRight />
                </div>
              </td> */}
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{ padding: "5px 0" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {/* <td>
                <div
                  style={{
                    padding: "5px 0",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {row.original.is_trading && (
                    <Button
                      title="SELL"
                      onClick={() => {
                        setIsOpenModal(true);
                        setSelectedStock(row.original);
                      }}
                    />
                  )}
                </div>
              </td> */}
            </tr>
            {selectedTicker.includes(row.original.ticker) && (
              <>
                <tr>
                  <td colSpan={columns.length + 2}>
                    <TableDetails
                      ticker={selectedTicker.find((item) =>
                        item.includes(row.original.ticker)
                      )}
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        ))}
      </table>
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <FormAddStock
          onClose={() => setIsOpenModal(false)}
          stock={selectedStock}
          type="sell"
        />
      </Modal>
    </>
  );
};

{
  /* <tbody key={`divider-${row.id}-${rowIndex}`}>
  <tr>
    <td colSpan={columns.length + 2}>
      <TableDivider />
    </td>
  </tr>
</tbody>; */
}
