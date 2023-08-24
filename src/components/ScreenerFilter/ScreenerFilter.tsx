import { ISupaScreener } from "@/types/types";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Select } from "../Select/Select";
import { STOCKS } from "@/assets/stock";
import { Input } from "../Input/Input";
import s from "./styles.module.scss";
import { ClearIcon } from "@/icons/ClearIcon";
import { useUpdateScreener } from "./queries";
import { MutationKey, useMutation, useQueryClient } from "react-query";
import { supabaseClient } from "@/config/supabaseClient";

type Props = {
  screener: ISupaScreener | null;
  setSelectedScreener: Dispatch<SetStateAction<ISupaScreener | null>>;
};

export const ScreenerFilter: FC<Props> = ({
  screener,
  setSelectedScreener,
}) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  useEffect(() => {
    if (screener && screener.sector) {
      setSelectedSector(screener.sector);
    }
    if (screener && screener.industry) {
      setSelectedIndustry(screener.industry);
    }
  }, [screener]);

  const updateScreener = useUpdateScreener();

  function getUniqueItemArray<T, K extends keyof T>(
    arr: T[],
    key: K,
    sector?: string
  ) {
    console.log(sector);
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

  return (
    <>
      {screener && (
        <div className={s.grid__container}>
          <div className={s.grid__item}>
            <Select
              data={getUniqueItemArray(STOCKS, "sector").map((item) => ({
                content: item.sector,
                value: item.sector,
              }))}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedSector(e.target.value);
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      sector: e.target.value,
                      industry: selectedIndustry && null,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "sector",
                  value: e.target.value,
                  screener,
                });
              }}
              label="Sector"
              value={screener.sector ?? ""}
            />
          </div>

          <div className={s.grid__item}>
            <Select
              data={
                selectedSector
                  ? getUniqueItemArray(
                      STOCKS,
                      "subIndustry",
                      selectedSector
                    ).map((item) => ({
                      content: item.subIndustry,
                      value: item.subIndustry,
                    }))
                  : getUniqueItemArray(STOCKS, "subIndustry").map((item) => ({
                      content: item.subIndustry,
                      value: item.subIndustry,
                    }))
              }
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedIndustry(e.target.value);
                setSelectedScreener((prev) => {
                  if (prev) {
                    return { ...prev, industry: e.target.value };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "industry",
                  value: e.target.value,
                  screener,
                });
              }}
              label="Industry"
              value={screener.industry ?? ""}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              value={screener.roe ?? ""}
              label="ROE"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      roe: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "roe",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          roe: "",
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.roe,
                },
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              value={screener.pe ?? ""}
              label="P/E"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      pe: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "pe",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          pe: "",
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.pe,
                },
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              value={screener.de ?? ""}
              label="D/E"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      de: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "de",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          de: "",
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.de,
                },
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              value={screener.payout_ratio ?? ""}
              label="Payout Ratio"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      payout_ratio: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "payout_ratio",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          payout_ratio: e.target.value,
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.payout_ratio,
                },
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              value={screener.dividend_yield ?? ""}
              label="Dividend Yield"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      dividend_yield: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "dividend_yield",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          dividend_yield: e.target.value,
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.dividend_yield,
                },
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              value={screener.analyst ?? ""}
              label="Analyst Rating to Buy"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      analyst: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "analyst",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          analyst: e.target.value,
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.analyst,
                },
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              value={screener.margin_safety ?? ""}
              label="Instrinic Margin"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      margin_safety: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "margin_safety",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          margin_safety: e.target.value,
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.margin_safety,
                },
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              value={screener.priceGrowth ?? ""}
              label="Price Growth"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSelectedScreener((prev) => {
                  if (prev) {
                    return {
                      ...prev,
                      priceGrowth: e.target.value,
                    };
                  }
                  return null;
                });
                updateScreener.mutate({
                  field: "priceGrowth",
                  value: e.target.value,
                  screener,
                });
              }}
              icon={{
                delete: {
                  element: <ClearIcon size="1.2rem" />,
                  onClick: (e: ChangeEvent<HTMLInputElement>) => {
                    setSelectedScreener((prev) => {
                      if (prev) {
                        return {
                          ...prev,
                          priceGrowth: e.target.value,
                        };
                      }
                      return null;
                    });
                  },
                  open: !!screener?.priceGrowth,
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
