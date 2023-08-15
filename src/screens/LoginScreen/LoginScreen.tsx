import { FormLogin } from "@/components/FormLogin/FormLogin";
import Link from "next/link";
import { useRouter } from "next/router";
import s from "./styles.module.scss";

export const LoginScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <div className={s.wrapper}>
      <FormLogin afterSubmit={afterSubmit} />
      <p className={s.text}>
        If you don&apos;t have account,{" "}
        <Link href={"/register"} style={{ color: "blue" }}>
          Register
        </Link>
      </p>
    </div>
  );
};
