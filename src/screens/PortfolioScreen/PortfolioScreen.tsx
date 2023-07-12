import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";

export const PortfolioScreen = () => {
  const [portfolio, setPortfolio] = useState<IPortfolioStock[]>([]);

  useEffect(() => {
    // PortfolioService.getPortfolio().then((res) =>
    //   setPortfolio(res.data.portfolio)
    // );

    const fetch = async () => {
      const responseGetPortfolio = await PortfolioService.getPortfolio();
      if (responseGetPortfolio) {
        setPortfolio(responseGetPortfolio.data.portfolio);
      }

      // await axios.get("/api/hello");

      // const price = await axios.get<{
      //   data: { primaryData: { lastSalePrice: string } };
      // }>(`https://api.nasdaq.com/api/quote/USB/info?assetclass=stocks`, {
      //   headers: {},
      // });

      // console.log(price);
    };
    fetch();
  }, []);

  return (
    <>
      {portfolio.map((item) => (
        <>
          <p>{item.ticker}</p>
          <p>{item.gainUnrealizedPercentage}%</p>
        </>
      ))}
    </>
  );
};
