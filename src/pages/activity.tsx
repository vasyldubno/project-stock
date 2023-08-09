import { TITLE } from "@/config/consts";
import { ActivityScreener } from "@/screens/ActivityScreener/ActivityScreener";
import Head from "next/head";

const ActivityPage = () => {
  return (
    <>
      <Head>
        <title>Activity | {TITLE}</title>
      </Head>
      <ActivityScreener />
    </>
  );
};

export default ActivityPage;
