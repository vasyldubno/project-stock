export interface IPortfolioStock {
  // averageCostPerShare: number;
  // exchange: string;
  // gainRealizedPercentage: number;
  // gainRealizedValue: number;
  // gainUnrealizedPercentage: number;
  // gainUnrealizedValue: number;
  // id: string;
  // isTrading: true;
  // lastDividendPayDate: string;
  // marketPrice: number;
  // startTradeDate: string;
  // ticker: string;
  // dividendValue: null | number;
  // dividendPercentage: null | number;
  average_cost_per_share: number | null;
  created_at: string | null;
  dividendPercentage: number | null;
  dividendValue: number | null;
  exchange: string;
  gainRealizedPercentage: number | null;
  gainRealizedValue: number | null;
  gain_unrealized_percentage: number | null;
  gain_unrealized_value: number | null;
  id: string;
  is_trading: boolean | null;
  lastDividendPayDate: string | null;
  market_price: number | null;
  startTradeDate: string | null;
  ticker: string;
}

interface INasdaqDividends {
  data: {
    dividends: {
      rows: {
        exOrEffDate: string;
        type: string;
        amount: string;
        declarationDate: string;
        recordDate: string;
        paymentDate: string;
        currency: string;
      }[];
    };
  };
}
