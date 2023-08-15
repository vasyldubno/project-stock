import { supabaseClient } from "@/config/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { UserIcon } from "@/icons/UserIcon";
import { UserService } from "@/services/UserService";
import { useRouter } from "next/router";
import { ChangeEvent, FC, useState } from "react";
import { Button } from "../Button/Button";
import { DropdownMenu } from "../DropdownMenu/DropdownMenu";
import { FormError } from "../FormError/FormError";
import { Input } from "../Input/Input";
import { Modal } from "../Modal/Modal";
import { Popover } from "../Popover/Popover";
import s from "./Header.module.scss";
import { useBalance } from "./queries";
import { FaviconIcon } from "@/icons/FaviconIcon/FaviconIcon";

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
        <div className={s.modalWrapper}>
          <p className={s.modalTitle}>Deposit</p>
          <div className={s.modalForm}>
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
