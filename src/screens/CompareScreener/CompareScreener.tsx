import { STOCKS } from "@/assets/stock";
import { Button } from "@/components/Button/Button";
import { Container } from "@/components/Container/Container";
import { Header } from "@/components/Header/Header";
import { Modal } from "@/components/Modal/Modal";
import { Select } from "@/components/Select/Select";
import { TableCompare } from "@/components/TableCompare/TableCompare";
import { ChangeEvent, useState } from "react";
import { useStocks } from "./queries";
import s from "./styles.module.scss";

export const CompareScreener = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [compareTickers, setCompareTickers] = useState<string[]>([]);

  const stocks = useStocks(compareTickers);

  return (
    <>
      <Header />

      <Container>
        <div className={s.wrapper}>
          <Button title="+ Add New Stock" onClick={() => setIsOpen(true)} />
          <Button
            title="Clear Compare List"
            onClick={() => setCompareTickers([])}
          />
        </div>

        <div className={s.wrapperTable}>
          {stocks?.data && <TableCompare data={stocks.data} />}
        </div>
      </Container>

      <Modal open={isOpen} onClose={() => {}}>
        <div className={s.modalContainer}>
          <div style={{ width: "100%" }}>
            <Select
              label="Choose Stock"
              data={STOCKS.map((item) => item.ticker)}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setSelectedTicker(e.target.value);
              }}
              value={selectedTicker}
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
