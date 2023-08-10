import { useUser } from "@/hooks/useUser";
import { UserService } from "@/services/UserService";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { Button } from "../Button/Button";
import s from "./Header.module.scss";
import { UserIcon } from "@/icons/UserIcon";
import { Popover } from "../Popover/Popover";
import { useBalance } from "./queries";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";

type Link = {
  link: string;
  name: string;
};

const links: Link[] = [
  { link: "/dashboard", name: "Dashboard" },
  { link: "/portfolio", name: "Portfolio" },
  { link: "/screener", name: "Screener" },
  { link: "/activity", name: "Activity" },
  { link: "/sold-out", name: "Sold Out" },
  { link: "/compare", name: "Compare" },
];

export const Header: FC = () => {
  const router = useRouter();
  const user = useUser();
  const balance = useBalance(user);

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <DropdownMenu />
        <h1 className={s.title}>Stocker</h1>
        {/* <nav>
          <ul className={s.ul}>
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.link}>
                  <p
                    className={`${s.li} ${
                      router.pathname === link.link ? s.li__active : ""
                    }`}
                  >
                    {link.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav> */}
        <div className={s.user}>
          <Popover
            trigger={<UserIcon size="2rem" />}
            content={[
              <>
                <p style={{ cursor: "pointer" }}>Balance: ${balance}</p>
              </>,
              <>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    UserService.signOut();
                    router.push("/login");
                  }}
                >
                  Sign Out
                </p>
              </>,
            ]}
          />
        </div>
      </div>
    </div>
  );
};
