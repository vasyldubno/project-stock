import { xataClient } from "@/config/xataClient";
import { averageCostPerShare } from "@/utils/averageCostPerShare";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { getRealizedValue } from "@/utils/getRealizedValue";
import { getRealizedPercentage } from "@/utils/getRealizedPercentage";
import { getAmountActiveShares } from "@/utils/amountActiveShares";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ticker, price, count, type } = req.body;

  const updatedDate = new Date(
    moment(new Date(), "DD.MM.YYYY").format("YYYY-MM-DD")
  );

  if (type === "buy") {
    const responseExchange = await axios.get<{ Exchange: string }>(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=U0366SZHJEG1GO6E`
    );

    await xataClient.db.transaction.create({
      ticker,
      count,
      price,
      type: "buy",
      date: updatedDate,
    });

    const existStock = await xataClient.db.portfolioStock
      .filter("ticker", ticker)
      .getFirst();

    if (existStock && responseExchange) {
      await xataClient.db.portfolioStock.update(existStock.id, {
        isTrading: true,
        marketPrice: price,
        averageCostPerShare: await averageCostPerShare(
          ticker,
          price,
          count,
          type
        ),
      });
      if (!existStock.isTrading) {
        await xataClient.db.portfolioStock.update(existStock.id, {
          startTradeDate: updatedDate,
        });
      }
    } else {
      await xataClient.db.portfolioStock.create({
        ticker,
        exchange: responseExchange.data.Exchange,
        isTrading: true,
        marketPrice: price,
        startTradeDate: updatedDate,
        averageCostPerShare: price,
      });
    }
  }

  if (type === "sell") {
    await xataClient.db.transaction.create({
      ticker,
      count,
      price,
      type: "sell",
      date: updatedDate,
    });

    const xataStock = await xataClient.db.portfolioStock
      .filter("ticker", ticker)
      .getFirst();

    if (xataStock) {
      // const activeShares = await xataClient.db.transaction
      //   .filter({ ticker, type: "buy" })
      //   .getAll();

      // const amountActiveShares = activeShares.reduce((acc, item) => {
      //   if (item.count) {
      //     return (acc += item.count);
      //   }
      //   return acc;
      // }, 0);

      const amountActiveShares = await getAmountActiveShares(ticker);

      if (amountActiveShares === count) {
        await xataClient.db.portfolioStock.update(xataStock.id, {
          startTradeDate: null,
          isTrading: false,
        });
      }

      if (amountActiveShares >= count && xataStock.averageCostPerShare) {
        await xataClient.db.portfolioStock.update(xataStock.id, {
          marketPrice: price,
          gainRealizedValue: getRealizedValue(
            price,
            count,
            xataStock.averageCostPerShare
          ),
          gainRealizedPercentage: getRealizedPercentage(
            price,
            count,
            xataStock.averageCostPerShare
          ),
          gainUnrealizedPercentage: 0,
          gainUnrealizedValue: 0,
        });
      }
    }
  }

  res.json({ message: "Ok" });
}
