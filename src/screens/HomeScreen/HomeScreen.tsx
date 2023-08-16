import { FaviconIcon } from "@/icons/FaviconIcon/FaviconIcon";
import s from "./styles.module.scss";
import Link from "next/link";

export const HomeScreen = () => {
  return (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <div className={s.headerWrapper}>
        <div className={s.header}>
          <div></div>
          <div className={s.headerTitle}>
            <div style={{ width: "60px", height: "60px" }}>
              <FaviconIcon />
            </div>
            <p>Stocker</p>
          </div>
          <Link href={"/login"}>
            <p>Sign In</p>
          </Link>
        </div>
      </div>
      <h1 className={s.h1}>The Best Place to Track Your Investing</h1>
    </div>
  );
};
