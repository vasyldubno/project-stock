import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { PortfolioScreen } from "@/screens/PortfolioScreen/PortfolioScreen";
import Head from "next/head";

const PortfolioPage = () => {
  return (
    <>
      <Head>
        <title>Portfolio | {TITLE}</title>
      </Head>
      <AuthProvider>
        <PortfolioScreen />
      </AuthProvider>
    </>
  );
};

export default PortfolioPage;
