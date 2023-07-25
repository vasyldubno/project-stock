import { PortfolioService } from "@/services/PortfolioService";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";

ChartJS.register(ArcElement, Legend, Tooltip);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const ChartSectors: FC = () => {
  const [colors, setColors] = useState<string[]>([]);
  const [sectors, setSectors] = useState<{ sector: string; count: number }[]>(
    []
  );

  useEffect(() => {
    PortfolioService.getPortfolioSectors().then((res) => setSectors(res));
  }, []);

  useEffect(() => {
    const a = sectors.map(() => getRandomColor());
    setColors(a);
  }, [sectors]);
  return (
    <Doughnut
      data={{
        datasets: [
          {
            data: sectors.map((sector) => sector.count),
            hoverBorderWidth: 0,
            backgroundColor: colors,
          },
        ],
        labels: sectors.map((sector) => sector.sector),
      }}
      options={{
        plugins: {
          tooltip: {
            callbacks: {
              label(tooltipItem) {
                return `${(
                  (Number(tooltipItem.formattedValue) /
                    sectors.reduce((acc, item) => acc + item.count, 0)) *
                  100
                ).toFixed(2)}%`;
              },
            },
          },
        },
      }}
    />
  );
};
