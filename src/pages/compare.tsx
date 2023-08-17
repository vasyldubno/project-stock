import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { CompareScreener } from "@/screens/CompareScreener/CompareScreener";
import Head from "next/head";

const ComparePage = () => {
  return (
    <>
      <Head>
        <title>Compare | {TITLE}</title>
      </Head>
      <AuthProvider>
        <CompareScreener />
      </AuthProvider>
    </>
  );
};

export default ComparePage;
