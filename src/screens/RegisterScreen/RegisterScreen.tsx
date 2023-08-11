import { FormRegister } from "@/components/FormRegister/FormRegister";
import { useRouter } from "next/router";

export const RegisterScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "1rem auto", padding: "0 1rem" }}>
      <FormRegister afterSubmit={afterSubmit} />
    </div>
  );
};
