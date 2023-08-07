import { FormLogin } from "@/components/FormLogin/FormLogin";
import Link from "next/link";
import { useRouter } from "next/router";

export const LoginScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <div style={{ margin: "1rem auto", width: "500px" }}>
      <FormLogin afterSubmit={afterSubmit} />
      <p style={{ textAlign: "center", fontSize: "0.8rem", marginTop: "2rem" }}>
        If you don&apos;t have account,{" "}
        <Link href={"/register"} style={{ color: "blue" }}>
          Register
        </Link>
      </p>
    </div>
  );
};
