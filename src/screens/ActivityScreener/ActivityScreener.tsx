import { Header } from "@/components/Header/Header";
import { TableActivity } from "@/components/TableActivity/TableActivity";
import { useUser } from "@/hooks/useUser";
import { usePortfolios, useTransactions } from "./queries";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { ISupaPortfolio } from "@/types/types";
import { useEffect, useState } from "react";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { PortfolioService } from "@/services/PortfolioService";
import s from "./styles.module.scss";

export const ActivityScreener = () => {
  const user = useUser();
  console.log("");

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
                  // iconDelete: selectedPortfolio?.id === item.id && (
                  //   <DeleteIcon size="1rem" />
                  // ),
                  // onDelete: () =>
                  //   PortfolioService.deletePortfolio(selectedPortfolio, user),
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
