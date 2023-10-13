import { FC, useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Input } from "../Input/Input";
import { STOCKS } from "@/assets/stock";
import Link from "next/link";
import s from "./styles.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const ModalSearch: FC<Props> = ({ onClose, open }) => {
  const [value, setValue] = useState("");
  const [list, setList] = useState<{ ticker: string; name: string }[] | null>(
    null
  );

  const handleChange = (value: string) => {
    const result = STOCKS.filter((i) => i.ticker.startsWith(value));
    setList(result.map((res) => ({ ticker: res.ticker, name: res.name })));
  };

  useEffect(() => {
    if (value) {
      handleChange(value);
    } else {
      setList(null);
    }
  }, [value]);

  return (
    <>
      <Modal open={open} onClose={onClose} position="top">
        <div className={s.wrapper}>
          <Input
            placeholder="Ticker"
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            value={value}
          />
          {list &&
            list.map((item, index) => (
              <div key={index}>
                <Link
                  href={`/stock/${item.ticker}`}
                  onClick={() => {
                    onClose();
                    setValue("");
                    setList(null);
                  }}
                >
                  {item.ticker}: {item.name}
                </Link>
              </div>
            ))}
        </div>
      </Modal>
    </>
  );
};
