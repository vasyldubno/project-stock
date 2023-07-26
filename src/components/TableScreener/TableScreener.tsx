import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import millify from "millify";
import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { FormAddStock } from "../FormAddStock/FormAddStock";
import { Layout } from "../Layout/Layout";
import { Modal } from "../Modal/Modal";
import { SupaStockUpdate } from "./supabase";

export const TableScreener = ({ data }: { data: ISupaStock[] }) => {
  const [stocks, setStocks] = useState<ISupaStock[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<ISupaStock | null>(null);
  const [selectedScreener, setSelectedScreener] = useState<
    "Dividend" | "Growth"
  >("Growth");

  // console.log(selectedScreener);

  useEffect(() => {
    // SupaStoc kUpdate(setStocks, selectedScreener);
  }, []);

  const columnHelper = createColumnHelper<ISupaStock>();

  const columns = [
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
    columnHelper.accessor("dividendYield", {
      header: "Dividend Yield",
      cell: (info) => (
        <>{info.getValue() ? <p>{info.getValue()}%</p> : <p>-- --</p>}</>
      ),
    }),
  ];

  const table = useReactTable({
    columns,
    data: stocks,
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
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          title="Growth Screener"
          onClick={() => {
            setStocks(data);
            setSelectedScreener("Growth");
          }}
        />
        <Button
          title="Dividend Screener"
          onClick={async () => {
            const response = await StockService.getStocksDividends();
            if (response) {
              setStocks(response);
              setSelectedScreener("Dividend");
            }
          }}
        />
      </div>
      <table
        style={{
          borderCollapse: "collapse",
          borderSpacing: "0",
          width: "1200px",
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
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{ padding: "5px 0" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <Button
                title="BUY"
                onClick={() => {
                  setIsOpenModal(true);
                  setSelectedStock(row.original);
                }}
              />
            </tr>
          </tbody>
        ))}
      </table>
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <FormAddStock
          stock={selectedStock}
          onClose={() => setIsOpenModal(false)}
          type="buy"
        />
      </Modal>
    </>
  );
};
