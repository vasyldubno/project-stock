import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Button } from "../Button/Button";
import Link from "next/link";
import s from "./Layout.module.scss";
import { PortfolioService } from "@/services/PortfolioService";
import { supabaseClient } from "@/config/supabaseClient";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const links = [
    { href: "/", title: "Home" },
    { href: "/dashboard", title: "Dashboard" },
    { href: "/portfolio", title: "Portfolio" },
    { href: "/screener", title: "Screener" },
    { href: "/activity", title: "Activity" },
  ];

  return (
    <>
      <div className={s.wrapper}>
        {links.map((link, index) => (
          <Link key={index} href={link.href}>
            <Button title={link.title} />
          </Link>
        ))}
        {/* <Button
          title="Update Dividends"
          onClick={async () => {
            await PortfolioService.updateDividends();
          }}
        /> */}
        {/* <Button
          title="SELL"
          onClick={async () => {
            await PortfolioService.addTransaction("CMA", 55.66, 1, "sell");
          }}
        /> */}
      </div>
      {children}
    </>
  );
};
