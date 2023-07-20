import { Layout } from "@/components/Layout/Layout";
import { PortfolioService } from "@/services/PortfolioService";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const TableDynamic = dynamic(
  () => import("@/components/Table/Table").then((res) => res.Table),
  { ssr: false }
);

export const PortfolioScreen = () => {
  useEffect(() => {
    PortfolioService.updatePortfolio();
  }, []);
  return (
    <div style={{ margin: "1rem" }}>
      <Layout>
        <TableDynamic />
      </Layout>
    </div>
  );
};
