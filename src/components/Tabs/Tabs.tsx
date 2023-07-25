import { FC, ReactNode, useState } from "react";
import s from "./Tabs.module.scss";
import { LostIcon } from "@/icons/LotsIcon";

interface TabsProps {
  tabs: { content: string; icon?: ReactNode }[];
  tabsPanel: { content: ReactNode }[];
}

export const Tabs: FC<TabsProps> = ({ tabsPanel, tabs }) => {
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
                style={{
                  bottom: tab.icon ? "-1px" : "-1px",
                }}
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
                </button>
              </li>
            ))}
          </ul>
        )}
        {tabsPanel.map((tabPanel, index) => (
          <div
            key={index}
            className={`${s.tab_panel} ${
              activeTab === index ? s.tab_panel__active : ""
            }`}
          >
            <>{tabPanel.content}</>
          </div>
        ))}
      </div>
    </>
  );
};
