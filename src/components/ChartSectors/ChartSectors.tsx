import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Legend, Tooltip);

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

type Props = {
  data:
    | {
        sector: string;
        count: number;
      }[]
    | null;
};

export const ChartSectors: FC<Props> = ({ data }) => {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const a = data.map(() => getRandomColor());
      setColors(a);
    }
  }, [data]);

  return (
    <>
      {data && (
        <Doughnut
          data={{
            datasets: [
              {
                data: data.map((item) => item.count),
                hoverBorderWidth: 0,
                backgroundColor: colors,
              },
            ],
            labels: data.map((item) => item.sector),
          }}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label(tooltipItem) {
                    return `${(
                      (Number(tooltipItem.formattedValue) /
                        data.reduce((acc, item) => acc + item.count, 0)) *
                      100
                    ).toFixed(2)}%`;
                  },
                },
              },
            },
          }}
        />
      )}
    </>
  );
};
