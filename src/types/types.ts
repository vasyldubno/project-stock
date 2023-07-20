export interface IPortfolioStock {
  amount_active_shares: number | null;
  average_cost_per_share: number | null;
  created_at: string | null;
  exchange: string;
  gain_unrealized_percentage: number | null;
  gain_unrealized_value: number | null;
  id: string;
  is_trading: boolean | null;
  lastDividendPayDate: string | null;
  market_price: number | null;
  portfolio_id: string | null;
  startTradeDate: string | null;
  ticker: string;
  total_dividend_income: number | null;
  total_return_margin: number | null;
  total_return_value: number | null;
  price_target: number | null;
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

export interface ISupaStock {
  analystRatingBuy: number | null;
  annualDividend: number | null;
  created_at: string | null;
  dividendYield: number | null;
  eps: number | null;
  exchange: string | null;
  gfValue: number | null;
  gfValueMargin: number | null;
  id: string;
  index: string | null;
  isDividendAristocrat: boolean;
  isDividendKing: boolean;
  marketCap: number | null;
  name: string | null;
  payoutRation: number | null;
  pe: number | null;
  price_current: number | null;
  price_growth: number | null;
  price_target: number | null;
  roe: number | null;
  sector: string;
  subIndustry: string;
  ticker: string;
  report_date: string | null;
}
