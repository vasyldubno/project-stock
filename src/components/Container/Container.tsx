import { CSSProperties, FC, PropsWithChildren } from "react";

type Props = {
  styles?: CSSProperties;
};

export const Container: FC<PropsWithChildren & Props> = ({
  styles,
  children,
}) => {
  return <div style={{ margin: "1rem", ...styles }}>{children}</div>;
};
