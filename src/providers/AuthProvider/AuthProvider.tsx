import { Loader } from "@/components/Loader/Loader";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect } from "react";
import s from "./styles.module.scss";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.isLoaded && !user.id) {
        router.push("/");
      }
    }
  }, [user]);

  return (
    <>
      {user && user.id ? (
        <>{children}</>
      ) : (
        <div className={s.loaderWrapper}>
          <Loader />
        </div>
      )}
    </>
  );
};
