import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { Portal } from "../Portal/Portal";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import s from "./styles.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const Modal: FC<PropsWithChildren & ModalProps> = ({
  children,
  open,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setIsOpen(false);
    onClose();
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <Portal open={isOpen}>
      <div>
        <div className={s.overlay} />
        <div className={s.content} ref={ref}>
          {children}
        </div>
      </div>
    </Portal>
  );
};
