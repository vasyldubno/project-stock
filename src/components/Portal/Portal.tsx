import { FC, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  open: boolean;
}

export const Portal: FC<PropsWithChildren & PortalProps> = ({
  open,
  children,
}) => {
  return (
    <div>
      {open ? createPortal(children, document.querySelector("#modal")!) : null}
    </div>
  );
};
