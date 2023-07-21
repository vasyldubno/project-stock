import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Button } from "../Button/Button";
import Link from "next/link";
import s from "./Layout.module.scss";
import { PortfolioService } from "@/services/PortfolioService";
import { supabaseClient } from "@/config/supabaseClient";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [balance, setBalance] = useState(0);

  const links = [
    { href: "/", title: "Home" },
    { href: "/dashboard", title: "Dashboard" },
    { href: "/portfolio", title: "Portfolio" },
    { href: "/screener", title: "Screener" },
  ];

  useEffect(() => {
    const fetch = async () => {
      const result = await supabaseClient
        .from("user")
        .select()
        .eq("username", "vasyldubno")
        .single();

      if (result.data) {
        setBalance(result.data.balance);
      }
    };

    fetch();
  }, []);

  return (
    <>
      <div className={s.wrapper}>
        {links.map((link, index) => (
          <Link key={index} href={link.href}>
            <Button title={link.title} />
          </Link>
        ))}
        <Button
          title="Update Dividends"
          onClick={async () => {
            await PortfolioService.updateDividends();
          }}
        />
        <div
          style={{
            padding: "0.5rem",
            borderRadius: "0.5rem",
            borderColor: "var(--color-gray)",
            borderWidth: "1px",
          }}
        >
          <p>Balance: ${balance}</p>
        </div>
      </div>
      {children}
    </>
  );
};
