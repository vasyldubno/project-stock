import { ISupaStock } from "@/types/types";
import { FC } from "react";
import { TableDivider } from "../TableDivider/TableDivider";
import moment from "moment";
import s from "./styles.module.scss";
import Link from "next/link";

type CalendarEarningsProps = {
  calendarEarning: ISupaStock[];
};

export const CalendarEarnings: FC<CalendarEarningsProps> = ({
  calendarEarning,
}) => {
  return (
    <>
      {
        <div className={s.wrapper}>
          <p className={s.title}>Calendar Earnings</p>
          <TableDivider />
          {calendarEarning.length > 0 ? (
            calendarEarning.map((item, index) => {
              return (
                <div key={index} className={s.content}>
                  <div className={s.contentDate}>
                    <p>{moment(item.report_date).format("MMM")}.</p>
                    <p>{item.report_date?.split("-")[2]}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <p>{item.name}</p>
                    <p>||</p>
                    <Link
                      href={`/stock/${item.ticker}`}
                      className={s.item__ticker}
                    >
                      {item.ticker}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>
              There are no events in the next 7 days.
            </p>
          )}
        </div>
      }
    </>
  );
};
