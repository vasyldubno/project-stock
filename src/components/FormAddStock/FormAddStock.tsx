import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortfolioService } from "@/services/PortfolioService";
import { Button } from "../Button/Button";
import { IPortfolioStock, ISupaStock } from "@/types/types";

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
  const formSchema = z.object({
    count: z.string().transform((value) => Number(value)),
    price: z.string().transform((value) => Number(value)),
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
  };

  return (
    <form style={{ maxWidth: "300px" }} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="ticker">Ticker</label>
        <input
          id="ticker"
          type="text"
          style={{
            border: "1px solid black",
            paddingLeft: "0.2rem",
            outline: "transparent",
          }}
          value={stock?.ticker}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="count">Count</label>
        <input
          {...register("count")}
          id="count"
          type="number"
          style={{
            border: "1px solid black",
            paddingLeft: "0.2rem",
            outline: "transparent",
          }}
        />
        {errors.count && <p>{errors.count.message}</p>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="price">Price</label>
        <input
          {...register("price")}
          id="price"
          type="number"
          step={0.01}
          style={{
            border: "1px solid black",
            paddingLeft: "0.2rem",
            outline: "transparent",
          }}
        />
        {errors.price && <p>{errors.price.message}</p>}
      </div>

      {type === "buy" && <Button title="BUY" type="submit" />}
      {type === "sell" && <Button title="SELL" type="submit" />}
    </form>
  );
};
