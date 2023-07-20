import { FC, PropsWithChildren } from "react";
import { Button } from "../Button/Button";
import Link from "next/link";
import s from "./Layout.module.scss";
import { PortfolioService } from "@/services/PortfolioService";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const links = [
    { href: "/", title: "Home" },
    { href: "/dashboard", title: "Dashboard" },
    { href: "/portfolio", title: "Portfolio" },
    { href: "/screener", title: "Screener" },
  ];

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
      </div>
      {children}
    </>
  );
};
