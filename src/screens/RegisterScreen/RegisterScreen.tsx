import { FormRegister } from "@/components/FormRegister/FormRegister";
import { FaviconIcon } from "@/icons/FaviconIcon/FaviconIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import s from "./styles.module.scss";
import Head from "next/head";
import { TITLE } from "@/config/consts";

export const RegisterScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Register | {TITLE}</title>
      </Head>
      <div className={s.headerWrapper}>
        <Link href={"/"} className={s.headerContent}>
          <div style={{ height: "60px", width: "60px" }}>
            <FaviconIcon />
          </div>
          <p>Stocker</p>
        </Link>
      </div>
      <div
        style={{ maxWidth: "500px", margin: "1rem auto", padding: "0 1rem" }}
      >
        <FormRegister afterSubmit={afterSubmit} />
      </div>
    </>
  );
};
