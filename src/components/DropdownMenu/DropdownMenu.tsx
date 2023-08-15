import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import s from "./styles.module.scss";

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

export const DropdownMenu = () => {
  const router = useRouter();

  return (
    <DropdownMenuRadix.Root>
      <DropdownMenuRadix.Trigger asChild>
        <button className={s.IconButton} aria-label="Customise options">
          <HamburgerMenuIcon />
        </button>
      </DropdownMenuRadix.Trigger>

      <DropdownMenuRadix.Portal>
        <DropdownMenuRadix.Content
          className={s.DropdownMenuContent}
          sideOffset={5}
        >
          {links.map((link, index) => (
            <DropdownMenuRadix.Item
              key={index}
              className={`${s.DropdownMenuItem} ${
                router.pathname === link.link ? s.DropdownMenuItemActive : ""
              }`}
            >
              <Link style={{ width: "100%" }} href={link.link}>
                {link.name}
              </Link>
            </DropdownMenuRadix.Item>
          ))}

          <DropdownMenuRadix.Arrow className={s.DropdownMenuArrow} />
        </DropdownMenuRadix.Content>
      </DropdownMenuRadix.Portal>
    </DropdownMenuRadix.Root>
  );
};
