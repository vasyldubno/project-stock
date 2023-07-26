import { CSSProperties, FC, PropsWithChildren } from "react";

type FormErrorProps = {
  styles?: CSSProperties;
};

export const FormError: FC<PropsWithChildren & FormErrorProps> = ({
  children,
  styles,
}) => {
  return (
    <p style={{ color: "red", fontSize: "0.7rem", ...styles }}>{children}</p>
  );
};
