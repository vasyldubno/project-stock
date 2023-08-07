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

const data: {
  label: string;
  select:
    | "peExpression"
    | "roeExpression"
    | "deExpression"
    | "priceGrowthExpression"
    | "marginSafetyExpression"
    | "analystExpression"
    | "payoutRatioExpression"
    | "dividendYieldExpression";
  input:
    | "pe"
    | "roe"
    | "de"
    | "priceGrowth"
    | "marginSafety"
    | "analyst"
    | "payoutRatio"
    | "dividendYield";
}[] = [
  { label: "PE", select: "peExpression", input: "pe" },
  { label: "ROE", select: "roeExpression", input: "roe" },
  { label: "Debt/Equity", select: "deExpression", input: "de" },
  {
    label: "Price Growth",
    select: "priceGrowthExpression",
    input: "priceGrowth",
  },
  {
    label: "Margin of Safety",
    select: "marginSafetyExpression",
    input: "marginSafety",
  },
  {
    label: "Analyst Rating Buy",
    select: "analystExpression",
    input: "analyst",
  },
  {
    input: "payoutRatio",
    label: "Payout Ratio",
    select: "payoutRatioExpression",
  },
  {
    input: "dividendYield",
    label: "Dividend Yield",
    select: "dividendYieldExpression",
  },
];

type Props = {
  afterSubmit: () => void;
};

export const AddNewScreener: FC<Props> = ({ afterSubmit }) => {
  const user = useUser();

  const formSchema = z.object({
    title: z.string().min(1),
    peExpression: z.enum(["less", "greater"]),
    roeExpression: z.enum(["less", "greater"]),
    deExpression: z.enum(["less", "greater"]),
    priceGrowthExpression: z.enum(["less", "greater"]),
    marginSafetyExpression: z.enum(["less", "greater"]),
    analystExpression: z.enum(["less", "greater"]),
    payoutRatioExpression: z.enum(["less", "greater"]),
    dividendYieldExpression: z.enum(["less", "greater"]),
    pe: z.string().optional(),
    roe: z.string().optional(),
    de: z.string().optional(),
    priceGrowth: z.string().optional(),
    marginSafety: z.string().optional(),
    analyst: z.string().optional(),
    payoutRatio: z.string().optional(),
    dividendYield: z.string().optional(),
    sector: z.string().optional(),
    industry: z.string().optional(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
  } = useForm<FormSchema>({
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
    <form
      style={{
        width: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onSubmit={handleSubmit(onSumbit)}
    >
      <p
        style={{
          paddingBottom: "2rem",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        New Screener
      </p>
      <div style={{ marginBottom: "1rem", width: "100%" }}>
        <Controller
          name="title"
          control={control}
          render={({ field: { onChange } }) => (
            <>
              <Input
                label="Screener name"
                name="Screener name"
                onChange={onChange}
              />
            </>
          )}
        />
      </div>

      <div style={{ width: "100%" }}>
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

      <div style={{ width: "100%" }}>
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
          <div
            style={{
              marginBottom: "1rem",
              width: "100%",
              display: "flex",
              gap: "1rem",
            }}
          >
            <Controller
              control={control}
              name={item.input}
              render={({ field: { onChange } }) => (
                <Input type="number" onChange={onChange} />
              )}
            />

            <Controller
              control={control}
              name={item.select}
              render={({ field: { onChange } }) => (
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
                >
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
