import { FC } from "react";

type Props = {
  onChange: (props?: any) => void;
  data: string[];
  label?: string;
  defaultValue?: string | null;
  value?: string | null;
};

export const Select: FC<Props> = ({
  data,
  onChange,
  label,
  defaultValue,
  value,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <fieldset>
        {label && <label>{label}</label>}
        <select
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
            display: "block",
            width: "100%",
          }}
          onChange={onChange}
          value={value ?? "-- --"}
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
  );
};
