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

export const ChartDividends: FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    PortfolioService.getDividendIncomeInMonth(new Date().getUTCFullYear()).then(
      (res) => {
        setMonths(Object.keys(res));
        setData(Object.values(res));
      }
    );
  }, []);

  return (
    <Bar
      data={{
        labels: months,
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
            callbacks: {
              // @ts-ignore
              title: () => null,
              label: (context) => {
                let label = context.parsed.y || "";
                if (label !== "") {
                  label = "$" + label;
                }
                return label;
              },
            },
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
