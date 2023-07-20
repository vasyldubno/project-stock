import { xataClient } from "@/config/xataClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const portfolio = await xataClient.db.portfolioStock.getAll();

  const gainRealizedPercentage = async () => {
    const portfolio = await xataClient.db.portfolioStock.getAll();

    const result = portfolio.reduce((acc, stock) => {
      if (!stock.gainRealizedPercentage) {
        return acc;
      } else {
        return (acc += stock.gainRealizedPercentage);
      }
    }, 0);
    return Number(result.toFixed(2));
  };

  function isNegative(num: number) {
    if (Math.sign(num) === -1) {
      return true;
    }

    return false;
  }

  const gainUnrealizedPercentage = async () => {
    const portfolio = await xataClient.db.portfolioStock
      .filter("isTrading", true)
      .getAll();

    const result = portfolio.reduce((acc, stock) => {
      if (stock.gainUnrealizedPercentage) {
        if (!stock.gainUnrealizedPercentage) {
          return acc;
        } else {
          if (isNegative(stock.gainUnrealizedPercentage)) {
            return (acc -= Math.abs(stock.gainUnrealizedPercentage));
          }
          return (acc += stock.gainUnrealizedPercentage);
        }
      }

      return acc;
    }, 0);
    return Number(result.toFixed(2));
  };

  res.json({
    gainRealizedPercentage: await gainRealizedPercentage(),
    gainUnrealizedPercentage: await gainUnrealizedPercentage(),
    portfolio: portfolio.sort((a, b) => {
      if (a.gainUnrealizedPercentage && b.gainUnrealizedPercentage) {
        return b.gainUnrealizedPercentage - a.gainUnrealizedPercentage;
      }
      return 0;
    }),
  });
}
