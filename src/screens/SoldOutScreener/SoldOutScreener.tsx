import { Container } from "@/components/Container/Container";
import { Header } from "@/components/Header/Header";
import { TableCardPrice } from "@/components/TableCardPrice/TableCardPrice";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ExitService } from "@/services/ExitService";
import { PortfolioService } from "@/services/PortfolioService";
import { ISupaExit, ISupaPortfolio } from "@/types/types";
import { useEffect, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { Item } from "./Item/Item";
import { TableDivider } from "@/components/TableDivider/TableDivider";

export const SoldOutScreener = () => {
  const [portfolios, setPortfolios] = useState<ISupaPortfolio[] | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);
  const [exits, setExits] = useState<ISupaExit[] | null>(null);

  const user = useUser();

  useQuery({
    queryKey: ["portfolios"],
    queryFn: () => PortfolioService.getPortfolios(user),
    enabled: !!user,
    onSuccess(data) {
      if (data?.data) {
        setPortfolios(data.data);
        setSelectedPortfolio(data.data[0]);
      }
    },
  });

  useQuery({
    queryKey: ["exits", { selectedPortfolio }],
    queryFn: () => ExitService.getExits(selectedPortfolio),
    enabled: !!selectedPortfolio,
    onSuccess(data) {
      setExits(data.data);
    },
  });

  return (
    <>
      {user && (
        <>
          <Header />
          <Container>
            {portfolios && (
              <TabsPortfolio
                tabs={portfolios.map((portfolio) => ({
                  content: (
                    <p
                      onClick={() => {
                        setSelectedPortfolio(portfolio);
                      }}
                    >
                      {portfolio.title}
                    </p>
                  ),
                }))}
              />
            )}

            {exits && exits.length > 0 && (
              <>
                <div
                  style={{
                    display: "flex",
                    marginBottom: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <p style={{ width: "33%", fontWeight: "bold" }}>Ticker</p>
                  <p style={{ width: "33%", fontWeight: "bold" }}>
                    Average Buy Price
                  </p>
                  <p style={{ width: "33%", fontWeight: "bold" }}>Exit Date</p>
                  <p style={{ width: "33%", fontWeight: "bold" }}>Margin</p>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <TableDivider />
                </div>
                {exits.map((exit) => (
                  <Item key={exit.id} exit={exit} />
                ))}
              </>
            )}
          </Container>
        </>
      )}
    </>
  );
};
