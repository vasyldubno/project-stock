import { TITLE } from "@/config/consts";
import { PortfolioScreen } from "@/screens/PortfolioScreen/PortfolioScreen";
import Head from "next/head";

const PortfolioPage = () => {
  return (
    <>
      {/* <Head>
        <title>Portfolio | {TITLE}</title>
      </Head> */}
      <PortfolioScreen />
    </>
  );
};

export default PortfolioPage;
