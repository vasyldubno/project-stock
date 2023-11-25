import { Header } from "@/components/Header/Header";
import { TableActivity } from "@/components/TableActivity/TableActivity";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ISupaPortfolio } from "@/types/types";
import { useEffect, useState } from "react";
import { usePortfolios, useTransactions } from "./queries";
import s from "./styles.module.scss";

export const ActivityScreener = () => {
  const user = useUser();

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);

  const portfolios = usePortfolios(user);
  const transactions = useTransactions({
    portfolio: selectedPortfolio,
  });

  useEffect(() => {
    if (portfolios) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  return (
    <>
      {user && (
        <>
          <Header />
          <div
            style={{
              margin: "0 auto",
              padding: "1rem 1rem",
              overflow: "auto",
            }}
          >
            {portfolios && (
              <TabsPortfolio
                tabs={portfolios.map((item) => ({
                  content: (
                    <p onClick={() => setSelectedPortfolio(item)}>
                      {item.title}
                    </p>
                  ),
                }))}
              />
            )}
            {transactions && (
              <div className={s.tableWrapper}>
                <TableActivity data={transactions} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};
