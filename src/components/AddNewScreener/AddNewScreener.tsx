import { STOCKS } from "@/assets/stock";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { data } from "./assets";
import { FormSchema, formSchema } from "./form";
import s from "./styles.module.scss";
import { ScreenerService } from "@/services/ScreenerService";

type Props = {
  afterSubmit: () => void;
};

export const AddNewScreener: FC<Props> = ({ afterSubmit }) => {
  const user = useUser();

  const { handleSubmit, control, getValues, setValue } = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      peExpression: "less",
      analystExpression: "less",
      deExpression: "less",
      marginSafetyExpression: "less",
      priceGrowthExpression: "less",
      roeExpression: "less",
      dividendYieldExpression: "less",
      payoutRatioExpression: "less",
    },
  });

  const onSumbit: SubmitHandler<FormSchema> = async (data) => {
    if (user) {
      const response = await ScreenerService.addScreener({
        title: data.title,
        user: user,
        analyst:
          data.analyst &&
          `${data.analystExpression === "less" ? "<" : ">"}${data.analyst}`,
        de: data.de && `${data.deExpression === "less" ? "<" : ">"}${data.de}`,
        marginSafety:
          data.marginSafety &&
          `${data.marginSafetyExpression === "less" ? "<" : ">"}${
            data.marginSafety
          }`,
        pe: data.pe && `${data.peExpression === "less" ? "<" : ">"}${data.pe}`,
        priceGrowth:
          data.priceGrowth &&
          `${data.priceGrowthExpression === "less" ? "<" : ">"}${
            data.priceGrowth
          }`,
        roe:
          data.roe && `${data.roeExpression === "less" ? "<" : ">"}${data.roe}`,
        dividendYield:
          data.dividendYield &&
          `${data.dividendYieldExpression === "less" ? "<" : ">"}${
            data.dividendYield
          }`,
        payoutRatio:
          data.payoutRatio &&
          `${data.payoutRatioExpression === "less" ? "<" : ">"}${
            data.payoutRatio
          }`,
        sector: data.sector,
        industry: data.industry,
      });
      if (response && response.status === 201) {
        afterSubmit();
      }
    }
  };

  const [industries, setIndustries] = useState<
    | {
        content: string;
        value: string;
      }[]
  >([]);

  function getUniqueItemArray<T, K extends keyof T>(
    arr: T[],
    key: K,
    sector?: string
  ) {
    const uniqueValues: Record<string, boolean> = {};
    const resultArr: T[] = [];

    const filteredArr = sector
      ? arr.filter((obj) => (obj as any)["sector"] === sector)
      : arr;

    for (const obj of filteredArr) {
      const value = obj[key] as unknown as string;
      if (!uniqueValues[value]) {
        uniqueValues[value] = true;
        resultArr.push(obj);
      }
    }

    return resultArr.sort((a, b) =>
      (a[key] as any).localeCompare(b[key] as any)
    );
  }

  const sectors = getUniqueItemArray(STOCKS, "sector").map((item) => ({
    content: item.sector,
    value: item.sector,
  }));

  return (
    <form className={s.form} onSubmit={handleSubmit(onSumbit)}>
      <p className={s.title}>New Screener</p>
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Screener name"
              name="Screener name"
              onChange={onChange}
              value={value}
            />
          )}
        />
      </div>

      <div className={s.fieldWrapper}>
        <Controller
          name="sector"
          control={control}
          render={({ field: { onChange } }) => (
            <>
              <Select
                data={sectors}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  onChange(e);
                  setValue("industry", "");
                  setIndustries(
                    getUniqueItemArray(
                      STOCKS,
                      "subIndustry",
                      getValues("sector")
                    ).map((item) => ({
                      content: item.subIndustry,
                      value: item.subIndustry,
                    }))
                  );
                }}
                label="Sector"
                value={getValues("sector")}
              />
            </>
          )}
        />
      </div>

      <div className={s.fieldWrapper}>
        <Controller
          name="industry"
          control={control}
          render={({ field: { onChange } }) => (
            <>
              <Select
                data={industries}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  onChange(e);
                }}
                label="Industry"
                value={getValues("industry")}
              />
            </>
          )}
        />
      </div>

      {data.map((item, index) => (
        <div style={{ width: "100%" }} key={index}>
          <p>{item.label}</p>
          <div className={s.fieldWrapper}>
            <Controller
              control={control}
              name={item.input}
              render={({ field: { onChange, value } }) => (
                <Input type="number" onChange={onChange} value={value} />
              )}
            />

            <Controller
              control={control}
              name={item.select}
              render={({ field: { onChange } }) => (
                <select className={s.fieldSelect} onChange={onChange}>
                  <option value={"less"}>less than (&lt;)</option>
                  <option value={"greater"}>greater than (&gt;)</option>
                </select>
              )}
            />
          </div>
        </div>
      ))}

      <Button title="+ Add New Portfolio" type="submit" width="200px" />
    </form>
  );
};
