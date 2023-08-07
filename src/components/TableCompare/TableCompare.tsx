import { SortIcon } from "@/icons/SortIcon";
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
import { FC, useState } from "react";
import { TableDivider } from "../TableDivider/TableDivider";
import s from "./styles.module.scss";

type Props = {
  data: ISupaStock[];
};

export const TableCompare: FC<Props> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnHelper = createColumnHelper<ISupaStock>();

  const columns = [
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("price_current", {
      header: "Price Current",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("marketCap", {
      header: "Market Cap",
      cell: (info) => (
        <p style={{ textAlign: "center" }}>
          {millify(Number(info.getValue()), { precision: 1 })}
        </p>
      ),
    }),
    columnHelper.accessor("pe", {
      header: "PE",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("roe", {
      header: "ROE",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("de", {
      header: "D/E",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("gross_margin", {
      header: "Gross Margin",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("net_margin", {
      header: "Net Margin",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("eps_growth_past_5y", {
      header: "EPS Growth 5y",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("beta", {
      header: "Beta",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("gfValueMargin", {
      header: "Instrinic Margin",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}%</p>,
    }),
    columnHelper.accessor("price_year_high", {
      header: "52 Week Range",
      cell: (info) => {
        const yearRange =
          (Number(info.row.original.price_current) /
            Number(info.row.original.price_year_high)) *
          100;
        return (
          <>
            <div
              style={{
                width: "100%",
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
    columnHelper.accessor("payoutRation", {
      header: "Payout Ration",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("dividendYield", {
      header: "Dividend Yield",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()}%</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
    }),
    columnHelper.accessor("annualDividend", {
      header: "Annual Dividend",
      cell: (info) => (
        <>
          {info.getValue() ? (
            <p style={{ textAlign: "center" }}>{info.getValue()?.toFixed(2)}</p>
          ) : (
            <p style={{ textAlign: "center" }}>-- --</p>
          )}
        </>
      ),
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
      <table className={s.table}>
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
                        gap: "0.3rem",
                      }}
                    >
                      <div style={{ cursor: "pointer", width: "fit-content" }}>
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
              <td colSpan={columns.length + 2}>
                <TableDivider />
              </td>
            </tr>
            <tr>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{ padding: "5px 0" }}
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
