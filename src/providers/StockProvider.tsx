import { AuthContext } from "@/context/AuthContext";
import { PortfolioService } from "@/services/PortfolioService";
import { StockService } from "@/services/StockService";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export const StockProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    UserService.getUser().then((res) => {
      if (res) {
        if (res.error) {
          router.push("/login");
        }
        if (res.email && res.id) {
          setUser({ email: res.email, id: res.id });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (user && user.id) {
      // StockService.updatePriceCurrent(user.id);
      // PortfolioService.updateDividends(user.id);
      // StockService.updateFundamentals();
    }
  }, [user]);

  return (
    <>
      <AuthContext.Provider
        value={{ id: user?.id, email: user?.email, setUser: setUser }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
