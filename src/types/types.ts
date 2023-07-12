export interface IPortfolioStock {
  averageCostPerShare: number;
  exchange: string;
  gainRealizedPercentage: number;
  gainRealizedValue: number;
  gainUnrealizedPercentage: number;
  gainUnrealizedValue: number;
  id: string;
  isTrading: true;
  lastDividendPayDate: string;
  marketPrice: number;
  startTradeDate: string;
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
