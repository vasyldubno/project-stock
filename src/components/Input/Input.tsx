import { FC, HTMLInputTypeAttribute } from "react";
import s from "./Input.module.scss";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormError } from "../FormError/FormError";

type InputProps = {
  label?: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: any;
  onFocus?: any;
  onBlur?: any;
  value?: string;
  defaultValue?: string;
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
}) => {
  return (
    <div style={{ display: "block", width: "100%" }}>
      <label>{label}</label>
      <input
        className={s.input}
        type={type ?? "text"}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
        defaultValue={defaultValue}
      />
    </div>
  );
};
