import { FormAddStock } from "@/components/FormAddStock/FormAddStock";
import { xataClient } from "@/config/xataClient";
import { PortfolioService } from "@/services/PortfolioService";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home(props: {
  totalCost: number;
  totalReturn: number;
  totalUnrealizedReturn: number;
  totalUnrealizedPercentage: number;
}) {
  // useEffect(() => {
  //   const socket = new WebSocket(
  //     "wss://ws.finnhub.io?token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00"
  //   );
  //   socket.addEventListener("open", () => {
  //     socket.send(JSON.stringify({ type: "subscribe", symbol: "HAL" }));
  //   });
  //   socket.addEventListener("message", (event) => {
  //     const response = JSON.parse(event.data);
  //     console.log(response);
  //   });
  // }, []);

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
      <Link href={"/portfolio"}>Portfolio</Link>
      <p>Total cost: {props.totalCost.toFixed(2)}</p>
      <p>Total return: {props.totalReturn}</p>
      <p>
        Total Unrealized: {props.totalUnrealizedReturn.toFixed(2)} /{" "}
        {props.totalUnrealizedPercentage.toFixed(2)}%
      </p>
    </>
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
