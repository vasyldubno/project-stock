import { FC, ReactNode, useState } from "react";
import s from "./Tabs.module.scss";
import { LostIcon } from "@/icons/LotsIcon";
import { ScreenerService } from "@/services/ScreenerService";

interface TabsProps {
  tabs: {
    content: string | ReactNode;
    icon?: ReactNode;
    iconDelete?: ReactNode;
    onDelete?: () => void;
  }[];
}

export const TabsPortfolio: FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div>
        {tabs && (
          <ul className={s.tab_list}>
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`${s.tab} ${
                  activeTab === index ? s.tab__active : ""
                }`}
              >
                <button
                  onClick={() => setActiveTab(index)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {tab.icon && <div>{tab.icon}</div>}
                  <span>{tab.content}</span>
                  {tab.iconDelete && (
                    <div className={s.icon__delete} onClick={tab.onDelete}>
                      {tab.iconDelete}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
