import { STOCKS } from "@/assets/stock";
import { useUser } from "@/hooks/useUser";
import { PortfolioService } from "@/services/PortfolioService";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button/Button";
import { FormError } from "../FormError/FormError";
import s from "./styles.module.scss";
import { ISupaPortfolio } from "@/types/types";

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
  const [errorTransaction, setErrorTransaction] = useState(false);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [dropdownSelectors, setDropdownSelectors] = useState<
    { ticker: string; name: string }[] | null
  >(null);
  const [portfolios, setPortfolios] = useState<ISupaPortfolio[] | null>(null);

  const user = useUser();

  const formSchema = z.object({
    ticker: z.string().min(1),
    count: z.string().min(1),
    price: z.string().min(1),
    portfolio: z.string().min(1),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
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
    if (user) {
      PortfolioService.getPortfolios(user.id).then((res) => {
        if (res) {
          setPortfolios(res.data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (searchValue) {
      const result = STOCKS.filter((item) =>
        item.ticker.startsWith(searchValue)
      );
      setDropdownSelectors(result);
    }
  }, [searchValue]);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (user) {
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
    }
  };

  return (
    <form
      style={{
        width: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setErrorTransaction(false)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <label htmlFor="ticker">Ticker</label>
        <input
          id="ticker"
          type="text"
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
          }}
          {...register("ticker")}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setSearchValue("");
              setDropdownSelectors(null);
            } else {
              setSearchValue(e.target.value.toUpperCase());
            }
          }}
        />
        {dropdownSelectors && (
          <div className={s.dropdownSelectors__wrapper}>
            {dropdownSelectors.map((item, index) => (
              <p
                key={index}
                onClick={() => {
                  setValue("ticker", item.ticker);
                  setSearchValue("");
                  setDropdownSelectors(null);
                }}
                className={s.dropdownSelectors__item}
              >
                {item.ticker} - {item.name}
              </p>
            ))}
          </div>
        )}
        {errors.ticker && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            {errors.ticker.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <label htmlFor="count">Count</label>
        <input
          {...register("count")}
          id="count"
          type="number"
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
          }}
        />
        {errors.count && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            {errors.count.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <label htmlFor="price">Price</label>
        <input
          {...register("price")}
          id="price"
          type="number"
          step={0.01}
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
          }}
        />
        {errors.price && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            {errors.price.message}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="text"
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
          }}
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "1rem",
          width: "100%",
        }}
      >
        <label htmlFor="price">Choose Portfolio</label>
        <select
          {...register("portfolio")}
          style={{
            border: "1px solid var(--color-gray)",
            borderRadius: "0.3rem",
            padding: "0.4rem",
            outline: "transparent",
          }}
        >
          {portfolios &&
            portfolios.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
        </select>
        {errors.portfolio && (
          <p style={{ color: "red", fontSize: "0.7rem" }}>
            {errors.portfolio.message}
          </p>
        )}
      </div>

      {errorTransaction && (
        <FormError styles={{ margin: "1rem 0" }}>
          No enough funds in the account
        </FormError>
      )}

      {type === "buy" && <Button title="BUY" type="submit" width="150px" />}
      {type === "sell" && <Button title="SELL" type="submit" width="150px" />}
    </form>
  );
};
