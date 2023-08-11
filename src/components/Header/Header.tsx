import { useUser } from "@/hooks/useUser";
import { UserService } from "@/services/UserService";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button } from "../Button/Button";
import s from "./Header.module.scss";
import { UserIcon } from "@/icons/UserIcon";
import { Popover } from "../Popover/Popover";
import { useBalance } from "./queries";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";
import { Modal } from "../Modal/Modal";
import { Input } from "../Input/Input";
import { FormError } from "../FormError/FormError";
import { supabaseClient } from "@/config/supabaseClient";

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

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [valueDeposit, setDepositValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddDeposit = async () => {
    if (user) {
      if (Number.isNaN(Number(valueDeposit))) {
        setErrorMessage("Allow only numbers");
      } else {
        const balance = await UserService.getBalance(user);

        await supabaseClient
          .from("user")
          .update({
            balance: balance
              ? balance + Number(valueDeposit)
              : Number(valueDeposit),
          })
          .eq("id", user.id);

        setIsOpenModal(false);
      }
    }
  };

  return (
    <>
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
              open={isOpenPopover}
              setOpen={setIsOpenPopover}
              trigger={<UserIcon size="2rem" />}
              content={[
                <>
                  <p>Balance: ${balance}</p>
                </>,
                <>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIsOpenModal(true);
                      setIsOpenPopover(false);
                    }}
                  >
                    Deposit
                  </p>
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
      <Modal open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div style={{ width: "300px" }}>
          <p
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              margin: "0 0 2rem 0",
              textAlign: "center",
            }}
          >
            Deposit
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Input
              value={valueDeposit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDepositValue(e.target.value);
                setErrorMessage("");
              }}
            />
            {errorMessage && <FormError>{errorMessage}</FormError>}
            <Button
              title="+ Add Deposit"
              width="fit-content"
              onClick={handleAddDeposit}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
