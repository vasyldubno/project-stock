import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { SoldOutScreener } from "@/screens/SoldOutScreener/SoldOutScreener";
import Head from "next/head";

const SoldOutPage = () => {
  return (
    <>
      <Head>
        <title>Sold Out | {TITLE}</title>
      </Head>
      <AuthProvider>
        <SoldOutScreener />
      </AuthProvider>
    </>
  );
};

export default SoldOutPage;
