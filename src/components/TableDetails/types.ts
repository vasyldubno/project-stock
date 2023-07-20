export interface Dividend {
  payDate: string;
  totalAmount: number;
  amountShares: number;
  amountPerShare: number;
}

export interface Transaction {
  count: number;
  price: number;
  date: string;
  type: string;
}

export interface ShareLots {
  tradeDate: string | null;
  shares: number | null;
  averagePrice: number | null;
  totalCost: number | null;
  marketPrice: number | null;
  gain: number | null;
}
