import { DividendIcon } from "@/icons/DividendIcon";
import { LostIcon } from "@/icons/LotsIcon";
import { TransactionIcon } from "@/icons/TransactionIcon";
import { FC, useEffect, useState } from "react";
import { Tabs } from "../Tabs/Tabs";
import { RowDividend } from "./RowDividend/RowDividend";
import { RowShareLots } from "./RowShareLots/RowShareLots";
import { RowTransaction } from "./RowTransaction/RowTransaction";
import { TableHead } from "./TableHead/TableHead";
import { useDividends, useShareLots, useTransactions } from "./queries";
import { Dividend, ShareLots, Transaction } from "./types";
import { useUser } from "@/hooks/useUser";

interface TableDetailsProps {
  ticker: string | undefined;
  portfolioId: string;
}

export const TableDetails: FC<TableDetailsProps> = ({
  ticker,
  portfolioId,
}) => {
  const user = useUser();

  const width = "966px";

  const shareLots = useShareLots(user, ticker, portfolioId);
  const dividends = useDividends(user, ticker, portfolioId);
  const transactions = useTransactions(user, ticker, portfolioId);

  return (
    <div>
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
                {shareLots ? (
                  <table style={{ width }}>
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
                      <RowShareLots
                        key={shareLots.id}
                        averagePrice={shareLots.averagePrice}
                        gain={shareLots.gain}
                        marketPrice={shareLots.marketPrice}
                        shares={shareLots.shares}
                        totalCost={shareLots.totalCost}
                        tradeDate={shareLots.tradeDate}
                      />
                    </tbody>
                  </table>
                ) : (
                  <p style={{ width }}>No lots</p>
                )}
              </>
            ),
          },
          {
            content: (
              <>
                {transactions && (
                  <table style={{ width }}>
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
                {dividends && dividends.length > 0 ? (
                  <table style={{ width }}>
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
                  <p style={{ width }}>No dividends</p>
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};
