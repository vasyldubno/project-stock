import { FC } from "react";

interface TransactionIcon {
  size: string;
}

export const TransactionIcon: FC<TransactionIcon> = ({ size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      stroke="#020202"
      strokeWidth="2px"
      strokeMiterlimit={10}
      // strokeLinecap="square"
      fill="none"
    >
      <g id="reciept_alternatif" data-name="reciept alternatif">
        <line className="cls-1" x1="10" y1="7.5" x2="18" y2="7.5" />
        <line className="cls-1" x1="10" y1="11.5" x2="18" y2="11.5" />
        <line className="cls-1" x1="10" y1="15.5" x2="18" y2="15.5" />
        <line className="cls-1" x1="8" y1="7.5" x2="6" y2="7.5" />
        <line className="cls-1" x1="8" y1="11.5" x2="6" y2="11.5" />
        <line className="cls-1" x1="8" y1="15.5" x2="6" y2="15.5" />
        <polygon
          className="cls-2"
          points="4 22.5 6.66 20.5 9.33 22.5 11.99 20.5 14.66 22.5 17.33 20.5 20 22.5 21 21.5 21 1.5 3 1.5 3 21.5 4 22.5"
        />
      </g>
    </svg>
  );
};
