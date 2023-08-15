import { supabaseClient } from "@/config/supabaseClient";
import { getPriceCurrent } from "@/utils/getPriceCurrent";
import { getRealizedValue } from "@/utils/getRealizedValue";
import { ROUND } from "@/utils/round";
import { getTotalReturnMarginStock } from "@/utils/stockPortfolio/getTotalReturnMarginStock";
import axios from "axios";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";

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
    const stock = await supabaseClient
      .from("stock")
      .select()
      .eq("ticker", ticker)
      .single();
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
        const amountActiveShares =
          stockPortfolio.data.amount_active_shares + count;
        const averageCostPerShare = ROUND(
          (stockPortfolio.data.average_cost_per_share + price) / 2
        );
        await supabaseClient
          .from("stock_portfolio")
          .update({
            average_cost_per_share: averageCostPerShare,
            amount_active_shares: amountActiveShares,
            last_change_portfolio: lastChangePortfolio(),
          })
          .eq("portfolio_id", portfolioId)
          .eq("ticker", ticker);
      } else {
        await supabaseClient.from("stock_portfolio").insert({
          exchange: stock.data.exchange,
          portfolio_id: portfolioId,
          ticker: stock.data.ticker,
          is_trading: true,
          startTradeDate: updatedDate,
          average_cost_per_share: price,
          amount_active_shares: count,
          last_change_portfolio: lastChangePortfolio(),
          is_dividend: await checkIfDividendStock(ticker),
        });
      }
    }
    const portfolio = await supabaseClient
      .from("portfolio")
      .select()
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .single();
    if (portfolio.data && stock.data) {
      const newCost = ROUND(portfolio.data.cost + price * count);
      await supabaseClient
        .from("portfolio")
        .update({
          cost: newCost,
        })
        .eq("id", portfolio.data.id)
        .eq("user_id", userId);
    }
    const user = await supabaseClient
      .from("user")
      .select()
      .eq("id", userId)
      .single();
    if (user.data) {
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
            total_return_value: totalReturnValue,
            total_return_margin: totalReturnMargin,
            last_change_portfolio: lastChangePortfolio(),
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
              total_return_value: totalReturnValue,
              total_return_margin: totalReturnMargin,
              amount_active_shares: stock.data.amount_active_shares - count,
              last_change_portfolio: lastChangePortfolio(),
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
          const newCost = ROUND(
            portfolio.data.cost - stock.data.average_cost_per_share * count
          );

          await supabaseClient
            .from("portfolio")
            .update({
              cost: newCost,
            })
            .eq("id", portfolioId);
        }
      }
    }
  }

  res.json({ message: "Ok" });
}
