import { FormRegister } from "@/components/FormRegister/FormRegister";
import { useRouter } from "next/router";

export const RegisterScreen = () => {
  const router = useRouter();

  const afterSubmit = () => {
    router.push("/dashboard");
  };

  return (
    <div style={{ width: "500px", margin: "1rem auto" }}>
      <FormRegister afterSubmit={afterSubmit} />
    </div>
  );
};
