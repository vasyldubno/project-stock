import { DashboardScreen } from "@/screens/DashboardScreen/DashboardScreen";
import { NextPage } from "next";
import Head from "next/head";

const DashboardPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardScreen />
    </>
  );
};

export default DashboardPage;
