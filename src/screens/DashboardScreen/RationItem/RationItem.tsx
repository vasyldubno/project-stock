import { CSSProperties, FC, PropsWithChildren } from "react";
import s from "./styles.module.scss";

type Props = {
  styles?: CSSProperties;
};

export const RationItem: FC<PropsWithChildren & Props> = ({
  children,
  styles,
}) => {
  return (
    <div className={s.item} style={styles}>
      {children}
    </div>
  );
};
