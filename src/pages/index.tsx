import { FormAddStock } from "@/components/FormAddStock/FormAddStock";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  return (
    <>
      <FormAddStock />
      <button
        onClick={async () => {
          const response = await PortfolioService.getStocks();
          console.log(response.data.stocks);
        }}
      >
        get stocks
      </button>
      <button
        onClick={async () => {
          const response = await PortfolioService.getPortfolio();
          console.log(response.data);
        }}
      >
        get portfolio
      </button>
      <Link href={"/portfolio"}>Portfolio</Link>
    </>
  );
}
