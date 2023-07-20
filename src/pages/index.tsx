import { Button } from "@/components/Button/Button";
import { Layout } from "@/components/Layout/Layout";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ margin: "1rem" }}>
      <Layout></Layout>
    </div>
  );
}
