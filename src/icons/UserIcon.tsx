import { FC } from "react";

type Props = {
  size: string;
};

export const UserIcon: FC<Props> = ({ size }) => {
  const color = "#FFF";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        opacity="0.5"
        cx="12"
        cy="9"
        r="3"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <path
        opacity="0.5"
        d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
