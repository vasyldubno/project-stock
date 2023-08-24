import { FC, ReactNode } from "react";
import s from "./Button.module.scss";

interface ButtonProps {
  backgroundColor?: string;
  color?: string;
  title: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  width?: string;
  disabled?: boolean;
  rightIcon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  onClick,
  title,
  backgroundColor,
  color,
  type,
  width,
  disabled = false,
  rightIcon,
}) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        backgroundColor,
        color,
        width: "100%",
        maxWidth: width,
      }}
      className={s.button}
      type={type}
    >
      {title}
      {rightIcon}
    </button>
  );
};
