import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user]);

  return <></>;
}
