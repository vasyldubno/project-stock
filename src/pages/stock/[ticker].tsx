import { Container } from "@/components/Container/Container";
import { supabaseClient } from "@/config/supabaseClient";
import { useUser } from "@/hooks/useUser";
import { ISupaStock } from "@/types/types";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { FC, useEffect, useState } from "react";
import { ChartTradingView } from "../../components/ChartTradingView/ChartTradingView";
import millify from "millify";
import { Header } from "@/components/Header/Header";
import { ROUND } from "@/utils/round";
import { Loader } from "@/components/Loader/Loader";
import { useRouter } from "next/router";

type Props = {
  data: ISupaStock | null;
};

const TickerPage: FC = () => {
  const [data, setData] = useState<ISupaStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const yearRange = ROUND(
    (Number(data?.price_current) / Number(data?.price_year_high)) * 100
  );

  const router = useRouter();

  const ticker = router.query.ticker;

  useEffect(() => {
    // console.log("useEffect");

    setIsLoading(true);
    supabaseClient
      .from("stock")
      .select()
      .eq("ticker", ticker)
      .single()
      .then((res) => {
        if (res.data) {
          // const d: ISupaStock = res.data;
          // console.log(d);
          setData(res.data);
          setIsLoading(false);
        }
      });
  }, [ticker]);

  return (
    <>
      <header>
        <title>{data?.ticker}</title>
      </header>

      <Header />

      <Container>
        {data && !isLoading ? (
          <div>
            <p
              style={{
                margin: "0 auto",
                width: "fit-content",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {data.ticker} | {data.name}
            </p>
            <p
              style={{
                margin: "0 auto",
                width: "fit-content",
                fontSize: "1rem",
              }}
            >
              {data.sector} | {data.subIndustry} | {data.exchange} |{" "}
              {data.country}
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>
                  Market Cap:{" "}
                  {millify(Number(data.marketCap), {
                    precision: 1,
                    locales: "en",
                  })}
                </p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Price Current: {data.price_current}</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Gross Margin: {data.gross_margin}%</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Net Margin: {data.net_margin}%</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>EPS Growth 5y: {data.eps_growth_past_5y}%</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Instrinic Price: {data.gfValue}</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>ROE: {data.roe}</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                }}
              >
                <p>Debt/Equity: {data.de}</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                  display: data.dividendYield ? "block" : "none",
                }}
              >
                <p>Dividend Yield: {data.dividendYield}%</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                  display: data.payoutRation ? "block" : "none",
                }}
              >
                <p>Payout Ratio: {data.payoutRation}%</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                  display: data.annualDividend ? "block" : "none",
                }}
              >
                <p>Annual Dividend: ${data.annualDividend}</p>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                  display: data.dividend_increase_track_record
                    ? "block"
                    : "none",
                }}
              >
                <p>
                  Dividend Increase Track Record:{" "}
                  {data.dividend_increase_track_record} years
                </p>
              </div>

              <div
                style={{
                  border: "1px solid var(--color-gray)",
                  borderRadius: "0.5rem",
                  width: "fit-content",
                  padding: "1rem",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <p>52 Year Range:</p>
                <div
                  style={{
                    width: "140px",
                    height: "25px",
                    border: "1px solid black",
                    borderRadius: "0.2rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: yearRange > 60 ? "red" : "green",
                      width: `${yearRange}%`,
                      height: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            <ChartTradingView data={data} />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Loader />
          </div>
        )}
      </Container>
    </>
  );
};

export default TickerPage;

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const ticker = (context.params?.ticker as string).toUpperCase();

//   const data = await supabaseClient
//     .from("stock")
//     .select()
//     .eq("ticker", ticker)
//     .single();

//   return { props: { data: data.data } };
// };
