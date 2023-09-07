import { Button } from "@/components/Button/Button";
import { SendIcon } from "@/icons/SendIcon";
import { Unbounded } from "@next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BenefitCard } from "./BenefitCard/BenefitCard";
import s from "./styles.module.scss";

const UnboundedFont = Unbounded({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export const HomeScreen = () => {
  return (
    <div style={{ width: "100dvw", height: "100dvh" }}>
      <div
        style={{
          backgroundColor: "#59aace",
        }}
      >
        <div className={s.section_first__wrapper}>
          <h1 style={UnboundedFont.style} className={s.h1}>
            Stocker
          </h1>
          <p className={s.section_first__p}>
            Seamlessly track, manage, and optimize your investments with our
            intuitive app. Stay in control of your portfolio&apos;s performance,
            receive real-time updates, and make informed decisions backed by
            powerful insights. Whether you&apos;re a seasoned investor or just
            starting out, InvestSync&apos;s user-friendly interface and
            comprehensive features provide a personalized experience tailored to
            your financial goals. Sync up with success today and pave the way
            for a more secure tomorrow with InvestSync.
          </p>
          <Link href={"/login"} style={{ width: "200px" }}>
            <Button
              title="Get Started"
              width="100%"
              rightIcon={
                <div style={{ width: "1.5rem", height: "1.5rem" }}>
                  <SendIcon />
                </div>
              }
            />
          </Link>
          <div style={{ padding: "1rem", width: "100%", maxWidth: "500px" }}>
            <div className={s.section_first__image_wrapper}>
              <Image
                alt="main photo"
                src="/1.avif"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#89C2D9" }}>
        <div className={s.section_second__wrapper}>
          <BenefitCard
            imageUrl="/2.jpg"
            title="Track Investments with Unrivaled Precision"
            description="Stocker empowers you with real-time insights and a
                customizable dashboard. Manage your portfolio like a pro and
                never miss a beat."
          />
          <BenefitCard
            reflect
            imageUrl="/3.jpg"
            title="Stay in the Loop with Market Updates"
            description="Be informed of the latest market trends and adjust your
                strategies with lightning-fast notifications, keeping you one
                step ahead."
          />
        </div>
      </div>
    </div>
  );
};
