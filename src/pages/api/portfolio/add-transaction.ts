import { supabaseClient } from "@/config/supabaseClient";
import { averageCostPerShare } from "@/utils/averageCostPerShare";
import { getRealizedValue } from "@/utils/getRealizedValue";
import { getMarketCap } from "@/utils/portfolio/getMarketCap";
import { getGainValue } from "../../../utils/portfolio/getGainValue";
import { getGainMargin } from "../../../utils/portfolio/getGainMargin";
import { getTotalReturnMarginStock } from "@/utils/stockPortfolio/getTotalReturnMarginStock";
import axios from "axios";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { getPriceCurrent } from "@/utils/getPriceCurrent";
import { ROUND } from "@/utils/round";

const getPortfolioValue = async (portfolioId: string) => {
  // const stockPortfolioRef = query(
  //   collection(db, "stock_portfolio"),
  //   where("portfolioId", "==", portfolioId)
  // );
  // const stockPortfolio = (await getDocs(stockPortfolioRef)).docs.map((item) =>
  //   item.data()
  // );
  // const result = stockPortfolio.reduce(
  //   (acc, item) => (acc += item.priceCurrent * item.amountActiveShares),
  //   0
  // );
  // return result;

  const stockPortfolio = await supabaseClient
    .from("stock_portfolio")
    .select()
    .eq("portfolio_id", portfolioId);
  if (stockPortfolio.data) {
    const result = stockPortfolio.data.reduce(
      (acc, item) =>
        (acc += Number(item.price_current) * Number(item.amount_active_shares)),
      0
    );
    return result;
  }
  return 0;
};

const getUnrealizedValueAfterSell = (
  countSell: number,
  amountActiveShares: number,
  averageCostPerShare: number,
  marketPrice: number
) => {
  const updatedAmountActiveShares = amountActiveShares - countSell;
  const buyCost = updatedAmountActiveShares * averageCostPerShare;
  const sellCost = updatedAmountActiveShares * marketPrice;
  const result = sellCost - buyCost;
  return ROUND(result);
};

const getUnrealizedMarginAftelSell = (
  countSell: number,
  amountActiveShares: number,
  averageCostPerShare: number,
  marketPrice: number
) => {
  const updatedAmountActiveShares = amountActiveShares - countSell;
  const marketCap = updatedAmountActiveShares * marketPrice;
  const result = ROUND(
    (getUnrealizedValueAfterSell(
      countSell,
      amountActiveShares,
      averageCostPerShare,
      marketPrice
    ) /
      marketCap) *
      100
  );
  return result;
};

