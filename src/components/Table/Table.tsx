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
import { supabaseClient } from "@/config/supabaseClient";

export const Table = () => {
  const [data, setData] = useState<IPortfolioStock[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log(data);

  useEffect(() => {
    PortfolioService.getPortfolio().then((res) => {
      if (res.portfolio) {
        setData(res.portfolio);
      }
    });

    supabaseClient
      .channel("stock-update")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stock",
        },
        async (payload) => {
          console.log(payload);
          // const portfolio = await PortfolioService.getPortfolio();
          // if (portfolio.portfolio) {
          //   setData(portfolio.portfolio);
          // }

          const updatedStock = await supabaseClient
            .from("stock_portfolio")
            .select()
            .eq("ticker", payload.new.ticker)
            .single();

          if (updatedStock.data) {
            setData((prev) => {
              const result = prev
                .map((item) =>
                  item.ticker === payload.new.ticker ? updatedStock.data : item
                )
                .sort((a, b) => {
                  if (
                    a.gain_unrealized_percentage === null &&
                    b.gain_unrealized_percentage === null
                  ) {
                    return 0;
                  }

                  if (a.gain_unrealized_percentage === null) {
                    return 1;
                  }

                  if (b.gain_unrealized_percentage === null) {
                    return -1;
                  }

                  return (
                    b.gain_unrealized_percentage - a.gain_unrealized_percentage
                  );
                });

              return result;
            });
          }
        }
      )
      .subscribe();
  }, []);

  const columnHelper = createColumnHelper<IPortfolioStock>();

  const columns = [
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("gain_unrealized_percentage", {
      header: "Total Gain (Unrealized)",
      cell: (info) => (
        <>
          {info.row.original.is_trading ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- ---</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("market_price", {
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
