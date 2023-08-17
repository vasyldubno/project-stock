import { TITLE } from "@/config/consts";
import { AuthProvider } from "@/providers/AuthProvider/AuthProvider";
import { DashboardScreen } from "@/screens/DashboardScreen/DashboardScreen";
import { NextPage } from "next";
import Head from "next/head";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard | {TITLE}</title>
      </Head>
      <AuthProvider>
        <DashboardScreen />
      </AuthProvider>
    </>
  );
};

export default DashboardPage;
