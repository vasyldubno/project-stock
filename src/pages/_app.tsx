import { StockProvider } from "@/providers/StockProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "react-query";

export default function App({ Component, pageProps }: AppProps) {
  const config: QueryClientConfig = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 3,
      },
    },
  };

  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <StockProvider>
          <Component {...pageProps} />
        </StockProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
