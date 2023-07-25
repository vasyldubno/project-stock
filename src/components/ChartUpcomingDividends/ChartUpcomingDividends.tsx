import { PortfolioService } from "@/services/PortfolioService";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { FC, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(Legend, Tooltip, BarElement, CategoryScale, LinearScale);

export const ChartUpcomingDividends: FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [data, setData] = useState<(string | null)[]>();
  const [labels, setLabels] = useState<(string | null)[]>();

  useEffect(() => {
    // PortfolioService.getDividendIncomeInMonth(new Date().getUTCFullYear()).then(
    //   (res) => {
    //     setMonths(Object.keys(res));
    //     setData(Object.values(res));
    //   }
    // );

    PortfolioService.getUpcomingDividends().then((res) => {
      console.log(res);
      // console.log(res);
      if (res) {
        const data = res.map((item) => item.value.toFixed(2));
        setData(data);
        const labels = res.map((item) => item.month);
        setLabels(labels);
      }
    });
  }, []);

  // console.log(data);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: "rgb(91, 155, 213)",
          },
        ],
      }}
      options={{
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 1,
            titleColor: "black",
            bodyColor: "black",
            padding: 10,
            yAlign: "bottom",
            displayColors: false,
          },
        },

        scales: {
          x: {
            grid: {
              display: false,
            },
            border: { display: false },
          },
          y: {
            grid: {
              display: true,
            },
            border: { display: false },
          },
        },
      }}
    />
  );
};
