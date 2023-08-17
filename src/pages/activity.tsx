import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { ActivityScreener } from "@/screens/ActivityScreener/ActivityScreener";
import Head from "next/head";

const ActivityPage = () => {
  return (
    <>
      <Head>
        <title>Activity | {TITLE}</title>
      </Head>
      <AuthProvider>
        <ActivityScreener />
      </AuthProvider>
    </>
  );
};

export default ActivityPage;
