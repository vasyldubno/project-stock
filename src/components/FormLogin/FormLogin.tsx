import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button/Button";
import s from "./FormLogin.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError/FormError";
import { supabaseClient } from "@/config/supabaseClient";
import { FC, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { useUser } from "@/hooks/useUser";

type FormRegisterProps = {
  afterSubmit?: () => void;
};

export const FormLogin: FC<FormRegisterProps> = ({ afterSubmit }) => {
  const user = useUser();

  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
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
    try {
      const responseAuth = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (responseAuth.error) {
        setErrorMessage(responseAuth.error.message);
      }
      if (
        responseAuth.data.user &&
        responseAuth.data.user.email &&
        !responseAuth.error &&
        afterSubmit
      ) {
        user?.setUser({
          id: responseAuth.data.user.id,
          email: responseAuth.data.user.email,
        });
        afterSubmit();
      }
    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setErrorMessage("")}
    >
      <div className={s.inputWrapper}>
        <label htmlFor="email">Email</label>
        <input type="email" className={s.input} {...register("email")} />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </div>

      <div className={s.inputWrapper}>
        <label htmlFor="password">Password</label>
        <input type="password" className={s.input} {...register("password")} />
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      {errorMessage && <FormError>{errorMessage}</FormError>}

      <Button title="Login" width="200px" />
    </form>
  );
};
