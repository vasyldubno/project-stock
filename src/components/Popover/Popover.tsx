import { Cross2Icon } from "@radix-ui/react-icons";
import * as PopoverRadix from "@radix-ui/react-popover";
import { Dispatch, FC, ReactNode, SetStateAction } from "react";
import { TableDivider } from "../TableDivider/TableDivider";
import s from "./styles.module.scss";

type Props = {
  trigger: ReactNode;
  content: ReactNode[];
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export const Popover: FC<Props> = ({ trigger, content, open, setOpen }) => {
  return (
    <PopoverRadix.Root open={open}>
      <PopoverRadix.PopoverTrigger
        asChild
        onClick={() => {
          if (setOpen) {
            setOpen(true);
          }
        }}
      >
        <button>{trigger}</button>
      </PopoverRadix.PopoverTrigger>
      <PopoverRadix.Portal>
        <PopoverRadix.Content className={s.PopoverContent} sideOffset={5}>
          {content &&
            content.map((item, index) => (
              <div key={index}>
                <div>{item}</div>
                {index !== content.length - 1 && (
                  <div style={{ padding: "0.3rem 0" }}>
                    <TableDivider />
                  </div>
                )}
              </div>
            ))}
          <PopoverRadix.Close
            className={s.PopoverClose}
            aria-label="Close"
            onClick={() => {
              if (setOpen) {
                setOpen(false);
              }
            }}
          >
            <Cross2Icon />
          </PopoverRadix.Close>
          <PopoverRadix.Arrow className={s.PopoverArrow} />
        </PopoverRadix.Content>
      </PopoverRadix.Portal>
    </PopoverRadix.Root>
  );
};
