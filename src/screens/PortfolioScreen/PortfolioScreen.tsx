import { AddNewPortfolio } from "@/components/AddNewPortfolio/AddNewPortfolio";
import { AddNewTransaction } from "@/components/AddNewTransaction/AddNewTransaction";
import { Header } from "@/components/Header/Header";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ISupaPortfolio, ISupaStockPortfolio } from "@/types/types";
import { useEffect, useState } from "react";
import { usePortfolios, useStocks } from "./queries";
import {
  portfolioDelete,
  portfolioInsert,
  stockPortfolioInsert,
  stockPortfolioUpdate,
} from "./supabase";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { PortfolioService } from "@/services/PortfolioService";
import { TablePortfolio } from "@/components/TablePortfolio/TablePortfolio";

export const PortfolioScreen = () => {
  const [portfolios, setPortfolios] = useState<ISupaPortfolio[] | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);
  const [stocks, setStocks] = useState<ISupaStockPortfolio[] | null>(null);

  const user = useUser();

  stockPortfolioInsert(selectedPortfolio, setStocks);
  stockPortfolioUpdate(selectedPortfolio, setStocks);
  portfolioDelete(setPortfolios, setSelectedPortfolio);

  const queryPortfolios = usePortfolios(user);
  const queryStocks = useStocks(selectedPortfolio);

  useEffect(() => {
    if (user) {
      portfolioInsert(setPortfolios, user);
    }
  }, [user]);

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
      setStocks(queryStocks.data);
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
                    iconDelete: selectedPortfolio?.id === item.id && (
                      <DeleteIcon size="1rem" />
                    ),
                    onDelete: () =>
                      PortfolioService.deletePortfolio(selectedPortfolio, user),
                  }))}
                />

                <div>
                  {queryStocks.isFetching ? (
                    <p>Loading...</p>
                  ) : selectedPortfolio && stocks && stocks?.length > 0 ? (
                    <div style={{ margin: "1rem" }}>
                      <TablePortfolio
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
