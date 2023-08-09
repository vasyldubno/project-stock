import { FC, ReactNode, useState } from "react";
import * as PopoverRadix from "@radix-ui/react-popover";
import s from "./styles.module.scss";
import { UserIcon } from "@/icons/UserIcon";
import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";

type Props = {
  trigger: ReactNode;
  content: ReactNode[];
};

export const Popover: FC<Props> = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverRadix.Root>
      <PopoverRadix.PopoverTrigger asChild>
        <button>
          <UserIcon size="2rem" />
        </button>
      </PopoverRadix.PopoverTrigger>
      <PopoverRadix.Portal>
        <PopoverRadix.Content className={s.PopoverContent} sideOffset={5}>
          {content &&
            content.map((item, index) => <div key={index}>{item}</div>)}
          <PopoverRadix.Close className={s.PopoverClose} aria-label="Close">
            <Cross2Icon />
          </PopoverRadix.Close>
          <PopoverRadix.Arrow className={s.PopoverArrow} />
        </PopoverRadix.Content>
      </PopoverRadix.Portal>
    </PopoverRadix.Root>
  );
};
