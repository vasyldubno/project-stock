import { ISupaStock } from "@/types/types";
import React, { FC, useEffect, useRef } from "react";

// @ts-ignore
let tvScriptLoadingPromise;

type Props = {
  data: ISupaStock;
};

export const ChartTradingView: FC<Props> = ({ data }) => {
  const onLoadScriptRef = useRef();

  // @ts-ignore
  useEffect(() => {
    // @ts-ignore
    onLoadScriptRef.current = createWidget;

    // @ts-ignore
    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      // @ts-ignore
      () => onLoadScriptRef.current && onLoadScriptRef.current()
    );

    // @ts-ignore
    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (
        document.getElementById("tradingview_4c89e") &&
        "TradingView" in window
      ) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol: `${data.exchange}:${data.ticker}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "light",
          style: "3",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_4c89e",
        });
      }
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview_4c89e" style={{ width: "100%", height: "500px" }} />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};
