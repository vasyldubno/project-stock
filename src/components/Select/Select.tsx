import { FC } from "react";
import s from "./styles.module.scss";

type Props = {
  onChange: (props?: any) => void;
  onFocus?: (props?: any) => void;
  data: { value: string | number; content: string | number }[] | null;
  label?: string;
  defaultValue?: string;
  value?: string | number;
};

export const Select: FC<Props> = ({
  data,
  onChange,
  onFocus,
  label,
  defaultValue,
  value,
}) => {
  return (
    <>
      {data && (
        <div className={s.wrapper}>
          <fieldset>
            {label && <label>{label}</label>}
            <select
              className={s.select}
              onChange={onChange}
              onFocus={onFocus}
              value={value}
              defaultValue={defaultValue}
            >
              <option value={""}>-- --</option>
              {data.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.content}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
      )}
    </>
  );
};
