import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PortfolioService } from "@/services/PortfolioService";

export const FormAddStock = () => {
  const formSchema = z.object({
    ticker: z.string().min(1, "Require"),
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
    const response = await PortfolioService.addTransaction(
      data.ticker,
      data.price,
      data.count,
      "buy"
    );

    if (response) {
      setValue("ticker", "");
      setValue("count", 0);
      setValue("price", 0);
    }
  };

  return (
    <form style={{ maxWidth: "300px" }} onSubmit={handleSubmit(onSubmit)}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="ticker">Ticker</label>
        <input
          {...register("ticker")}
          id="ticker"
          type="text"
          style={{
            border: "1px solid black",
            paddingLeft: "0.2rem",
            outline: "transparent",
          }}
        />
        {errors.ticker && <p>{errors.ticker.message}</p>}
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

      <button type="submit">Add Stock</button>
    </form>
  );
};
