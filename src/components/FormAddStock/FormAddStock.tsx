import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortfolioService } from "@/services/PortfolioService";
import { Button } from "../Button/Button";
import { IPortfolioStock, ISupaStock } from "@/types/types";
import { UserService } from "@/services/UserService";
import { useState } from "react";
import { FormError } from "../FormError/FormError";

type Stock = IPortfolioStock | ISupaStock;

export const FormAddStock = ({
  stock,
  onClose,
  type,
}: {
  stock: Stock | null;
  onClose: () => void;
  type: "buy" | "sell";
}) => {
  const [errorTransaction, setErrorTransaction] = useState(false);

  const formSchema = z.object({
    count: z
      .string()
      .min(1)
      .transform((value) => Number(value)),
    price: z
      .string()
      .min(1)
      .transform((value) => Number(value)),
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
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    const supaBalance = await UserService.getBalance();
    if (supaBalance) {
      const allowTransaction = supaBalance - data.count * data.price >= 0;

      if (!allowTransaction) {
        setErrorTransaction(true);
      } else {
        if (stock) {
          const response = await PortfolioService.addTransaction(
            stock.ticker,
            data.price,
            data.count,
            type
          );
          if (response) {
            setValue("count", 0);
            setValue("price", 0);
            onClose();
          }
        }
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
          value={stock?.ticker}
        />
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
