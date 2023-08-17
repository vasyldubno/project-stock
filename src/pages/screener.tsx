import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { ScreenerScreen } from "@/screens/ScreenerScreen/ScreenerScreen";
import Head from "next/head";

const ScreenerPage = () => {
  return (
    <>
      <Head>
        <title>Screener | {TITLE}</title>
      </Head>
      <AuthProvider>
        <ScreenerScreen />
      </AuthProvider>
    </>
  );
};

export default ScreenerPage;
