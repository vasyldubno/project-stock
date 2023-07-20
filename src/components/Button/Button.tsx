import { FC } from "react";
import s from "./Button.module.scss";

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  title: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  backgroundColor,
  color,
  type,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        color,
      }}
      className={s.button}
      type={type}
    >
      {title}
    </button>
  );
};

// Button.defaultProps = { color: "#fff", backgroundColor: "#827878" };
