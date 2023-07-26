import { Button } from "@/components/Button/Button";
import { ChartDividends } from "@/components/ChartDividends/ChartDividends";
import { ChartMapStocks } from "@/components/ChartMapStocks/ChartMapStocks";
import { ChartSectors } from "@/components/ChartSectors/ChartSectors";
import { ChartUpcomingDividends } from "@/components/ChartUpcomingDividends/ChartUpcomingDividends";
import { Layout } from "@/components/Layout/Layout";
import { TestScreen } from "@/screens/TestScreen";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  return <TestScreen />;
}
