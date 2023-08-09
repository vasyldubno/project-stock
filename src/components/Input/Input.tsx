import { FC, HTMLInputTypeAttribute, ReactNode } from "react";
import s from "./Input.module.scss";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormError } from "../FormError/FormError";
import { ClearIcon } from "@/icons/ClearIcon";

type InputProps = {
  label?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: any;
  onFocus?: any;
  onBlur?: any;
  value?: string;
  defaultValue?: string;
  icon?: {
    delete: {
      element: ReactNode;
      open: boolean;
      onClick: (props?: any) => void;
    };
  };
};

export const Input: FC<InputProps> = ({
  label,
  name,
  type,
  onChange,
  onBlur,
  onFocus,
  value,
  defaultValue,
  icon,
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
          value={value}
          defaultValue={defaultValue}
        />
        {icon?.delete.open && (
          <div className={s.icon__clear} onClick={icon.delete.onClick}>
            {/* <ClearIcon size="1.2rem" /> */}
            {icon.delete.element}
          </div>
        )}
      </div>
    </div>
  );
};
