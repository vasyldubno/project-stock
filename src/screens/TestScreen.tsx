import { ChartMapStocks } from "@/components/ChartMapStocks/ChartMapStocks";
import { UserService } from "@/services/UserService";
import { FC, useEffect, useState } from "react";

export const TestScreen: FC = () => {
  const [balance, setBalance] = useState<number>();

  useEffect(() => {
    // UserService.getBalance().then((res) => {
    //   console.log(res);
    //   if (res) {
    //     setBalance(res);
    //   }
    // });
    const fetch = async () => {
      const responseBalance = await UserService.getBalance();
    };
    fetch();
  }, []);

  return <></>;
};
