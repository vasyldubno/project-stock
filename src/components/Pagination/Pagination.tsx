import { Table } from "@tanstack/react-table";
import { FC, useState } from "react";
import { Button } from "../Button/Button";

type Props = {
  table: Table<any>;
};

export const Pagination: FC<Props> = ({ table }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        margin: "1rem 0",
      }}
    >
      <Button
        title="<<"
        onClick={() => {
          table.setPageIndex(0);
        }}
        width="3rem"
        disabled={!table.getCanPreviousPage()}
      />
      <Button
        title="<"
        onClick={() => {
          table.previousPage();
        }}
        width="3rem"
        disabled={!table.getCanPreviousPage()}
      />
      <Button
        title=">"
        onClick={() => {
          table.nextPage();
        }}
        width="3rem"
        disabled={!table.getCanNextPage()}
      />
      <Button
        title=">>"
        onClick={() => {
          table.setPageIndex(table.getPageCount() - 1);
        }}
        width="3rem"
        disabled={!table.getCanNextPage()}
      />
    </div>
  );
};
