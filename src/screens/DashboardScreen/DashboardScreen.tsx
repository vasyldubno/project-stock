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
import { CalendarEarnings } from "@/components/CalendarEarnings/CalendarEarnings";
import { ChartDividends } from "@/components/ChartDividends/ChartDividends";
import { ChartUpcomingDividends } from "@/components/ChartUpcomingDividends/ChartUpcomingDividends";

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
            <CalendarEarnings calendarEarning={calendarEarning} />
            <div
              style={{
                width: "600px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "0 0 0 1rem",
              }}
            >
              <div>
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
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  Dividends
                </p>
                <ChartDividends />
              </div>
              <div>
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
      </Layout>
    </div>
  );
};
