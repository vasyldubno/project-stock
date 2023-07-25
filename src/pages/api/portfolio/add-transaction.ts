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
  return result;
};

const getUnrealizedMarginAftelSell = (
  countSell: number,
  amountActiveShares: number,
  averageCostPerShare: number,
  marketPrice: number
) => {
  const updatedAmountActiveShares = amountActiveShares - countSell;
  const marketCap = updatedAmountActiveShares * marketPrice;
  const result = Number(
    (
      (getUnrealizedValueAfterSell(
        countSell,
        amountActiveShares,
        averageCostPerShare,
        marketPrice
      ) /
        marketCap) *
      100
    ).toFixed(2)
  );
  return result;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { ticker, price, count, type } = req.body;

  const updatedDate = moment(new Date(), "DD.MM.YYYY").format("YYYY-MM-DD");

  if (type === "buy") {
    const responseExchange = await axios.get<{ Exchange: string }>(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=U0366SZHJEG1GO6E`
    );

    const existStock = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("ticker", ticker)
      .single();

    const portfolio = await supabaseClient.from("portfolio").select().single();

    const priceTarget = await supabaseClient
      .from("stock")
      .select("price_target")
      .eq("ticker", ticker)
      .single();

    const lastChangePortfolio = () => {
      if (!existStock) {
        return "new";
      }

      if (
        existStock.data &&
        existStock.data.average_cost_per_share &&
        existStock.data.amount_active_shares
      ) {
        const oldValue =
          existStock.data.average_cost_per_share *
          existStock.data.amount_active_shares;

        const newValue = price * count;

        const change = (newValue / oldValue) * 100;

        return `increase ${change}%`;
      }

      return "";
    };

    await supabaseClient.from("transaction").insert({
      count: count,
      date: updatedDate,
      price,
      ticker,
      type,
      change: lastChangePortfolio(),
    });

    if (existStock.data && responseExchange) {
      if (portfolio.data && priceTarget.data) {
        await supabaseClient
          .from("stock_portfolio")
          .update({
            is_trading: true,
            market_price: price,
            average_cost_per_share: await averageCostPerShare(
              ticker,
              price,
              count,
              "buy"
            ),
            amount_active_shares: existStock.data.amount_active_shares
              ? existStock.data.amount_active_shares + count
              : count,
            portfolio_id: portfolio.data.id,
            price_target: priceTarget.data.price_target,
            last_change_portfolio: lastChangePortfolio(),
          })
          .eq("ticker", ticker);

        if (!existStock.data.is_trading) {
          await supabaseClient
            .from("stock_portfolio")
            .update({ startTradeDate: updatedDate })
            .eq("ticker", ticker);
        }
      }
    } else {
      if (portfolio.data && priceTarget.data) {
        await supabaseClient.from("stock_portfolio").insert({
          ticker,
          exchange: responseExchange.data.Exchange,
          is_trading: true,
          market_price: price,
          startTradeDate: updatedDate,
          average_cost_per_share: price,
          amount_active_shares: count,
          portfolio_id: portfolio.data.id,
          price_target: priceTarget.data.price_target,
          last_change_portfolio: lastChangePortfolio(),
        });
      }
    }

    const user = await supabaseClient
      .from("user")
      .select()
      .eq("username", "vasyldubno")
      .single();

    if (user.data) {
      await supabaseClient
        .from("user")
        .update({
          balance: user.data.balance - price * count,
        })
        .eq("username", "vasyldubno");
    }

    if (portfolio.data && portfolio.data.active_cost && existStock.data) {
      if (existStock.data.average_cost_per_share) {
        await supabaseClient
          .from("portfolio")
          .update({
            total_return: portfolio.data.total_return
              ? Number((portfolio.data.total_return + price * count).toFixed(2))
              : Number((price * count).toFixed(2)),
            active_cost:
              portfolio.data.active_cost -
              existStock.data?.average_cost_per_share * count,
            market_cap: await getMarketCap(),
            gain_value: await getGainValue(),
            gain_margin: await getGainMargin(),
          })
          .eq("title", portfolio.data.title);
      }
    }
  }

  // --- --- --- SELL --- --- ---

  if (type === "sell") {
    const lastChangePortfolio = () => {
      if (stock.data) {
        if (
          stock.data.average_cost_per_share &&
          stock.data.amount_active_shares
        ) {
          const oldValue =
            stock.data?.average_cost_per_share *
            stock.data?.amount_active_shares;

          const newValue = price * count;

          const change = (newValue / oldValue) * 100;

          if (change === 100) {
            return "sold";
          } else {
            return `reduce ${change}%`;
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
    });

    const stock = await supabaseClient
      .from("stock_portfolio")
      .select()
      .eq("ticker", ticker)
      .single();

    if (
      stock.data &&
      stock.data.amount_active_shares &&
      stock.data.average_cost_per_share
    ) {
      if (stock.data.amount_active_shares === count) {
        await supabaseClient
          .from("stock_portfolio")
          .update({
            startTradeDate: null,
            is_trading: false,
            amount_active_shares: null,
            market_price: price,
            total_return_value: stock.data.total_return_value
              ? stock.data.total_return_value +
                getRealizedValue(
                  price,
                  count,
                  stock.data.average_cost_per_share
                )
              : getRealizedValue(
                  price,
                  count,
                  stock.data.average_cost_per_share
                ),
            total_return_margin: getTotalReturnMarginStock(
              stock.data.total_return_value,
              getRealizedValue(price, count, stock.data.average_cost_per_share),
              stock.data.amount_active_shares,
              stock.data.average_cost_per_share
            ),
            gain_unrealized_value: null,
            gain_unrealized_percentage: null,
            last_change_portfolio: lastChangePortfolio(),
          })
          .eq("ticker", ticker);
      }

      if (stock.data.amount_active_shares >= count) {
        await supabaseClient.from("stock_portfolio").update({
          market_price: price,
          total_return_value: stock.data.total_return_value
            ? stock.data.total_return_value +
              getRealizedValue(price, count, stock.data.average_cost_per_share)
            : getRealizedValue(price, count, stock.data.average_cost_per_share),
          total_return_margin: getTotalReturnMarginStock(
            stock.data.total_return_value,
            getRealizedValue(price, count, stock.data.average_cost_per_share),
            stock.data.amount_active_shares,
            stock.data.average_cost_per_share
          ),
          gain_unrealized_value: getUnrealizedValueAfterSell(
            count,
            stock.data.amount_active_shares,
            stock.data.average_cost_per_share,
            price
          ),
          gain_unrealized_percentage: getUnrealizedMarginAftelSell(
            count,
            stock.data.amount_active_shares,
            stock.data.average_cost_per_share,
            price
          ),
          amount_active_shares: stock.data.amount_active_shares - count,
          last_change_portfolio: lastChangePortfolio(),
        });
      }
    }

    const user = await supabaseClient
      .from("user")
      .select()
      .eq("username", "vasyldubno")
      .single();

    if (user.data && stock.data) {
      if (stock.data.average_cost_per_share) {
        await supabaseClient
          .from("user")
          .update({
            balance: Number((user.data.balance + price * count).toFixed(2)),
          })
          .eq("username", "vasyldubno");
      }
    }

    const portfolio = await supabaseClient.from("portfolio").select().single();

    if (portfolio.data && portfolio.data.active_cost && stock.data) {
      if (stock.data.average_cost_per_share) {
        await supabaseClient
          .from("portfolio")
          .update({
            total_return: portfolio.data.total_return
              ? Number((portfolio.data.total_return + price * count).toFixed(2))
              : Number((price * count).toFixed(2)),
            active_cost:
              portfolio.data.active_cost -
              stock.data?.average_cost_per_share * count,
            market_cap: await getMarketCap(),
            gain_value: await getGainValue(),
            gain_margin: await getGainMargin(),
          })
          .eq("title", portfolio.data.title);
      }
    }
  }

  res.json({ message: "Ok" });
}
