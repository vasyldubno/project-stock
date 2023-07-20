import { ISupaStock } from "@/types/types";
import dynamic from "next/dynamic";

const TableScreenerDynamic = dynamic(
  () =>
    import("@/components/TableScreener/TableScreener").then(
      (res) => res.TableScreener
    ),
  { ssr: false }
);

export const ScreenerScreen = ({ data }: { data: ISupaStock[] }) => {
  return (
    <>
      <TableScreenerDynamic data={data} />
    </>
  );
};
