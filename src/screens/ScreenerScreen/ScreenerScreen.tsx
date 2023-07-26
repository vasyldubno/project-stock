import { Header } from "@/components/Header/Header";
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
      <Header />
      <div style={{ margin: "1rem" }}>
        <TableScreenerDynamic data={data} />
      </div>
    </>
  );
};
