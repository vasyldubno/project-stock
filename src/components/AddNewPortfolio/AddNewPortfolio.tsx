import { useUser } from "@/hooks/useUser";
import { PortfolioService } from "@/services/PortfolioService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../Button/Button";
import { FormError } from "../FormError/FormError";
import { Modal } from "../Modal/Modal";

export const AddNewPortfolio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useUser();

  const onClick = () => {
    setIsOpen(true);
  };

  const formSchema = z.object({
    name: z.string().min(1),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchema>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    if (user) {
      const res = await PortfolioService.addPortfolio(data.name, user);
      if (res?.errorMessage) {
        setErrorMessage(res.errorMessage);
      } else {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      <Button title="+ Add New Portfolio" onClick={onClick} />
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => setErrorMessage("")}
          style={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <label htmlFor="name">Portfolio Name</label>
            <input
              style={{
                border: "1px solid var(--color-gray)",
                borderRadius: "0.3rem",
                padding: "0.4rem",
                outline: "transparent",
                display: "block",
                width: "100%",
              }}
              {...register("name")}
            />
            {errors.name && <FormError>{errors.name.message}</FormError>}
          </div>
          {errorMessage && <FormError>{errorMessage}</FormError>}
          <Button title="+ Add Portfolio" width="150px" type="submit" />
        </form>
      </Modal>
    </>
  );
};
