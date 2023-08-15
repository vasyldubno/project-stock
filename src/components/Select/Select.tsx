import { FC } from "react";
import s from "./styles.module.scss";

type Props = {
  onChange: (props?: any) => void;
  data: string[] | null;
  label?: string;
  defaultValue?: string;
  value?: string | number;
};

export const Select: FC<Props> = ({
  data,
  onChange,
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
              value={value}
              defaultValue={defaultValue}
            >
              <option value={""}>-- --</option>
              {data.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </fieldset>
        </div>
      )}
    </>
  );
};
