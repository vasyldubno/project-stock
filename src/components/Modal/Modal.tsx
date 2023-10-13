import {
  CSSProperties,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Portal } from "../Portal/Portal";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import s from "./styles.module.scss";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  position?: "center" | "top";
}

export const Modal: FC<PropsWithChildren & ModalProps> = ({
  children,
  open,
  onClose,
  position,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ref = useRef(null);

  const handleClickOutside = () => {
    setIsOpen(false);
    onClose();
  };

  useOnClickOutside(ref, handleClickOutside);

  const stylesAxiosY = position === "top" ? 10 : 50;
  const styles: CSSProperties = {
    position: "absolute",
    top: `${stylesAxiosY}%`,
    left: "50%",
    transform: `translate(-50%, -${stylesAxiosY}%)`,
  };

  return (
    <Portal open={isOpen}>
      <div>
        <div className={s.overlay} />
        <div style={styles} className={s.content} ref={ref}>
          {children}
        </div>
      </div>
    </Portal>
  );
};
