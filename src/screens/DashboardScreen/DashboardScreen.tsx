import { supabaseClient } from "@/config/supabaseClient";
import axios from "axios";
import { useEffect, useState } from "react";
import { Database } from "../../types/supabase";
import { Layout } from "@/components/Layout/Layout";
import { StockService } from "@/services/StockService";
import { ISupaStock } from "@/types/types";
import { TableDivider } from "@/components/TableDivider/TableDivider";
import moment from "moment-timezone";
import { PortfolioService } from "@/services/PortfolioService";
import { ChartSectors } from "@/components/ChartSectors/ChartSectors";

interface IPortfolio {
  active_cost: number | null;
  created_at: string | null;
  free_cash: number | null;
  gain_margin: number | null;
  gain_value: number | null;
  id: string;
  market_cap: number | null;
  title: string | null;
  total_cost: number | null;
  total_return: number | null;
}

export const DashboardScreen = () => {
  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [calendarEarning, setCalendarEarnings] = useState<ISupaStock[]>([]);
  const [sectors, setSectors] = useState<{ sector: string; count: number }[]>(
    []
  );

  useEffect(() => {
    const fetch = async () => {
      const res = await supabaseClient.from("portfolio").select().single();
      if (res.data) {
        setPortfolio(res.data);
      }
    };

    fetch();
    StockService.getCalendarEarnings().then((res) =>
      setCalendarEarnings(res.stocks)
    );
  }, []);

  useEffect(() => {
    PortfolioService.getPortfolio().then((res) => {
      console.log("CALL");
      const arrayTickers = res.portfolio?.map((item) => item.ticker);
      if (arrayTickers) {
        arrayTickers.forEach(async (ticker) => {
          const stockData = await supabaseClient
            .from("stock")
            .select()
            .eq("ticker", ticker)
            .single();

          if (stockData.data) {
            setSectors((prev) => {
              const sector = stockData.data.sector;
              const isExist = prev.find((p) => p.sector === sector);

              if (isExist) {
                const rest = prev.filter((p) => p.sector !== sector);
                return [...rest, { sector, count: isExist.count + 1 }];
              } else {
                return [...prev, { sector, count: 1 }];
              }
            });
          }
        });
      }
    });
  }, []);

  return (
    <div style={{ margin: "1rem" }}>
      <Layout>
        <div
          style={{
            padding: "1rem 0",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
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
          </div>

          <div style={{ display: "flex" }}>
            {calendarEarning.length > 0 && (
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  padding: "1rem",
                  borderRadius: "1rem",
                  width: "500px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Calendar Earnings
                </p>
                <TableDivider />
                {calendarEarning.map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(25,103,210)",
                          backgroundColor: "rgb(232,240,254)",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.6rem",
                        }}
                      >
                        <p>{moment(item.report_date).format("MMM")}.</p>
                        <p>{item.report_date?.split("-")[2]}</p>
                      </div>
                      <div>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ width: "600px" }}>
              <ChartSectors sectors={sectors} />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};
