import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../Button/Button";
import s from "./FormRegister.module.scss";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError/FormError";
import { supabaseClient } from "@/config/supabaseClient";
import { FC, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@/hooks/useUser";

type FormRegisterProps = {
  afterSubmit?: () => void;
};

export const FormRegister: FC<FormRegisterProps> = ({ afterSubmit }) => {
  const user = useUser();

  const [errorMessage, setErrorMessage] = useState("");

  const formSchema = z.object({
    name: z.string().min(2),
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
    const responseAuth = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (responseAuth.error) {
      setErrorMessage(responseAuth.error.message);
    }
    if (responseAuth.data) {
      if (responseAuth.data.user) {
        const responseUser = await supabaseClient
          .from("user")
          .insert({ email: data.email, id: responseAuth.data.user.id })
          .select();
        if (responseUser.data && afterSubmit) {
          user?.setUser({ id: responseAuth.data.user.id, email: data.email });
          afterSubmit();
        }
      }
    }

    // const existUser = await getDoc(doc(db, "user", data.email));

    // if (existUser.exists()) {
    //   setErrorMessage(
    //     `User with email ${data.email} exist. Choose another email`
    //   );
    // }

    // if (!existUser.exists()) {
    //   const user = await createUserWithEmailAndPassword(
    //     auth,
    //     data.email,
    //     data.password
    //   );
    //   if (user.user) {
    //     await setDoc(doc(db, "user", data.email), {
    //       firstName: data.name,
    //       email: data.email,
    //     });
    //   }
    // }
  };

  return (
    <form
      className={s.form}
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => setErrorMessage("")}
    >
      <div className={s.inputWrapper}>
        <label htmlFor="name">Name</label>
        <input type="text" className={s.input} {...register("name")} />
        {errors.name && <FormError>{errors.name.message}</FormError>}
      </div>

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

      <Button title="Register" width="200px" />
    </form>
  );
};
