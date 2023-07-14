import { FC } from "react";
import s from "./Button.module.scss";

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  title: string;
  onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  backgroundColor,
  color,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        color,
      }}
      className={s.button}
    >
      {title}
    </button>
  );
};

// Button.defaultProps = { color: "#fff", backgroundColor: "#827878" };
