import { STOCKS } from "@/assets/stock";
import { useUser } from "@/hooks/useUser";
import { PortfolioService } from "@/services/PortfolioService";
import { UserService } from "@/services/UserService";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button/Button";
import { FormError } from "../FormError/FormError";
import { Input } from "../Input/Input";
import { Select } from "../Select/Select";
import { usePortfolios, usePriceCurrent } from "./queries";
import s from "./styles.module.scss";
import { supabaseClient } from "@/config/supabaseClient";
import { useQueryClient } from "react-query";

type Props = {
  ticker?: string;
  price?: number | null | undefined;
  onClose: () => void;
  type: "buy" | "sell";
  portfolioId?: string | undefined;
};

export const FormAddStock: FC<Props> = ({
  ticker,
  onClose,
  type,
  portfolioId,
  price,
}) => {
  const [errorTransaction, setErrorTransaction] = useState("");
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchValue, setSearchValue] = useState(ticker ?? "");
  const [dropdownSelectors, setDropdownSelectors] = useState<
    { ticker: string; name: string }[] | null
  >(null);
  const [isOpenDropdownSelectors, setIsOpenDropdownSelectors] = useState(false);

  const user = useUser();
  const priceCurrent = usePriceCurrent(searchValue);
  const portfolios = usePortfolios(user);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    ticker: z.string().min(1),
    count: z.string().min(1),
    price: z.string().min(1),
    portfolio: z.string().min(1),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    control,
  } = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker,
      count: "1",
      price: price ? price.toFixed(2) : "",
      portfolio: portfolioId,
    },
  });

  useEffect(() => {
    setValue(
      "portfolio",
      portfolios?.find((item) => item.id === portfolioId)?.id ?? ""
    );
  }, []);

  useEffect(() => {
    if (priceCurrent) {
      setValue("price", priceCurrent.toString());
    }
  }, [priceCurrent]);

  useEffect(() => {
    if (searchValue) {
      const result = STOCKS.filter((item) =>
        item.ticker.startsWith(searchValue)
      );
      setDropdownSelectors(result);
    }
  }, [searchValue]);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (user && user.id) {
      if (type === "buy") {
        const balance = await UserService.getBalance(user);
        const purchase =
          Number(data.count) * Number(data.price.replace(",", "."));
        if (balance && balance - purchase >= 0) {
          const response = await PortfolioService.addTransaction(
            data.ticker,
            data.price,
            data.count,
            type,
            moment(selectedDate).format("YYYY-MM-DD"),
            data.portfolio,
            user.id
          );
          if (response.status === 200) {
            onClose();
          }
        } else {
          setErrorTransaction("No enough funds in the account");
        }
      }

      if (type === "sell") {
        const supaStockPortfolio = await supabaseClient
          .from("stock_portfolio")
          .select()
          .eq("ticker", ticker)
          .eq("portfolio_id", portfolioId)
          .single();

        if (supaStockPortfolio.data) {
          if (
            Number(supaStockPortfolio.data.amount_active_shares) >=
            Number(data.count)
          ) {
            const response = await PortfolioService.addTransaction(
              data.ticker,
              data.price,
              data.count,
              type,
              moment(selectedDate).format("YYYY-MM-DD"),
              data.portfolio,
              user.id
            );
            if (response.status === 200) {
              onClose();
              queryClient.invalidateQueries(["stocks"]);
            }
          } else {
            setErrorTransaction(
              `You can sell only ${supaStockPortfolio.data.amount_active_shares} share`
            );
          }
        }
      }
    }
  };

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setErrorTransaction("")}
    >
      <div className={s.form__field__wrapper}>
        <Controller
          control={control}
          name="ticker"
          render={() => (
            <Input
              label="Ticker"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setIsOpenDropdownSelectors(true);
                if (e.target.value.length === 0) {
                  setSearchValue("");
                  setDropdownSelectors(null);
                  setValue("ticker", "");
                } else {
                  setSearchValue(e.target.value.toUpperCase());
                  setValue("ticker", "");
                }
              }}
              value={searchValue}
            />
          )}
        />
        {isOpenDropdownSelectors && dropdownSelectors && (
          <div className={s.dropdownSelectors__wrapper}>
            {dropdownSelectors.map((item, index) => (
              <p
                key={index}
                onClick={() => {
                  setIsOpenDropdownSelectors(false);
                  setValue("ticker", item.ticker);
                  setSearchValue(item.ticker);
                  setDropdownSelectors(null);
                }}
                className={s.dropdownSelectors__item}
              >
                {item.ticker} - {item.name}
              </p>
            ))}
          </div>
        )}
        {errors.ticker && <FormError>{errors.ticker.message}</FormError>}
      </div>

      <div className={s.form__field__wrapper}>
        <Controller
          control={control}
          name="count"
          render={({ field: { onChange } }) => (
            <Input
              label="Count"
              onChange={onChange}
              value={getValues("count")}
            />
          )}
        />
        {errors.count && <FormError>{errors.count.message}</FormError>}
      </div>

      <div className={s.form__field__wrapper}>
        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Price"
              onChange={onChange}
              step={0.01}
              value={value}
            />
          )}
        />
        {errors.price && <FormError>{errors.price.message}</FormError>}
      </div>

      <div className={s.form__field__wrapper}>
        <Input
          label="Date"
          onClick={() => {
            setIsOpenDatePicker(true);
          }}
          value={moment(selectedDate).format("DD.MM.YYYY")}
        />
        {isOpenDatePicker && (
          <DayPicker
            selected={selectedDate}
            onDayClick={(day) => {
              setSelectedDate(day);
              setIsOpenDatePicker(false);
            }}
          />
        )}
      </div>

      <div className={s.form__field__wrapper}>
        <Controller
          control={control}
          name="portfolio"
          render={({ field: { onChange } }) => (
            <Select
              label="Choose Portfolio"
              onChange={onChange}
              data={
                portfolios?.map((item) => ({
                  value: item.id,
                  content: item.title,
                })) ?? null
              }
              value={getValues("portfolio")}
            />
          )}
        />
        {errors.portfolio && <FormError>{errors.portfolio.message}</FormError>}
      </div>

      {errorTransaction && (
        <FormError styles={{ margin: "1rem 0" }}>{errorTransaction}</FormError>
      )}

      {type === "buy" && <Button title="BUY" type="submit" width="150px" />}
      {type === "sell" && <Button title="SELL" type="submit" width="150px" />}
    </form>
  );
};
