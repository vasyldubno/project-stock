import { z } from "zod";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScreenerService } from "@/services/ScreenerService";
import { useUser } from "@/hooks/useUser";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Select } from "../Select/Select";
import { STOCKS } from "@/assets/stock";
import { data } from "./assets";
import { FormSchema, formSchema } from "./form";
import s from "./styles.module.scss";

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

  const sectors = Array.from(new Set(STOCKS.map((item) => item.sector)));
  const [industries, setIndustries] = useState(
    Array.from(new Set(STOCKS.map((item) => item.subIndustry).sort()))
  );
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSector) {
      setIndustries(
        Array.from(
          new Set(
            STOCKS.filter((item) => item.sector === selectedSector)
              .map((item) => item.subIndustry)
              .sort()
          )
        )
      );
    }
  }, [selectedSector]);

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
                  setSelectedSector(getValues("sector") ?? null);
                  const selectedIndustry = getValues("industry");
                  if (selectedIndustry) {
                    setValue("industry", undefined);
                  }
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
