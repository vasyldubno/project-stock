import { AddNewScreener } from "@/components/AddNewScreener/AddNewScreener";
import { Button } from "@/components/Button/Button";
import { Container } from "@/components/Container/Container";
import { Header } from "@/components/Header/Header";
import { Modal } from "@/components/Modal/Modal";
import { ScreenerFilter } from "@/components/ScreenerFilter/ScreenerFilter";
import { TableScreener } from "@/components/TableScreener/TableScreener";
import { TabsPortfolio } from "@/components/TabsPortfolio/TabsPortfolio";
import { useUser } from "@/hooks/useUser";
import { DeleteIcon } from "@/icons/DeleteIcon";
import { ScreenerService } from "@/services/ScreenerService";
import { ISupaScreener } from "@/types/types";
import { useEffect, useState } from "react";
import { useScreeners, useStocks } from "./queries";
import { supaScreenerDelete, supaScreenerInsert } from "./supabase";

export const ScreenerScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [screeners, setScreeners] = useState<ISupaScreener[] | null>(null);
  const [selectedScreener, setSelectedScreener] =
    useState<ISupaScreener | null>(null);

  const user = useUser();
  const data = useStocks(selectedScreener, user);
  useScreeners(user, setScreeners, setSelectedScreener);

  useEffect(() => {
    if (user) {
      supaScreenerInsert(user, setScreeners);
      supaScreenerDelete(user, setScreeners);
    }
  }, [user]);

  return (
    <>
      {user && (
        <>
          <Header />
          <Container>
            <div style={{ marginBottom: "1rem" }}>
              <Button
                title="+ Add New Screener"
                onClick={() => setIsOpen(true)}
              />
            </div>

            {screeners && (
              <TabsPortfolio
                tabs={screeners.map((item) => ({
                  content: (
                    <p onClick={() => setSelectedScreener(item)}>
                      {item.title}
                    </p>
                  ),
                  iconDelete: selectedScreener?.id === item.id && (
                    <DeleteIcon size="1rem" />
                  ),
                  onDelete: () =>
                    ScreenerService.deleteScreener({
                      screenerId: item.id,
                      userId: item.user_id,
                    }),
                }))}
              />
            )}

            <ScreenerFilter
              screener={selectedScreener}
              setSelectedScreener={setSelectedScreener}
            />

            {data && data.length > 0 && (
              <div style={{ margin: "1rem", overflowX: "auto" }}>
                <TableScreener data={data} />
              </div>
            )}
          </Container>
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <AddNewScreener afterSubmit={() => setIsOpen(false)} />
          </Modal>
        </>
      )}
    </>
  );
};
