import { FormLogin } from "@/components/FormLogin/FormLogin";
import Link from "next/link";
import { useRouter } from "next/router";
import s from "./styles.module.scss";
import { FaviconIcon } from "@/icons/FaviconIcon/FaviconIcon";
import Head from "next/head";
import { TITLE } from "@/config/consts";

export const LoginScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Login | {TITLE}</title>
      </Head>
      <div className={s.headerWrapper}>
        <Link href={"/"} className={s.headerContent}>
          <div className={s.header__icon}>
            <FaviconIcon />
          </div>
          <p>Stocker</p>
        </Link>
      </div>
      <div className={s.wrapper}>
        <FormLogin afterSubmit={afterSubmit} />
        <p className={s.text}>
          If you don&apos;t have account,{" "}
          <Link href={"/register"} style={{ color: "blue" }}>
            Register
          </Link>
        </p>
      </div>
    </>
  );
};
