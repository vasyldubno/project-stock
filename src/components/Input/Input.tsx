import { FC, HTMLInputTypeAttribute, ReactNode } from "react";
import s from "./Input.module.scss";

type InputProps = {
  label?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: any) => void;
  onFocus?: any;
  onBlur?: any;
  onClick?: (props?: any) => void;
  value?: string | number | null;
  defaultValue?: string;
  icon?: {
    delete: {
      element: ReactNode;
      open: boolean;
      onClick: (props?: any) => void;
    };
  };
  step?: number;
  placeholder?: string;
};

export const Input: FC<InputProps> = ({
  label,
  name,
  type,
  onChange,
  onBlur,
  onFocus,
  onClick,
  value,
  defaultValue,
  icon,
  step,
  placeholder,
}) => {
  return (
    <div style={{ display: "block", width: "100%" }}>
      <label>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          className={s.input}
          type={type ?? "text"}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value ?? ""}
          defaultValue={defaultValue}
          step={step}
          onClick={onClick}
          placeholder={placeholder}
        />
        {icon?.delete.open && (
          <div className={s.icon__clear} onClick={icon.delete.onClick}>
            {icon.delete.element}
          </div>
        )}
      </div>
    </div>
  );
};
