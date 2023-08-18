import { FC, useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { FormAddStock } from "../FormAddStock/FormAddStock";

type Props = {
  portfolioId: string | undefined;
};

export const AddNewTransaction: FC<Props> = ({ portfolioId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button title="Buy Share" onClick={() => setIsOpen(true)} />
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <FormAddStock
          type="buy"
          onClose={() => setIsOpen(false)}
          portfolioId={portfolioId}
        />
      </Modal>
    </>
  );
};
