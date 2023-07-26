import { IPortfolioStock } from "@/types/types";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { FC } from "react";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TreemapController,
  TreemapElement
);

// @ts-ignore
Tooltip.positioners.custom = function (el, event) {
  return { x: event.x, y: event.y };
};

type ChartMapStocksProps = { data: IPortfolioStock[] | null };

export const ChartMapStocks: FC<ChartMapStocksProps> = ({ data }) => {
  return (
    <>
      {data && (
        <div
          style={{
            // margin: "1rem",
            width: "100%",
            height: "100%",
          }}
        >
          <Chart
            data={{
              datasets: [
                {
                  key: "perc_of_portfolio",
                  labels: {
                    display: true,
                    formatter(ctx) {
                      return `${data[ctx.dataIndex].ticker}`;
                    },
                    // @ts-ignore
                    font: { size: 10 },
                  },
                  data,
                  backgroundColor(ctx, options) {
                    return `${
                      data[ctx.dataIndex].gain_unrealized_percentage &&
                      Number(data[ctx.dataIndex].gain_unrealized_percentage) > 0
                        ? "#8CCA72"
                        : "#F86051"
                    }`;
                  },
                  borderWidth: 1,
                  borderColor: "transparent",
                  // @ts-ignore
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                tooltip: {
                  // @ts-ignore
                  position: "custom",
                  displayColors: false,
                  backgroundColor: "white",
                  borderColor: "black",
                  // @ts-ignore
                  borderWidth: "1px",
                  titleColor: "black",
                  bodyColor: "black",
                  // @ts-ignore
                  yAlign: "bottom",
                  callbacks: {
                    // @ts-ignore
                    title(item) {
                      return null;
                    },
                    label(item) {
                      // @ts-ignore
                      return [
                        `% of Portfolio: ${data[
                          item.dataIndex
                        ].perc_of_portfolio?.toFixed(2)}%`,
                        `Gain: ${data[
                          item.dataIndex
                        ].gain_unrealized_percentage?.toFixed(2)}%`,
                      ];
                    },
                  },
                },
                legend: { display: false },
              },
            }}
            type="treemap"
          />
        </div>
      )}
    </>
  );
};
