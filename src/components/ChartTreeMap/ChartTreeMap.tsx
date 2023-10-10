import { ISupaStockPortfolio } from "@/types/types";
import { FC, useEffect, useState } from "react";
import { Tooltip, Treemap } from "recharts";
import { Button } from "../Button/Button";

const CustomizedContent = (props: any) => {
  const { depth, x, y, width, height, change, changeToday, ticker, type } =
    props;

  const [data, setData] = useState<any>();

  useEffect(() => {
    console.log("useEffect");
    if (type === "last_day") {
      setData(changeToday);
    }

    if (type === "overall") {
      setData(change);
    }
  }, [type]);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: data < 0 ? "red" : "green",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      <text x={x + 4} y={y + 18} fill="#fff" fontSize={12} fillOpacity={0.9}>
        {ticker}
      </text>
    </g>
  );
};

const renderTooltip = (props: any) => {
  const { active, payload } = props;

  if (active && payload && payload[0]) {
    const item = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "0.2rem",
          borderRadius: "0.4rem",
        }}
      >
        <p>Ticker: {item.ticker}</p>
        <p>Change today: {item.changeToday}%</p>
        <p>Change overall: {item.change}%</p>
      </div>
    );
  }

  return null;
};

type Props = {
  data: ISupaStockPortfolio[] | null;
  width: number;
};

export const ChartTreeMap: FC<Props> = ({ data, width }) => {
  const [type, setType] = useState<"last_day" | "overall">("last_day");

  return (
    <>
      {data && (
        <>
          <div
            style={{ display: "flex", gap: "1rem", margin: "0 0 1rem 1rem" }}
          >
            <Button title="Last Day" onClick={() => setType("last_day")} />
            <Button title="Overall" onClick={() => setType("overall")} />
          </div>
          <Treemap
            width={width}
            height={width * 0.6}
            data={data.map((item) => ({
              name: item.ticker,
              children: [
                {
                  ticker: item.ticker,
                  size:
                    Number(item.average_cost_per_share) *
                    Number(item.amount_active_shares),
                  changeToday: item.price_growth_todat_perc,
                  change: item.gain_margin?.toFixed(2),
                },
              ],
            }))}
            dataKey="size"
            stroke="#fff"
            fill="red"
            content={<CustomizedContent type={type} />}
          >
            <Tooltip content={renderTooltip} />
          </Treemap>
        </>
      )}
    </>
  );
};
