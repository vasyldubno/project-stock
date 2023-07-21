import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { Doughnut, Pie, PolarArea } from "react-chartjs-2";

ChartJS.register(ArcElement, Legend, Tooltip);

interface ChartSectorsProps {
  sectors: { sector: string; count: number }[];
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const ChartSectors: FC<ChartSectorsProps> = ({ sectors }) => {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const a = sectors.map((sector) => getRandomColor());
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
      options={{}}
    />
  );
};
