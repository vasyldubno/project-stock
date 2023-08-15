export interface ISupaStockPortfolio {
  amount_active_shares: number | null;
  average_cost_per_share: number | null;
  created_at: string | null;
  exchange: string;
  gain_margin: number | null;
  gain_value: number | null;
  id: string;
  is_trading: boolean | null;
  lastDividendPayDate: string | null;
  portfolio_id: string | null;
  startTradeDate: string | null;
  ticker: string;
  total_dividend_income: number | null;
  total_return_margin: number | null;
  total_return_value: number | null;
  price_current: number | null;
  price_target: number | null;
  price_growth: number | null;
  dividend_upcoming_date: string | null;
  dividend_upcoming_value: number | null;
  perc_of_portfolio: number;
  last_change_portfolio: string | null;
  price_growth_todat_perc?: number | null;
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
  beta: number | null;
  country: string | null;
  created_at: string | null;
  de: number | null;
  dividend_increase_track_record: number | null;
  dividend_upcoming_date: string | null;
  dividend_upcoming_value: number | null;
  dividendYield: number | null;
  eps_growth_past_5y: number | null;
  exchange: string;
  gfValue: number | null;
  gfValueMargin: number | null;
  gross_margin: number | null;
  id: string;
  index: string | null;
  is_dividend: boolean;
  isDividendAristocrat: boolean;
  isDividendKing: boolean;
  marketCap: number | null;
  name: string | null;
  net_margin: number | null;
  payoutRation: number | null;
  pe: number | null;
  price_current: number | null;
  price_growth: number | null;
  price_growth_today_perc: number | null;
  price_target: number | null;
  price_year_high: number | null;
  report_date: string | null;
  roe: number | null;
  sector: string;
  subIndustry: string;
  ticker: string;
  yearRange?: number;
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
  change: string;
  count: number;
  created_at: string | null;
  date: string;
  id: string;
  portfolio_id: string;
  price: number;
  ticker: string;
  type: string;
}

export interface ISupaPortfolio {
  cost: number;
  created_at: string;
  gain_margin: number;
  gain_value: number;
  id: string;
  title: string;
  user_id: string;
  value: number;
}

export interface IPortfolio {
  cost: number;
  value: number;
  gainValue: number;
  gainMargin: number;
  title: string;
  userId: string;
  id: string;
}

export interface IStockPortfolio {
  amountActiveShares: number;
  averageCostPerShare: number;
  exchange: string;
  gainMargin: number;
  gainValue: number;
  isTrading: boolean;
  lastChangePortfolio: string;
  portfolioId: string;
  priceCurrent: number;
  priceGrowth: number;
  priceTarget: number;
  startTradeDate: string;
  ticker: string;
  percOfPortfolio?: number;
  totalReturnMargin?: number | null;
  totalReturnValue?: number | null;
  lastDividendPayDate?: string | null;
  totalDividendIncome?: number | null;
  dividendUpcomingDate?: string | null;
  dividendUpcomingValue?: number | null;
}

export interface IStock {
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
  name: string;
  payoutRation: number | null;
  pe: number | null;
  priceCurrent: number | null;
  priceGrowth: number | null;
  priceTarget: number | null;
  roe: number | null;
  sector: string;
  subIndustry: string;
  ticker: string;
  reportDate: string | null;
  intrinsicMargin: number | null;
  intrinsicValue: number | null;
}

export interface ISupaScreener {
  id: string;
  created_at: string;
  user_id: string;
  pe: string | null;
  title: string;
  roe: string | null;
  de: string | null;
  priceGrowth: string | null;
  margin_safety: string | null;
  analyst: string | null;
  industry: string | null;
  sector: string | null;
  payout_ratio: string | null;
  dividend_yield: string | null;
}

export interface ISupaExit {
  id: string;
  created_at: string;
  portfolio_id: string;
  ticker: string;
  profit_value: number;
  profit_margin: number;
  start_date: string;
  finish_date: string;
  average_price_per_share: number;
  cost: number;
  return: number;
}

export interface IUser {
  email: string | null;
  id: string | null;
}

export interface ISupaDividend {
  amount_shares: number;
  created_at: string | null;
  dividendValue: number;
  dividendYield: number;
  id: string;
  payDate: string;
  portfolio_id: string;
  ticker: string;
  totalAmount: number;
  year: number;
}
