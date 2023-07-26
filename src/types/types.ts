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
  price_growth: number | null;
  perc_of_portfolio: number | null;
  dividend_upcoming_date: string | null;
  dividend_upcoming_value: number | null;
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

export interface ISupaDividendsInMonth {
  [key: string]: {
    January?: number;
    February?: number;
    March?: number;
    April?: number;
    May?: number;
    June?: number;
    July?: number;
    August?: number;
    September?: number;
    October?: number;
    November?: number;
    December?: number;
  };
}

export interface ISupaTransaction {
  count: number;
  created_at: string | null;
  date: string;
  id: string;
  price: number;
  ticker: string;
  type: string;
  change: string;
}

export interface ISupaPortfolio {
  active_cost: number | null;
  created_at: string | null;
  free_cash: number | null;
  gain_margin: number | null;
  gain_value: number | null;
  id: string;
  market_cap: number | null;
  title: string | null;
  total_cost: number | null;
  total_return: number | null;
}
