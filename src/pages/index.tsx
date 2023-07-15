import { Button } from "@/components/Button/Button";
import { FormAddStock } from "@/components/FormAddStock/FormAddStock";
import { supabaseClient } from "@/config/supabaseClient";
import { xataClient } from "@/config/xataClient";
import { PortfolioService } from "@/services/PortfolioService";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home(props: {
  totalCost: number;
  totalReturn: number;
  totalUnrealizedReturn: number;
  totalUnrealizedPercentage: number;
}) {
  return (
    <div style={{ margin: "1rem" }}>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button
          onClick={async () => {
            const response = await PortfolioService.getStocks();
            console.log(response);
          }}
          title="Get Stocks"
        />
        <Button
          title="Update Portfolio"
          onClick={async () => {
            await axios.get("/api/portfolio/update-portfolio");
          }}
        />
        <Link href={"/portfolio"}>
          <Button title="Portfolio" />
        </Link>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <p>Total cost:</p>
        <p
          style={{
            backgroundColor: "rgb(230,244,234)",
            color: "rgb(19,115,51)",
            padding: "0.3rem",
            width: "max-content",
            borderRadius: "0.5rem",
          }}
        >
          {props.totalCost.toFixed(2)}
        </p>
      </div>
      <p>Total return: {props.totalReturn}</p>
      <p>
        Total Unrealized: {props.totalUnrealizedReturn.toFixed(2)} /{" "}
        {props.totalUnrealizedPercentage.toFixed(2)}%
      </p>
      <p>
        MarketCap: {(props.totalCost + props.totalUnrealizedReturn).toFixed(2)}
      </p>
    </div>
  );
}

export const getStaticProps = async () => {
  const responseAllTransactions = await xataClient.db.transaction.getAll();
  const totalCost = responseAllTransactions.reduce((acc, item) => {
    if (item.price && item.count) {
      const res = item.price * item.count;
      return (acc += res);
    } else {
      return acc;
    }
  }, 0);

  const responsePortfolioStock = await xataClient.db.portfolioStock
    // .filter("gainRealizedValue", { $gt: 0 })
    .getAll();

  const totalReturn = responsePortfolioStock.reduce((acc, item) => {
    if (item.gainRealizedValue) {
      return (acc += item.gainRealizedValue);
    }
    return acc;
  }, 0);

  const totalUnrealizedReturn = responsePortfolioStock.reduce((acc, item) => {
    if (item.gainUnrealizedValue) {
      return (acc += item.gainUnrealizedValue);
    }
    return acc;
  }, 0);

  const totalUnrealizedPercentage = responsePortfolioStock.reduce(
    (acc, item) => {
      if (item.gainUnrealizedPercentage) {
        return (acc += item.gainUnrealizedPercentage);
      }
      return acc;
    },
    0
  );

  return {
    props: {
      totalCost,
      totalReturn,
      totalUnrealizedReturn,
      totalUnrealizedPercentage,
    },
  };
};
