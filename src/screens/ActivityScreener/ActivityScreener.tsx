import { Header } from "@/components/Header/Header";
import { Layout } from "@/components/Layout/Layout";
import { useUser } from "@/hooks/useUser";
import dynamic from "next/dynamic";

const DynamicTableActivity = dynamic(
  () =>
    import("@/components/TableActivity/TableActivity").then(
      (res) => res.TableActivity
    ),
  { ssr: false }
);

export const ActivityScreener = () => {
  const user = useUser();

  return (
    <>
      {user && (
        <>
          <Header />
          <div style={{ margin: "0 auto", width: "1280px", padding: "1rem 0" }}>
            <DynamicTableActivity />
          </div>
        </>
      )}
    </>
  );
};
