import { ArrowDown } from "@/icons/ArrowDown";
import { isNegative } from "@/utils/isNegative";
import { FC } from "react";
import s from "./TableCardPrice.module.scss";

interface CardPriceProps {
  content: string | number | null | undefined;
}

export const TableCardPrice: FC<CardPriceProps> = ({ content }) => {
  return (
    <>
      {content ? (
        <div
          className={s.wrapper}
          style={{
            backgroundColor: isNegative(Number(content))
              ? "rgb(252,232,230)"
              : "rgb(230,244,234)",
          }}
        >
          <div
            style={{
              transform: isNegative(Number(content))
                ? "rotate(0deg)"
                : "rotate(180deg)",
            }}
          >
            <ArrowDown
              size="0.8rem"
              fill={
                isNegative(Number(content))
                  ? "rgb(165,14,14)"
                  : "rgb(19,115,51)"
              }
            />
          </div>
          <p
            style={{
              color: isNegative(Number(content))
                ? "rgb(165,14,14)"
                : "rgb(19,115,51)",
            }}
          >
            {Math.abs(Number(content)).toFixed(2)}%
          </p>
        </div>
      ) : (
        <div
          className={s.wrapper}
          style={{
            backgroundColor: "#e1e3e8",
          }}
        >
          <p
            style={{
              color: "#000",
            }}
          >
            -- --
          </p>
        </div>
      )}
    </>
  );
};
