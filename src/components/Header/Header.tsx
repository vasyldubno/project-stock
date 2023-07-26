import Link from "next/link";
import { FC } from "react";
import s from "./Header.module.scss";

export const Header: FC = () => {
  return (
    <>
      <nav className={s.nav}>
        <ul className={s.ul}>
          <li>
            <Link href={"/dashboard"}>
              <p className={s.li}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link href={"/portfolio"}>
              <p className={s.li}>Portfolio</p>
            </Link>
          </li>
          <li>
            <Link href={"/screener"}>
              <p className={s.li}>Screener</p>
            </Link>
          </li>
          <li>
            <Link href={"/activity"}>
              <p className={s.li}>Activity</p>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
