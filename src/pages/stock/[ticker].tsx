import { supabaseClient } from "@/config/supabaseClient";
import { ISupaStock } from "@/types/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FC } from "react";

type Props = {
  data: ISupaStock | null;
};

const TickerPage: FC<Props> = ({ data }) => {
  return (
    <>
      <header>
        <title>{data?.ticker}</title>
      </header>
      {data && (
        <div>
          <p>Ticker: {data.ticker}</p>
          <p>Sector: {data.sector}</p>
          <p>Industry: {data.subIndustry}</p>
          <p>Gross Margin: {data.gross_margin}%</p>
          <p>Net Margin: {data.net_margin}%</p>
          <p>EPS Growth 5y: {data.eps_growth_past_5y}%</p>
          <p>Instrinic Margin: {data.gfValueMargin}%</p>
          <p>ROE: {data.roe}</p>
        </div>
      )}
    </>
  );
};

export default TickerPage;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const data = await supabaseClient
    .from("stock")
    .select()
    .eq("ticker", context.params?.ticker)
    .single();

  return { props: { data: data.data } };
};
