import { xataClient } from "@/config/xataClient";
import { averageCostPerShare } from "@/utils/averageCostPerShare";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment-timezone";
import { getRealizedValue } from "@/utils/getRealizedValue";
import { getRealizedPercentage } from "@/utils/getRealizedPercentage";
import { getAmountActiveShares } from "@/utils/amountActiveShares";

interface INasdaqDividends {
  data: {
    dividends: {
      rows: {
        exOrEffDate: string;
        type: string;
        amount: string;
        declarationDate: string;
        recordDate: string;
        paymentDate: string;
        currency: string;
      }[];
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const portfolio = await xataClient.db.portfolioStock
    .filter("isTrading", true)
    .getAll();
  // const portfolio = await xataClient.db.portfolioStock
  //   .filter("ticker", "QCOM")
  //   .getAll();

  portfolio.forEach(async (stock, index) => {
    console.log(index + 1, stock.ticker);

    const response = await axios.get<INasdaqDividends>(
      `https://api.nasdaq.com/api/quote/${stock.ticker}/dividends?assetclass=stocks`
    );

    if (stock.startTradeDate) {
      const today = moment().format("YYYY-MM-DD");
      const std = new Date(stock.startTradeDate);

      if (response.data.data.dividends.rows) {
        const last = response.data.data.dividends.rows.find(
          (res) =>
            moment(new Date(res.paymentDate)).isBefore(new Date(today)) &&
            moment(new Date(res.exOrEffDate)).isAfter(moment(std))
        );
        if (last) {
          const isExistDividends = moment(stock.lastDividendPayDate).isSame(
            new Date(moment(last.paymentDate).format("YYYY-MM-DD"))
          );
          if (!isExistDividends && stock.ticker && stock.averageCostPerShare) {
            const xataStock = await xataClient.db.portfolioStock
              .filter("ticker", stock.ticker)
              .getFirst();
            if (xataStock) {
              await xataClient.db.portfolioStock.update(xataStock.id, {
                lastDividendPayDate: moment(last.paymentDate)
                  .tz("UTC")
                  .startOf("day")
                  .toDate(),
                gainRealizedValue: stock.gainRealizedValue
                  ? Number(
                      (
                        stock.gainRealizedValue +
                        (await getAmountActiveShares(stock.ticker)) *
                          Number(Number(last.amount.split("$")[1]).toFixed(2))
                      ).toFixed(2)
                    )
                  : Number(
                      (
                        (await getAmountActiveShares(stock.ticker)) *
                        Number(Number(last.amount.split("$")[1]).toFixed(2))
                      ).toFixed(2)
                    ),
                gainRealizedPercentage: stock.gainRealizedPercentage
                  ? stock.gainRealizedPercentage +
                    Number(
                      (
                        (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
                          stock.averageCostPerShare) *
                        100
                      ).toFixed(2)
                    )
                  : Number(
                      (
                        (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
                          stock.averageCostPerShare) *
                        100
                      ).toFixed(2)
                    ),
              });
              await xataClient.db.dividend.create({
                dividendValue: Number(
                  Number(last.amount.split("$")[1]).toFixed(2)
                ),
                dividendYield: Number(
                  (
                    (Number(Number(last.amount.split("$")[1]).toFixed(2)) /
                      stock.averageCostPerShare) *
                    100
                  ).toFixed(2)
                ),
                ticker: stock.ticker,
                payDate: new Date(
                  moment(last.paymentDate).format("YYYY-MM-DD")
                ),
                totalAmount:
                  (await getAmountActiveShares(stock.ticker)) *
                  Number(Number(last.amount.split("$")[1]).toFixed(2)),
              });
            }
          }
        }
      }
    }
  });

  res.json({ message: "Ok" });
}
