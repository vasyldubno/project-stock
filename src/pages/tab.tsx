import { Tabs } from "@/components/Tabs/Tabs";
import { DividendIcon } from "@/icons/DividendIcon";
import { LostIcon } from "@/icons/LotsIcon";
import { TransactionIcon } from "@/icons/TransactionIcon";

const TabPage = () => {
  return (
    <div style={{ margin: "1rem" }}>
      <Tabs
        tabs={[
          { content: "Share Lots", icon: <LostIcon size="1rem" /> },
          { content: "Transactions", icon: <TransactionIcon size="1rem" /> },
          { content: "Dividends", icon: <DividendIcon size="1rem" /> },
          { content: "Test" },
        ]}
        tabsPanel={["Title Tab 1", "Title Tab 2", "Dividends"]}
      />
    </div>
  );
};

export default TabPage;
