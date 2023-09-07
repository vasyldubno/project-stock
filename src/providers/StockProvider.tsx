import { AuthContext } from "@/context/AuthContext";
import { UserService } from "@/services/UserService";
import { FC, PropsWithChildren, useEffect, useState } from "react";

export const StockProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    UserService.getUser().then((res) => {
      if (res) {
        if (res.error) {
          setIsLoaded(true);
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
