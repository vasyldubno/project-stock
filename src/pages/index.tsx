import { Loader } from "@/components/Loader/Loader";
import { useUser } from "@/hooks/useUser";
import { HomeScreen } from "@/screens/HomeScreen/HomeScreen";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && user.isLoaded && user.id) {
      router.push("/dashboard");
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Stocker</title>
      </Head>
      {user && user.isLoaded && !user.id ? (
        <HomeScreen />
      ) : (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Loader />
        </div>
      )}
    </>
  );
}
