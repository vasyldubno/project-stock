import { AuthContext } from "@/context/AuthContext";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export const StockProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    UserService.getUser().then((res) => {
      if (res) {
        if (res.error) {
          setIsLoaded(true);
          router.push("/login");
        }
        if (res.email && res.id) {
          setUser({ email: res.email, id: res.id });
          setIsLoaded(true);
        }
      }
    });
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          id: user?.id ?? null,
          email: user?.email ?? null,
          isLoaded,
          setUser: setUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
