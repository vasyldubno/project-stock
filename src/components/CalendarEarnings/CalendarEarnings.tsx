import { ISupaStock } from "@/types/types";
import { FC } from "react";
import { TableDivider } from "../TableDivider/TableDivider";
import moment from "moment";

type CalendarEarningsProps = {
  calendarEarning: ISupaStock[];
};

export const CalendarEarnings: FC<CalendarEarningsProps> = ({
  calendarEarning,
}) => {
  return (
    <>
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
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <p>{item.name}</p>
                  <p>||</p>
                  <p>{item.ticker}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
