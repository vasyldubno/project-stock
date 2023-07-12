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
      // const responseUpdatePortfolio = await PortfolioService.updatePortfolio();
      // if (responseUpdatePortfolio) {
      //   const responseGetPortfolio = await PortfolioService.getPortfolio();
      //   if (responseGetPortfolio) {
      //     setPortfolio(responseGetPortfolio.data.portfolio);
      //   }
      // }

      await axios.get("/api/hello");
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
