import { CalendarEarnings } from "@/components/CalendarEarnings/CalendarEarnings";
import { ChartDividends } from "@/components/ChartDividends/ChartDividends";
import { ChartMapStocks } from "@/components/ChartMapStocks/ChartMapStocks";
import { ChartSectors } from "@/components/ChartSectors/ChartSectors";
import { ChartUpcomingDividends } from "@/components/ChartUpcomingDividends/ChartUpcomingDividends";
import { Header } from "@/components/Header/Header";
import { IPortfolioStock, ISupaPortfolio, ISupaStock } from "@/types/types";
import { FC } from "react";

type DashboardScreenProps = {
  portfolio: ISupaPortfolio | null;
  calendarEarning: ISupaStock[] | null;
  balance: number | null;
  stockPortfolio: IPortfolioStock[] | null;
};

export const DashboardScreen: FC<DashboardScreenProps> = ({
  portfolio,
  calendarEarning,
  balance,
  stockPortfolio,
}) => {
  return (
    <>
      <Header />
      <div style={{ margin: "1rem" }}>
        <div
          style={{
            padding: "1rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            {portfolio?.total_cost && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Total cost: {portfolio?.total_cost}$</p>
              </div>
            )}

            {portfolio?.gain_margin && portfolio.gain_value && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>
                  Gain: {portfolio?.gain_value}$ / {portfolio?.gain_margin}%
                </p>
              </div>
            )}

            {portfolio?.active_cost && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Active cost: {portfolio?.active_cost}$</p>
              </div>
            )}

            {portfolio?.market_cap && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Market cap: {portfolio?.market_cap}$</p>
              </div>
            )}

            {balance && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Balance: {balance}$</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex" }}>
            {calendarEarning && (
              <div style={{ width: "40%" }}>
                <CalendarEarnings calendarEarning={calendarEarning} />
              </div>
            )}
            <div
              style={{
                width: "60%",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "0 0 0 1rem",
              }}
            >
              <div style={{ width: "70%" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Sectors
                </p>
                <ChartSectors />
              </div>

              <div>
                <ChartMapStocks data={stockPortfolio} />
              </div>

              <div style={{ width: "70%" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Dividends Income
                </p>
                <ChartDividends />
              </div>

              <div style={{ width: "70%" }}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Upcoming Dividends
                </p>
                <ChartUpcomingDividends />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
