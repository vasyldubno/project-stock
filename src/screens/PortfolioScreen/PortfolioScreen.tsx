import { Header } from "@/components/Header/Header";
import { Layout } from "@/components/Layout/Layout";
import { PortfolioService } from "@/services/PortfolioService";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const TablePortfolioDynamic = dynamic(
  () =>
    import("@/components/TablePortfolio/TablePortfolio").then(
      (res) => res.TablePortfolio
    ),
  { ssr: false }
);

export const PortfolioScreen = () => {
  useEffect(() => {
    // PortfolioService.updatePortfolio();
  }, []);
  return (
    <>
      <Header />
      <div style={{ margin: "1rem" }}>
        <TablePortfolioDynamic />
      </div>
    </>
  );
};
