import { ArrowRight } from "@/icons/ArrowRight";
import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock, ISupaStock } from "@/types/types";
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
import s from "./TablePortfolio.module.scss";
import { supabaseStockUpdate } from "./supabase";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { FormAddStock } from "../FormAddStock/FormAddStock";

export const TablePortfolio = () => {
  const [data, setData] = useState<IPortfolioStock[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTicker, setSelectedTicker] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<IPortfolioStock | null>(
    null
  );
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    PortfolioService.getPortfolio().then((res) => {
      if (res.portfolio) {
        setData(res.portfolio);
      }
    });

    supabaseStockUpdate(setData);
  }, []);

  const showDetail = async (ticker: string) => {
    setSelectedTicker((prev) => {
      const exist = prev.find((item) => item.includes(ticker));
      if (exist) {
        const updatedState = prev.filter((item) => !item.includes(ticker));
        return updatedState;
      } else {
        const updatedState = [...prev, ticker];
        return updatedState;
      }
    });
  };

  const columnHelper = createColumnHelper<IPortfolioStock>();

  const columns = [
    // columnHelper.accessor("ticker", {
    //   header(props) {
    //     return <></>;
    //   },
    //   cell(props) {
    //     return (
    //       <div
    //         style={{ cursor: "pointer" }}
    //         onClick={() => showDetail(props.row.original.ticker)}
    //       >
    //         <ArrowRight />
    //       </div>
    //     );
    //   },
    // }),
    columnHelper.accessor("ticker", {
      header: "Ticker",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}</p>,
    }),
    columnHelper.accessor("gain_unrealized_percentage", {
      header: "Total Gain (Unrealized)",
      cell: (info) => (
        <>
          {info.row.original.is_trading ? (
            <TableCardPrice content={info.getValue()?.toFixed(2)} />
          ) : (
            <TableCardPrice content={null} />
          )}
        </>
      ),
    }),
    columnHelper.accessor("market_price", {
      header: "Market Price",
      cell: (info) => (
        <p style={{ textAlign: "center" }}>{info.getValue()?.toFixed(2)}</p>
      ),
    }),
    columnHelper.accessor("total_dividend_income", {
      header: "Total Dividends",
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
    columnHelper.accessor("total_return_margin", {
      header: "Total Return",
      cell: (info) => (
        <div style={{ textAlign: "center" }}>
          {info.row.original.total_return_margin ? (
            <p style={{ fontSize: "0.8rem" }}>
              {info.row.original.total_return_margin.toFixed(2)}%
            </p>
          ) : (
            <p style={{ fontSize: "0.8rem" }}>-- --</p>
          )}

          {info.row.original.total_return_value ? (
            <p style={{ fontSize: "0.8rem" }}>
              {info.row.original.total_return_value.toFixed(2)}
            </p>
          ) : (
            <p style={{ fontSize: "0.8rem" }}>-- --</p>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("price_growth", {
      header: "Target",
      cell: (info) => (
        <div style={{ textAlign: "center" }}>
          {/* {info.getValue()} */}
          {info.row.original.price_target ? (
            <p style={{ fontSize: "0.8rem" }}>
              {info.row.original.price_target.toFixed(2)}
            </p>
          ) : (
            <p style={{ fontSize: "0.8rem" }}>-- --</p>
          )}
          {/* {info.row.original.price_target && info.row.original.market_price ? (
            <p style={{ fontSize: "0.8rem" }}>
              {`${(
                ((info.row.original.price_target -
                  info.row.original.market_price) /
                  info.row.original.market_price) *
                100
              ).toFixed(2)}`}
              %
            </p>
          ) : (
            <p style={{ fontSize: "0.8rem" }}>-- --</p>
          )} */}
          {info.row.original.price_growth ? (
            <p style={{ fontSize: "0.8rem" }}>
              {`${info.row.original.price_growth.toFixed(2)}`}%
            </p>
          ) : (
            <p style={{ fontSize: "0.8rem" }}>-- --</p>
          )}
        </div>
      ),
    }),

    columnHelper.accessor("perc_of_portfolio", {
      header: "% of Portfolio",
      cell: (info) => <p style={{ textAlign: "center" }}>{info.getValue()}%</p>,
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

  console.log(sorting);

  return (
    <>
      <table className={s.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
            <tr key={`${headerGroup.id}-${headerGroupIndex}`}>
              <th></th>
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
              <td>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => showDetail(row.original.ticker)}
                >
                  <ArrowRight />
                </div>
              </td>
              {row.getVisibleCells().map((cell, cellIndex) => (
                <td
                  key={`${cell.id}-${cellIndex}`}
                  style={{ padding: "5px 0" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <td>
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
              </td>
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
