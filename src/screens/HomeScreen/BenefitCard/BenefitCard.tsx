import Image from "next/image";
import { FC } from "react";
import s from "./styles.module.scss";

type Props = {
  imageUrl: string;
  title: string;
  description: string;
  reflect?: boolean;
};

export const BenefitCard: FC<Props> = ({
  description,
  imageUrl,
  title,
  reflect,
}) => {
  return (
    <div className={`${s.wrapper} ${reflect ? s.reflect : ""}`}>
      <div
        style={
          {
            // gridArea: "1 / 1 / 2 / 2",
          }
        }
        className={s.image__wrapper}
      >
        <Image alt="" src={imageUrl} fill style={{ objectFit: "cover" }} />
      </div>
      <div
        style={
          {
            // gridArea: "2 / 1 / 3 / 2",
          }
        }
        className={s.content}
      >
        <p className={s.title}>{title}</p>
        <p className={s.description}>{description}</p>
      </div>
    </div>
  );
};
