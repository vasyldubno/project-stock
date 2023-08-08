import { AddNewPortfolio } from "@/components/AddNewPortfolio/AddNewPortfolio";
import { AddNewTransaction } from "@/components/AddNewTransaction/AddNewTransaction";
import { Header } from "@/components/Header/Header";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ISupaPortfolio, ISupaStockPortfolio } from "@/types/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePortfolios, useStocks } from "./queries";
import {
  portfolioInsert,
  stockPortfolioInsert,
  stockPortfolioUpdate,
} from "./supabase";

const TablePortfolioDynamic = dynamic(
  () =>
    import("@/components/TablePortfolio/TablePortfolio").then(
      (res) => res.TablePortfolio
    ),
  { ssr: false }
);

export const PortfolioScreen = () => {
  const [portfolios, setPortfolios] = useState<ISupaPortfolio[] | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);
  const [stocks, setStocks] = useState<ISupaStockPortfolio[] | null>(null);

  const user = useUser();

  stockPortfolioInsert(selectedPortfolio, setStocks);
  stockPortfolioUpdate(selectedPortfolio, setStocks);
  portfolioInsert(setPortfolios, setSelectedPortfolio);

  const queryPortfolios = usePortfolios(user);
  const queryStocks = useStocks(selectedPortfolio);

  useEffect(() => {
    if (queryPortfolios) {
      setPortfolios(queryPortfolios);
    }
  }, [queryPortfolios]);

  useEffect(() => {
    if (portfolios) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  useEffect(() => {
    if (queryStocks) {
      setStocks(queryStocks);
    }
  }, [queryStocks]);

  return (
    <>
      {user && (
        <>
          <Header />

          <div style={{ padding: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <AddNewPortfolio />
              {selectedPortfolio && (
                <AddNewTransaction portfolioId={selectedPortfolio.id} />
              )}
            </div>

            {portfolios && (
              <>
                <TabsPortfolio
                  tabs={portfolios.map((item) => ({
                    content: (
                      <p onClick={() => setSelectedPortfolio(item)}>
                        {item.title}
                      </p>
                    ),
                  }))}
                />

                <div>
                  {selectedPortfolio && stocks && stocks?.length > 0 ? (
                    <div style={{ margin: "1rem" }}>
                      <TablePortfolioDynamic
                        portfolioId={selectedPortfolio.id}
                        data={stocks}
                      />
                    </div>
                  ) : (
                    <p style={{ margin: "1rem" }}>NOT SHARES</p>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
