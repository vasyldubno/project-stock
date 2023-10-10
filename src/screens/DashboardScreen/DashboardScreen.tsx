import { CalendarEarnings } from "@/components/CalendarEarnings/CalendarEarnings";
import { ChartDividends } from "@/components/ChartDividends/ChartDividends";
import { ChartSectors } from "@/components/ChartSectors/ChartSectors";
import { ChartUpcomingDividends } from "@/components/ChartUpcomingDividends/ChartUpcomingDividends";
import { Header } from "@/components/Header/Header";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { ISupaPortfolio } from "@/types/types";
import { FC, useEffect, useRef, useState } from "react";
import {
  useCalendarEarning,
  useDividendIncomeByYear,
  useDividendIncomeInMonth,
  useDividendsList,
  usePortfolioCost,
  usePortfolioGainMargin,
  usePortfolioGainValue,
  usePortfolioSectors,
  usePortfolioValue,
  usePortfolios,
  useStockPortfolio,
  useUpcomingDividends,
  useUpcomingDividendsList,
} from "./queries";
import s from "./styles.module.scss";
import { ROUND } from "@/utils/round";
import { TableDividends } from "@/components/TableDividends/TableDividends";
import { TableUpcomingDividends } from "@/components/TableUpcomingDividends/TableUpcomingDividends";
import { RationItem } from "./RationItem/RationItem";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { Loader } from "@/components/Loader/Loader";
import { ChartTreeMap } from "@/components/ChartTreeMap/ChartTreeMap";

export const DashboardScreen: FC = () => {
  const user = useUser();

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<ISupaPortfolio | null>(null);

  const portfolios = usePortfolios(user);
  const calendarEarning = useCalendarEarning(user, selectedPortfolio);
  const dividendIncomeInMonth = useDividendIncomeInMonth(selectedPortfolio);
  const dividendIncomeByYear = useDividendIncomeByYear(selectedPortfolio);
  const upcomingDividends = useUpcomingDividends(selectedPortfolio);
  const stockPortfolio = useStockPortfolio(selectedPortfolio);
  const gainValue = usePortfolioGainValue(selectedPortfolio);
  const gainMargin = usePortfolioGainMargin(selectedPortfolio);
  const portfolioValue = usePortfolioValue(selectedPortfolio);
  const portfolioCost = usePortfolioCost(selectedPortfolio);
  const dividendsList = useDividendsList(selectedPortfolio);
  const upcomingDividendList = useUpcomingDividendsList(selectedPortfolio);
  const portfolioSectors = usePortfolioSectors(selectedPortfolio);
  const [sectionChartWidth, setSectionChartWidth] = useState(0);

  const sectionChartRef = useRef<HTMLDivElement>(null);

  const isDisplay =
    !!calendarEarning &&
    !!stockPortfolio &&
    !!dividendIncomeInMonth &&
    !!dividendsList &&
    !!upcomingDividends &&
    !!upcomingDividendList;

  useEffect(() => {
    if (portfolios) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  useEffect(() => {
    if (isDisplay && sectionChartRef.current) {
      const width = sectionChartRef.current.offsetWidth;
      setSectionChartWidth(width);
    }
  }, [isDisplay]);

  return (
    <>
      <Header />

      <div style={{ padding: "1rem" }}>
        {portfolios && (
          <TabsPortfolio
            tabs={portfolios.map((item) => ({
              content: (
                <p onClick={() => setSelectedPortfolio(item)}>{item.title}</p>
              ),
            }))}
          />
        )}

        {isDisplay ? (
          <>
            <div className={s.content}>
              <div className={s.sectionRatios}>
                <RationItem
                  styles={{ display: portfolioCost ? "block" : "none" }}
                >
                  <p>Portfolio Cost: ${portfolioCost}</p>
                </RationItem>

                <RationItem
                  styles={{ display: portfolioValue ? "block" : "none" }}
                >
                  <p>Portfolio Value: ${portfolioValue}</p>
                </RationItem>

                <RationItem
                  styles={{
                    display: gainMargin && gainMargin ? "block" : "none",
                  }}
                >
                  <p>
                    Gain: ${gainValue} / {gainMargin}%
                  </p>
                </RationItem>

                <RationItem
                  styles={{
                    display: dividendIncomeByYear ? "block" : "none",
                  }}
                >
                  <p>Dividend Annual Income: ${dividendIncomeByYear}</p>
                </RationItem>

                <RationItem
                  styles={{
                    display:
                      portfolioValue && dividendIncomeByYear ? "block" : "none",
                  }}
                >
                  <p>
                    Dividend Yield:{" "}
                    {ROUND(
                      (Number(dividendIncomeByYear) / Number(portfolioValue)) *
                        100
                    )}
                    %
                  </p>
                </RationItem>
              </div>

              <div className={s.section__charts}>
                <CalendarEarnings calendarEarning={calendarEarning} />

                <div
                  className={s.sectionChartsRightWrapper}
                  ref={sectionChartRef}
                >
                  {stockPortfolio && stockPortfolio.length > 0 && (
                    <div className={s.chart__wrapper}>
                      <p className={s.chart__title}>Sectors</p>
                      <ChartSectors data={portfolioSectors} />
                    </div>
                  )}

                  <div className={s.chart__wrapper}>
                    <ChartTreeMap
                      data={stockPortfolio.sort(
                        (a, b) =>
                          Number(b.amount_active_shares) *
                            Number(b.average_cost_per_share) -
                          Number(a.amount_active_shares) *
                            Number(a.average_cost_per_share)
                      )}
                      width={sectionChartWidth}
                    />
                  </div>

                  {dividendIncomeInMonth &&
                    dividendIncomeInMonth.some((item) => item.amount > 0) && (
                      <div className={s.chart__wrapper}>
                        <p className={s.chart__title}>Dividends Income</p>
                        <ChartDividends data={dividendIncomeInMonth} />
                      </div>
                    )}

                  {dividendsList && <TableDividends data={dividendsList} />}

                  {upcomingDividends &&
                    upcomingDividends.some((item) => item.amount > 0) && (
                      <div className={s.chart__wrapper}>
                        <p className={s.chart__title}>Upcoming Dividends</p>
                        <ChartUpcomingDividends data={upcomingDividends} />
                      </div>
                    )}

                  {upcomingDividendList && (
                    <TableUpcomingDividends data={upcomingDividendList} />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={s.loaderWrapper}>
            <Loader />
          </div>
        )}
      </div>
    </>
  );
};
