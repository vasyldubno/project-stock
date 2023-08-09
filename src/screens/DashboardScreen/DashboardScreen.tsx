import { CalendarEarnings } from "@/components/CalendarEarnings/CalendarEarnings";
import { ChartDividends } from "@/components/ChartDividends/ChartDividends";
import { ChartSectors } from "@/components/ChartSectors/ChartSectors";
import { ChartUpcomingDividends } from "@/components/ChartUpcomingDividends/ChartUpcomingDividends";
import { Header } from "@/components/Header/Header";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ISupaPortfolio } from "@/types/types";
import { FC, useEffect, useState } from "react";
import {
  useCalendarEarning,
  useDividendIncomeInMonth,
  usePortfolioCost,
  usePortfolioGainMargin,
  usePortfolioGainValue,
  usePortfolioValue,
  usePortfolios,
  useStockPortfolio,
  useUpcomingDividends,
} from "./queries";
import s from "./styles.module.scss";

export const DashboardScreen: FC = () => {
  const user = useUser();

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);

  const portfolios = usePortfolios(user);
  const calendarEarning = useCalendarEarning(user, selectedPortfolio);
  const dividendIncomeInMonth = useDividendIncomeInMonth(selectedPortfolio);
  const upcomingDividends = useUpcomingDividends(selectedPortfolio);
  const stockPortfolio = useStockPortfolio(selectedPortfolio);
  const gainValue = usePortfolioGainValue(selectedPortfolio);
  const gainMargin = usePortfolioGainMargin(selectedPortfolio);
  const portfolioValue = usePortfolioValue(selectedPortfolio);
  const portfolioCost = usePortfolioCost(selectedPortfolio);

  useEffect(() => {
    if (portfolios) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  return (
    <>
      {user && user.id && (
        <>
          <Header />

          <div style={{ padding: "1rem" }}>
            {portfolios && (
              <TabsPortfolio
                tabs={portfolios.map((item) => ({
                  content: (
                    <p onClick={() => setSelectedPortfolio(item)}>
                      {item.title}
                    </p>
                  ),
                }))}
              />
            )}

            <div style={{ margin: "1rem" }}>
              <div
                style={{
                  padding: "1rem 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div
                  style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        display: portfolioCost ? "block" : "none",
                        border: "1px solid var(--color-gray)",
                        borderRadius: "0.5rem",
                        width: "fit-content",
                        padding: "1rem",
                      }}
                    >
                      <p>
                        <span>Portfolio Cost: ${portfolioCost}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        display: portfolioValue ? "block" : "none",
                        border: "1px solid var(--color-gray)",
                        borderRadius: "0.5rem",
                        width: "fit-content",
                        padding: "1rem",
                      }}
                    >
                      <p>
                        <span>Portfolio Value: ${portfolioValue}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div
                      style={{
                        display:
                          gainMargin && gainMargin ? "inline-block" : "none",
                        border: "1px solid var(--color-gray)",
                        borderRadius: "0.5rem",
                        width: "fit-content",
                        padding: "1rem",
                      }}
                    >
                      <p>
                        <span>Gain: ${gainValue} /</span>
                        <span>{gainMargin}%</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className={s.section__charts}>
                  <div style={{}}>
                    {calendarEarning && (
                      <CalendarEarnings calendarEarning={calendarEarning} />
                    )}
                  </div>

                  <div
                    style={{
                      // width: "70%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                      padding: "0 0 0 1rem",
                      width: "100%",
                    }}
                  >
                    {stockPortfolio && stockPortfolio.length > 0 && (
                      <div className={s.chart__wrapper}>
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
                    )}

                    {dividendIncomeInMonth &&
                      dividendIncomeInMonth.some((item) => item.amount > 0) && (
                        <div className={s.chart__wrapper}>
                          <p
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            Dividends Income
                          </p>
                          <ChartDividends data={dividendIncomeInMonth} />
                        </div>
                      )}

                    {upcomingDividends &&
                      upcomingDividends.some((item) => item.amount > 0) && (
                        <div className={s.chart__wrapper}>
                          <p
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "1.2rem",
                            }}
                          >
                            Upcoming Dividends
                          </p>
                          <ChartUpcomingDividends data={upcomingDividends} />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
