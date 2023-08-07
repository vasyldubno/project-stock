import { STOCKS } from "@/assets/stock";
import { Header } from "@/components/Header/Header";
import { Input } from "@/components/Input/Input";
import { ChangeEvent, useEffect, useState } from "react";
import s from "./styles.module.scss";
import { useQuery } from "react-query";
import { supabaseClient } from "@/config/supabaseClient";
import { useStocks } from "./queries";
import { TableCompare } from "@/components/TableCompare/TableCompare";
import { Select } from "@/components/Select/Select";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { Container } from "@/components/Container/Container";

export const CompareScreener = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [compareTickers, setCompareTickers] = useState<string[]>([]);

  const stocks = useStocks(compareTickers);

  return (
    <>
      <Header />

      <Container>
        <div style={{ margin: "0 0 1rem 0", display: "flex", gap: "1rem" }}>
          <Button title="+ Add New Stock" onClick={() => setIsOpen(true)} />
          <Button
            title="Clear Compare List"
            onClick={() => setCompareTickers([])}
          />
        </div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          {stocks?.data && <TableCompare data={stocks.data} />}
        </div>
      </Container>

      <Modal open={isOpen} onClose={() => {}}>
        <div
          style={{
            width: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%" }}>
            <Select
              label="Choose Stock"
              data={STOCKS.map((item) => item.ticker)}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedTicker(e.target.value);
              }}
            />
          </div>
          <Button
            title="Add Stock to Compare"
            onClick={() => {
              setCompareTickers((prev) => {
                if (selectedTicker) {
                  return [...prev, selectedTicker];
                }
                return prev;
              });
              setSelectedTicker(null);
              setIsOpen(false);
            }}
            width="200px"
          />
        </div>
      </Modal>
    </>
  );
};
