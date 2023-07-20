import { DividendIcon } from "@/icons/DividendIcon";
import { LostIcon } from "@/icons/LotsIcon";
import { TransactionIcon } from "@/icons/TransactionIcon";
import { FC, useEffect, useState } from "react";
import { Tabs } from "../Tabs/Tabs";
import { RowDividend } from "./RowDividend/RowDividend";
import { RowShareLots } from "./RowShareLots/RowShareLots";
import { RowTransaction } from "./RowTransaction/RowTransaction";
import { TableHead } from "./TableHead/TableHead";
import { getData } from "./queries";
import { Dividend, ShareLots, Transaction } from "./types";

interface TableDetailsProps {
  ticker: string | undefined;
}

export const TableDetails: FC<TableDetailsProps> = ({ ticker }) => {
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shareLots, setShareLots] = useState<ShareLots[]>([]);

  useEffect(() => {
    getData({ ticker, setDividends, setShareLots, setTransactions });
  }, [ticker]);

  return (
    <>
      <Tabs
        tabs={[
          { content: "Share Lots", icon: <LostIcon size="1rem" /> },
          { content: "Transactions", icon: <TransactionIcon size="1rem" /> },
          { content: "Dividends", icon: <DividendIcon size="1rem" /> },
        ]}
        tabsPanel={[
          {
            content: (
              <>
                {shareLots.length > 0 ? (
                  <table style={{ width: "1000px" }}>
                    <TableHead
                      columns={[
                        "Trade Date",
                        "Shares",
                        "Cost / Share",
                        "Total Cost",
                        "Market Value",
                        "Total Gain",
                      ]}
                    />
                    <tbody>
                      {shareLots.map((item, index) => (
                        <RowShareLots
                          key={index}
                          averagePrice={item.averagePrice}
                          gain={item.gain}
                          marketPrice={item.marketPrice}
                          shares={item.shares}
                          totalCost={item.totalCost}
                          tradeDate={item.tradeDate}
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No lots</p>
                )}
              </>
            ),
          },
          {
            content: (
              <>
                {transactions && (
                  <table style={{ width: "1000px" }}>
                    <TableHead columns={["Type", "Date", "Price", "Count"]} />
                    <tbody>
                      {transactions.map((item, index) => (
                        <RowTransaction
                          key={index}
                          count={item.count}
                          date={item.date}
                          price={item.price}
                          type={item.type}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            ),
          },
          {
            content: (
              <>
                {dividends.length > 0 ? (
                  <table style={{ width: "1000px" }}>
                    <TableHead
                      columns={[
                        "Payment Date",
                        "Shares",
                        "Amount Per Share",
                        "Total Amount",
                      ]}
                    />
                    <tbody>
                      {dividends.map((item, index) => (
                        <RowDividend
                          key={index}
                          amountPerShare={item.amountPerShare}
                          amountShares={item.amountShares}
                          payDate={item.payDate}
                          totalAmount={item.totalAmount}
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No dividends</p>
                )}
              </>
            ),
          },
        ]}
      />
    </>
  );
};