const checkIfDividendStock = async (ticker: string) => {
  const arrYear = [
    (Number(moment(new Date()).format("YYYY")) - 1).toString(),
    moment(new Date()).format("YYYY"),
  ];
  const response = await axios.get<{ results: { pay_date: string }[] }>(
    `https://api.polygon.io/v3/reference/dividends?ticker=${ticker}&apiKey=OZ_9x0ccKRsnzoE6OqsoW0oGeQCmAohs`
  );

  if (response.data) {
    if (response.data.results.length > 0) {
      const exist = arrYear.some((item) =>
        response.data.results[0].pay_date.includes(item)
      );
      return exist;
    }
  }
  return false;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ticker, price, count, type, date, portfolioId, userId } = req.body;

  const updatedDate = date;

  if (type === "buy") {
    // const stock = (await getDoc(doc(db, "stock", ticker))).data();
    const stock = await supabaseClient
      .from("stock")
      .select()
      .eq("ticker", ticker)
      .single();

    // const stockPortfolioRef = query(
    //   collection(db, "stock_portfolio"),
    //   where("portfolioId", "==", portfolioId)
    // );
    // const stockPortfolio = (await getDocs(stockPortfolioRef)).docs
    //   .map((item) => ({
    //     id: item.id,
    //     ticker: item.data().ticker,
    //     amountActiveShares: item.data().amountActiveShares,
    //     averageCostPerShare: item.data().averageCostPerShare,
    //   }))
    //   .find((b) => b.ticker === ticker);
    const stockPortfolio = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("portfolio_id", portfolioId)
      .eq("ticker", ticker)
      .single();

    const lastChangePortfolio = () => {
      if (!stockPortfolio.data) {
        return "new";
      }

      if (stockPortfolio.data && stockPortfolio.data.amount_active_shares) {
        const change = (
          (count * 100) /
          stockPortfolio.data.amount_active_shares
        ).toFixed(2);

        return `Increase ${change}%`;
      }

      return "";
    };

    // await addDoc(collection(db, "transaction"), {
    //   ticker,
    //   count,
    //   price,
    //   type,
    //   date,
    //   portfolioId,
    //   change: lastChangePortfolio(),
    // });
    await supabaseClient.from("transaction").insert({
      ticker,
      count,
      price,
      type,
      date: updatedDate,
      portfolio_id: portfolioId,
      change: lastChangePortfolio(),
    });

    if (stock.data) {
      if (stockPortfolio.data) {
        // await updateDoc(doc(db, "stock_portfolio", stockPortfolio.id), {
        //   averageCostPerShare: Number(
        //     ((stockPortfolio.averageCostPerShare + price) / 2).toFixed(2)
        //   ),
        //   amountActiveShares: stockPortfolio.amountActiveShares + count,
        //   lastChangePortfolio: lastChangePortfolio(),
        //   gainMargin: Number(
        //     (
        //       ((Number(
        //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
        //       ) *
        //         count -
        //         price * count) /
        //         price) *
        //       count *
        //       100
        //     ).toFixed(2)
        //   ),
        //   gainValue: Number(
        //     (
        //       Number(
        //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
        //       ) *
        //         count -
        //       price * count
        //     ).toFixed(2)
        //   ),
        //   priceCurrent:
        //     (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price,
        //   priceGrowth: stock.priceGrowth,
        //   priceTarget: stock.priceTarget,
        //   totalReturnMargin: null,
        //   totalReturnValue: null,
        //   lastDividendPayDate: null,
        //   totalDividendIncome: null,
        //   dividendUpcomingDate: null,
        //   dividendUpcomingValue: null,
        //   percOfPortfolio: Number(
        //     (
        //       ((Number(await getPriceCurrent(stock.ticker, stock.exchange)) *
        //         (count + stockPortfolio.amountActiveShares)) /
        //         ((await getPortfolioValue(portfolioId)) +
        //           Number(await getPriceCurrent(stock.ticker, stock.exchange)) *
        //             count)) *
        //       100
        //     ).toFixed(2)
        //   ),
        // });

        const priceCurrent =
          (await getPriceCurrent(stock.data.ticker, stock.data.exchange)) ??
          price;
        const amountActiveShares =
          stockPortfolio.data.amount_active_shares + count;
        const averageCostPerShare = ROUND(
          (stockPortfolio.data.average_cost_per_share + price) / 2
        );
        const portfolioValue = await getPortfolioValue(portfolioId);

        await supabaseClient
          .from("stock_portfolio")
          .update({
            average_cost_per_share: averageCostPerShare,
            amount_active_shares: amountActiveShares,
            last_change_portfolio: lastChangePortfolio(),
            gain_value: ROUND(
              priceCurrent * amountActiveShares -
                averageCostPerShare * amountActiveShares
            ),
            gain_margin: ROUND(
              ((priceCurrent * amountActiveShares -
                averageCostPerShare * amountActiveShares) /
                (averageCostPerShare * amountActiveShares)) *
                100
            ),
            market_price: priceCurrent,
            price_target: stock.data.price_target,
            price_growth: ROUND(
              ((Number(stock.data.price_target) - priceCurrent) /
                priceCurrent) *
                100
            ),
            perc_of_portfolio: ROUND(
              ((priceCurrent * amountActiveShares) /
                (portfolioValue + priceCurrent * count)) *
                100
            ),
          })
          .eq("portfolio_id", portfolioId)
          .eq("ticker", ticker);

        // const stocksPortfolioRef = query(
        //   collection(db, "stock_portfolio"),
        //   where("portfolioId", "==", portfolioId)
        // );
        // const stocksPortfolio = (await getDocs(stocksPortfolioRef)).docs.map(
        //   (item) => ({
        //     id: item.id,
        //     amountActiveShares: item.data().amountActiveShares,
        //     priceCurrent: item.data().priceCurrent,
        //   })
        // );

        const stocksPortfolio = await supabaseClient
          .from("stock_portfolio")
          .select()
          .eq("portfolio_id", portfolioId)
          .neq("ticker", ticker);

        // if (stocksPortfolio.length > 0) {
        //   stocksPortfolio.forEach(async (item) => {
        //     await updateDoc(doc(db, "stock_portfolio", item.id), {
        //       percOfPortfolio:
        //         (item.amountActiveShares * item.priceCurrent) /
        //         ((await getPortfolioValue(portfolioId)) +
        //           Number(await getPriceCurrent(stock.ticker, stock.exchange)) *
        //             count),
        //     });
        //   });
        // }

        console.log("stocksPortfolio.data", stocksPortfolio.data);
        if (stocksPortfolio.data) {
          stocksPortfolio.data.forEach(async (item) => {
            await supabaseClient
              .from("stock_portfolio")
              .update({
                perc_of_portfolio: ROUND(
                  ((Number(item.price_current) *
                    Number(item.amount_active_shares)) /
                    (await getPortfolioValue(item.portfolio_id))) *
                    100
                ),
              })
              .eq("portfolio_id", item.portfolio_id)
              .eq("ticker", item.ticker);
          });
        }
      } else {
        // await addDoc(collection(db, "stock_portfolio"), {
        //   averageCostPerShare: price,
        //   amountActiveShares: count,
        //   lastChangePortfolio: lastChangePortfolio(),
        //   gainMargin: Number(
        //     (
        //       ((Number(
        //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
        //       ) *
        //         count -
        //         price * count) /
        //         price) *
        //       count *
        //       100
        //     ).toFixed(2)
        //   ),
        //   gainValue: Number(
        //     (
        //       Number(
        //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
        //       ) *
        //         count -
        //       price * count
        //     ).toFixed(2)
        //   ),
        //   priceCurrent:
        //     (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price,
        //   priceGrowth: stock.priceGrowth,
        //   priceTarget: stock.priceTarget,
        //   exchange: stock.exchange,
        //   isTrading: true,
        //   startTradeDate: date,
        //   ticker,
        //   portfolioId,
        //   totalReturnMargin: null,
        //   totalReturnValue: null,
        //   lastDividendPayDate: null,
        //   totalDividendIncome: null,
        //   dividendUpcomingDate: null,
        //   dividendUpcomingValue: null,
        //   percOfPortfolio: Number(
        //     (
        //       ((Number(await getPriceCurrent(stock.ticker, stock.exchange)) *
        //         count) /
        //         ((await getPortfolioValue(portfolioId)) +
        //           Number(await getPriceCurrent(stock.ticker, stock.exchange)) *
        //             count)) *
        //       100
        //     ).toFixed(2)
        //   ),
        // });

        const priceCurrent =
          (await getPriceCurrent(stock.data.ticker, stock.data.exchange)) ??
          price;
        // const amountActiveShares =
        //   stockPortfolio.data.amount_active_shares + count;
        // const averageCostPerShare = ROUND(
        //   (stockPortfolio.data.average_cost_per_share + price) / 2
        // );
        const percOfPortfolio = async () => {
          const value = await getPortfolioValue(portfolioId);
          if (value === 0) {
            return 100;
          } else {
            return ROUND(
              ((priceCurrent * count) / (value + priceCurrent * count)) * 100
            );
          }
        };

        await supabaseClient.from("stock_portfolio").insert({
          exchange: stock.data.exchange,
          portfolio_id: portfolioId,
          ticker: stock.data.ticker,
          is_trading: true,
          startTradeDate: updatedDate,
          average_cost_per_share: price,
          amount_active_shares: count,
          last_change_portfolio: lastChangePortfolio(),
          gain_value: ROUND(priceCurrent * count - price * count),
          gain_margin: ROUND(
            ((priceCurrent * count - price * count) / price) * count * 100
          ),
          price_current: priceCurrent,
          price_target: stock.data.price_target,
          price_growth: ROUND(
            ((Number(stock.data.price_target) - priceCurrent) / priceCurrent) *
              100
          ),
          perc_of_portfolio: await percOfPortfolio(),
          is_dividend: await checkIfDividendStock(ticker),
        });

        // const stocksPortfolioRef = query(
        //   collection(db, "stock_portfolio"),
        //   where("portfolioId", "==", portfolioId)
        // );
        // const stocksPortfolio = (await getDocs(stocksPortfolioRef)).docs.map(
        //   (item) => ({
        //     id: item.id,
        //     amountActiveShares: item.data().amountActiveShares,
        //     priceCurrent: item.data().priceCurrent,
        //   })
        // );

        const stocksPortfolio = await supabaseClient
          .from("stock_portfolio")
          .select()
          .eq("portfolio_id", portfolioId)
          .neq("ticker", ticker);

        // if (stocksPortfolio.length > 0) {
        //   stocksPortfolio.forEach(async (item) => {
        //     await updateDoc(doc(db, "stock_portfolio", item.id), {
        //       percOfPortfolio: Number(
        //         (
        //           ((item.amountActiveShares * item.priceCurrent) /
        //             (await getPortfolioValue(portfolioId))) *
        //           100
        //         ).toFixed(2)
        //       ),
        //     });
        //   });
        // }

        if (stocksPortfolio.data) {
          stocksPortfolio.data.forEach(async (item) => {
            await supabaseClient
              .from("stock_portfolio")
              .update({
                perc_of_portfolio: ROUND(
                  ((Number(item.price_current) *
                    Number(item.amount_active_shares)) /
                    (await getPortfolioValue(item.portfolio_id))) *
                    100
                ),
              })
              .eq("portfolio_id", item.portfolio_id)
              .eq("ticker", item.ticker);
          });
        }
      }
    }

    // const portfolio = (await getDoc(doc(db, "portfolio", portfolioId))).data();

    const portfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("id", portfolioId)
      .single();

    if (portfolio.data && stock.data) {
      // await updateDoc(doc(db, "portfolio", portfolioId), {
      //   cost: Number((portfolio.cost + price * count).toFixed(2)),
      //   value: Number(
      //     (
      //       portfolio.value +
      //       Number(
      //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
      //       ) *
      //         count
      //     ).toFixed(2)
      //   ),
      //   gainValue: Number(
      //     (
      //       portfolio.value +
      //       Number(
      //         (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
      //       ) *
      //         count -
      //       (portfolio.cost + price * count)
      //     ).toFixed(2)
      //   ),
      //   gainMargin: Number(
      //     (
      //       ((portfolio.value +
      //         Number(
      //           (await getPriceCurrent(stock.ticker, stock.exchange)) ?? price
      //         ) *
      //           count -
      //         (portfolio.cost + price * count)) /
      //         (portfolio.cost + price * count)) *
      //       100
      //     ).toFixed(2)
      //   ),
      // });

      const priceCurrent =
        (await getPriceCurrent(stock.data.ticker, stock.data.exchange)) ??
        price;
      const newValue = ROUND(portfolio.data.value + priceCurrent * count);
      const newCost = ROUND(portfolio.data.cost + price * count);

      await supabaseClient
        .from("portfolio")
        .update({
          cost: newCost,
          value: newValue,
          gain_value: ROUND(newValue - newCost),
          gain_margin: ROUND(((newValue - newCost) / newCost) * 100),
        })
        .eq("id", portfolio.data.id);
    }

    // const user = (await getDoc(doc(db, "user", userId))).data();

    const user = await supabaseClient
      .from("user")
      .select()
      .eq("id", userId)
      .single();

    if (user.data) {
      // await updateDoc(doc(db, "user", userId), {
      //   balance: Number((user.balance - price * count).toFixed(2)),
      // });
      const newBalance = ROUND(user.data.balance - price * count);
      await supabaseClient
        .from("user")
        .update({ balance: newBalance })
        .eq("id", user.data.id);
    }
  }

  /* --- --- --- SELL --- --- --- */

  if (type === "sell") {
    const stock = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("ticker", ticker)
      .eq("portfolio_id", portfolioId)
      .single();

    const portfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("id", portfolioId)
      .single();

    const lastChangePortfolio = () => {
      if (stock.data) {
        if (
          stock.data.average_cost_per_share &&
          stock.data.amount_active_shares
        ) {
          if (stock.data.amount_active_shares === count) {
            return "sold";
          } else {
            const change = ROUND(
              (count / stock.data.amount_active_shares) * 100
            );
            return `reduce ${change}`;
          }
        }
      }
      return "";
    };

    await supabaseClient.from("transaction").insert({
      ticker,
      count,
      price,
      type: "sell",
      date: updatedDate,
      change: lastChangePortfolio(),
      portfolio_id: portfolioId,
    });

    if (
      stock.data &&
      portfolio.data &&
      stock.data.amount_active_shares &&
      stock.data.average_cost_per_share
    ) {
      if (stock.data.amount_active_shares === count) {
        const totalReturnValue = ROUND(
          Number(stock.data.total_return_value) +
            getRealizedValue(price, count, stock.data.average_cost_per_share)
        );

        const totalReturnMargin = getTotalReturnMarginStock(
          stock.data.total_return_value,
          getRealizedValue(price, count, stock.data.average_cost_per_share),
          stock.data.amount_active_shares,
          stock.data.average_cost_per_share
        );

        await supabaseClient
          .from("stock_portfolio")
          .update({
            startTradeDate: null,
            is_trading: false,
            amount_active_shares: null,
            average_cost_per_share: null,
            price_current: price,
            total_return_value: totalReturnValue,
            total_return_margin: totalReturnMargin,
            gain_margin: null,
            gain_value: null,
            last_change_portfolio: lastChangePortfolio(),
            perc_of_portfolio: 0,
          })
          .eq("ticker", ticker)
          .eq("portfolio_id", portfolioId);

        if (stock.data.startTradeDate) {
          if (stock.data.is_dividend) {
            const supaDividend = await supabaseClient
              .from("dividend")
              .select()
              .eq("ticker", stock.data.ticker)
              .eq("portfolio_id", stock.data.portfolio_id);

            const costValue =
              stock.data.average_cost_per_share *
              stock.data.amount_active_shares;
            const returnValue = price * stock.data.amount_active_shares;
            const profitMargin = ROUND(
              ((returnValue - costValue) / costValue) * 100
            );
            const profitValue = ROUND(returnValue - costValue);

            if (supaDividend.data) {
              const dividendIncome = supaDividend.data.reduce(
                (acc, item) => (acc += item.totalAmount),
                0
              );

              await supabaseClient.from("exit").insert({
                portfolio_id: portfolioId,
                finish_date: date,
                average_price_per_share: stock.data.average_cost_per_share,
                start_date: stock.data.startTradeDate,
                cost: costValue,
                return: returnValue + dividendIncome,
                profit_margin: profitMargin,
                profit_value: profitValue,
                ticker: stock.data.ticker,
              });
            } else {
              await supabaseClient.from("exit").insert({
                portfolio_id: portfolioId,
                finish_date: date,
                average_price_per_share: stock.data.average_cost_per_share,
                start_date: stock.data.startTradeDate,
                cost: costValue,
                return: returnValue,
                profit_margin: profitMargin,
                profit_value: profitValue,
                ticker: stock.data.ticker,
              });
            }
          }
        }
      }

      if (
        stock.data.amount_active_shares >= count &&
        stock.data.price_current &&
        portfolio.data.value
      ) {
        const priceCurrent = await getPriceCurrent(
          stock.data.ticker,
          stock.data.exchange
        );

        if (priceCurrent) {
          const percOfPortfolio = () => {
            const newValueStock =
              priceCurrent * (Number(stock.data.amount_active_shares) - count);
            const newValuePortfolio =
              portfolio.data.value - priceCurrent * count;
            const result = ROUND((newValueStock / newValuePortfolio) * 100);
            return result;
          };

          const totalReturnValue =
            stock.data.total_return_value ??
            0 +
              getRealizedValue(price, count, stock.data.average_cost_per_share);

          const totalReturnMargin = getTotalReturnMarginStock(
            stock.data.total_return_value,
            getRealizedValue(price, count, stock.data.average_cost_per_share),
            stock.data.amount_active_shares,
            stock.data.average_cost_per_share
          );

          await supabaseClient
            .from("stock_portfolio")
            .update({
              price_current: price,
              total_return_value: totalReturnValue,
              total_return_margin: totalReturnMargin,
              gain_value: getUnrealizedValueAfterSell(
                count,
                stock.data.amount_active_shares,
                stock.data.average_cost_per_share,
                price
              ),
              gain_margin: getUnrealizedMarginAftelSell(
                count,
                stock.data.amount_active_shares,
                stock.data.average_cost_per_share,
                price
              ),
              amount_active_shares: stock.data.amount_active_shares - count,
              last_change_portfolio: lastChangePortfolio(),
              perc_of_portfolio: percOfPortfolio(),
            })
            .eq("ticker", stock.data.ticker)
            .eq("portfolio_id", portfolioId);
        }
      }
    }

    const user = await supabaseClient
      .from("user")
      .select()
      .eq("id", userId)
      .single();

    if (user.data && stock.data) {
      if (stock.data.average_cost_per_share) {
        await supabaseClient
          .from("user")
          .update({
            balance: ROUND(user.data.balance + price * count),
          })
          .eq("id", userId);
      }
    }

    if (portfolio.data && portfolio.data.cost && stock.data) {
      if (stock.data.average_cost_per_share) {
        const priceCurrent = await getPriceCurrent(
          stock.data.ticker,
          stock.data.exchange
        );

        if (priceCurrent) {
          const newValue = ROUND(portfolio.data.value - priceCurrent * count);
          const newCost = ROUND(
            portfolio.data.cost - stock.data.average_cost_per_share * count
          );

          await supabaseClient
            .from("portfolio")
            .update({
              cost: newCost,
              value: newValue,
              gain_value: ROUND(newValue - newCost),
              gain_margin: ROUND(((newValue - newCost) / newCost) * 100),
            })
            .eq("id", portfolioId);
        }
      }
    }
  }

  res.json({ message: "Ok" });
}
