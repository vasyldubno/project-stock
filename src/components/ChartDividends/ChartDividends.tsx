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

type Props = {
  data: { amount: number; monthName: string }[];
};

export const ChartDividends: FC<Props> = ({ data }) => {
  return (
    <Bar
      data={{
        labels: data.map((item) => item.monthName),
        datasets: [
          {
            data: data.map((item) => item.amount),
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
