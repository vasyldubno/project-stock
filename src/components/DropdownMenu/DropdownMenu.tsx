import React from "react";
import * as DropdownMenuRadix from "@radix-ui/react-dropdown-menu";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
// import "./styles.css";
import s from "./styles.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";

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
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");

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
          {/* <DropdownMenuRadix.Item className={s.DropdownMenuItem}>
            New Tab
          </DropdownMenuRadix.Item>
          <DropdownMenuRadix.Item className={s.DropdownMenuItem}>
            New Window
          </DropdownMenuRadix.Item> */}

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
