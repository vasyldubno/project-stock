import { PortfolioService } from "@/services/PortfolioService";
import { IPortfolioStock } from "@/types/types";
import { useEffect, useState } from "react";

export const PortfolioScreen = () => {
  const [portfolio, setPortfolio] = useState<IPortfolioStock[]>([]);

  useEffect(() => {
    // PortfolioService.getPortfolio().then((res) =>
    //   setPortfolio(res.data.portfolio)
    // );
    const fetch = async () => {
      const response = await PortfolioService.getPortfolio();
      setPortfolio(response.data.portfolio);
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
