import { TableCardPrice } from "@/components/TableCardPrice/TableCardPrice";
import { ISupaExit } from "@/types/types";
import { FC } from "react";
import s from "./styles.module.scss";
import { TableDivider } from "@/components/TableDivider/TableDivider";
import moment from "moment";

type Props = {
  exit: ISupaExit;
};

export const Item: FC<Props> = ({ exit }) => {
  return (
    <div className={s.container}>
      <div key={exit.id} className={s.wrapper}>
        <p className={s.item}>{exit.ticker}</p>
        <p className={s.item}>{exit.average_price_per_share}</p>
        <p className={s.item}>
          {moment(exit.finish_date).format("DD.MM.YYYY")}
        </p>
        <div className={s.item}>
          <TableCardPrice content={exit.profit_margin} />
        </div>
      </div>
      <div className={s.divider}>
        <TableDivider />
      </div>
    </div>
  );
};
