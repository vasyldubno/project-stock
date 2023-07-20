import { FC } from "react";

interface DividendIconProps {
  size: string;
}

export const DividendIcon: FC<DividendIconProps> = ({ size }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#020202"
      strokeMiterlimit={10}
      strokeWidth={"2px"}
    >
      <g id="bill_alternatif" data-name="bill alternatif">
        <path
          className="cls-1"
          d="M10,13.5h2.5A1.5,1.5,0,0,0,14,12h0a1.5,1.5,0,0,0-1.5-1.5h-1A1.5,1.5,0,0,1,10,9h0a1.5,1.5,0,0,1,1.5-1.5H14"
        />
        <line className="cls-1" x1="12" y1="5.5" x2="12" y2="7.5" />
        <line className="cls-1" x1="12" y1="13.5" x2="12" y2="15.5" />
        <polygon
          className="cls-1"
          points="4 22.5 6.66 20.5 9.33 22.5 11.99 20.5 14.66 22.5 17.33 20.5 20 22.5 21 21.5 21 1.5 3 1.5 3 21.5 4 22.5"
        />
      </g>
    </svg>
  );
};

// <style>.cls-1{fill:none;stroke:#020202;stroke-linecap:square;stroke-miterlimit:10;stroke-width:2px;}</style>
