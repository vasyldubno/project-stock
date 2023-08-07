import { ISupaScreener } from "@/types/types";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { Select } from "../Select/Select";
import { STOCKS } from "@/assets/stock";
import { Input } from "../Input/Input";
import s from "./styles.module.scss";

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

  if (screener) {
    console.log(screener.pe ?? "");
  }

  return (
    <>
      {screener && (
        <div className={s.grid__container}>
          <div className={s.grid__item}>
            <Select
              data={Array.from(new Set(STOCKS.map((item) => item.sector)))}
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
              }}
              label="Sector"
              value={screener.sector}
            />
          </div>
          <div className={s.grid__item}>
            <Select
              data={
                selectedSector
                  ? Array.from(
                      new Set(
                        STOCKS.filter((item) => item.sector === selectedSector)
                          .map((item) => item.subIndustry)
                          .sort()
                      )
                    )
                  : Array.from(new Set(STOCKS.map((item) => item.subIndustry)))
              }
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedIndustry(e.target.value);
                setSelectedScreener((prev) => {
                  if (prev) {
                    return { ...prev, industry: e.target.value };
                  }
                  return null;
                });
              }}
              label="Industry"
              value={screener.industry}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.roe ?? ""}
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
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.pe ?? ""}
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
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.de ?? ""}
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
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.payout_ratio ?? ""}
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
              }}
            />
          </div>
          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.dividend_yield ?? ""}
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
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.analyst ?? ""}
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
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.margin_safety ?? ""}
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
              }}
            />
          </div>

          <div className={s.grid__item}>
            <Input
              // defaultValue={screener.priceGrowth ?? ""}
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
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
