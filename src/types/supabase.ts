export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      dividend: {
        Row: {
          amount_shares: number
          created_at: string | null
          dividendValue: number
          dividendYield: number
          id: string
          payDate: string
          ticker: string
          totalAmount: number
        }
        Insert: {
          amount_shares: number
          created_at?: string | null
          dividendValue: number
          dividendYield: number
          id?: string
          payDate: string
          ticker: string
          totalAmount: number
        }
        Update: {
          amount_shares?: number
          created_at?: string | null
          dividendValue?: number
          dividendYield?: number
          id?: string
          payDate?: string
          ticker?: string
          totalAmount?: number
        }
        Relationships: []
      }
      dividend_in_month: {
        Row: {
          April: number | null
          August: number | null
          created_at: string | null
          December: number | null
          February: number | null
          id: string
          January: number | null
          July: number | null
          June: number | null
          March: number | null
          May: number | null
          November: number | null
          October: number | null
          September: number | null
          year: number
        }
        Insert: {
          April?: number | null
          August?: number | null
          created_at?: string | null
          December?: number | null
          February?: number | null
          id?: string
          January?: number | null
          July?: number | null
          June?: number | null
          March?: number | null
          May?: number | null
          November?: number | null
          October?: number | null
          September?: number | null
          year: number
        }
        Update: {
          April?: number | null
          August?: number | null
          created_at?: string | null
          December?: number | null
          February?: number | null
          id?: string
          January?: number | null
          July?: number | null
          June?: number | null
          March?: number | null
          May?: number | null
          November?: number | null
          October?: number | null
          September?: number | null
          year?: number
        }
        Relationships: []
      }
      index: {
        Row: {
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          active_cost: number | null
          created_at: string | null
          dividends_in_months: Json | null
          free_cash: number | null
          gain_margin: number | null
          gain_value: number | null
          id: string
          market_cap: number | null
          title: string | null
          total_cost: number | null
          total_return: number | null
        }
        Insert: {
          active_cost?: number | null
          created_at?: string | null
          dividends_in_months?: Json | null
          free_cash?: number | null
          gain_margin?: number | null
          gain_value?: number | null
          id?: string
          market_cap?: number | null
          title?: string | null
          total_cost?: number | null
          total_return?: number | null
        }
        Update: {
          active_cost?: number | null
          created_at?: string | null
          dividends_in_months?: Json | null
          free_cash?: number | null
          gain_margin?: number | null
          gain_value?: number | null
          id?: string
          market_cap?: number | null
          title?: string | null
          total_cost?: number | null
          total_return?: number | null
        }
        Relationships: []
      }
      stock: {
        Row: {
          analystRatingBuy: number | null
          annualDividend: number | null
          created_at: string | null
          de: number | null
          dividendYield: number | null
          eps: number | null
          exchange: string | null
          gfValue: number | null
          gfValueMargin: number | null
          id: string
          index: string | null
          isDividendAristocrat: boolean
          isDividendKing: boolean
          marketCap: number | null
          name: string | null
          payoutRation: number | null
          pe: number | null
          price_current: number | null
          price_growth: number | null
          price_target: number | null
          report_date: string | null
          roe: number | null
          sector: string
          subIndustry: string
          ticker: string
        }
        Insert: {
          analystRatingBuy?: number | null
          annualDividend?: number | null
          created_at?: string | null
          de?: number | null
          dividendYield?: number | null
          eps?: number | null
          exchange?: string | null
          gfValue?: number | null
          gfValueMargin?: number | null
          id?: string
          index?: string | null
          isDividendAristocrat?: boolean
          isDividendKing?: boolean
          marketCap?: number | null
          name?: string | null
          payoutRation?: number | null
          pe?: number | null
          price_current?: number | null
          price_growth?: number | null
          price_target?: number | null
          report_date?: string | null
          roe?: number | null
          sector: string
          subIndustry: string
          ticker: string
        }
        Update: {
          analystRatingBuy?: number | null
          annualDividend?: number | null
          created_at?: string | null
          de?: number | null
          dividendYield?: number | null
          eps?: number | null
          exchange?: string | null
          gfValue?: number | null
          gfValueMargin?: number | null
          id?: string
          index?: string | null
          isDividendAristocrat?: boolean
          isDividendKing?: boolean
          marketCap?: number | null
          name?: string | null
          payoutRation?: number | null
          pe?: number | null
          price_current?: number | null
          price_growth?: number | null
          price_target?: number | null
          report_date?: string | null
          roe?: number | null
          sector?: string
          subIndustry?: string
          ticker?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_index_fkey"
            columns: ["index"]
            referencedRelation: "index"
            referencedColumns: ["id"]
          }
        ]
      }
      stock_portfolio: {
        Row: {
          amount_active_shares: number | null
          average_cost_per_share: number | null
          created_at: string | null
          dividend_upcoming_date: string | null
          dividend_upcoming_value: number | null
          exchange: string
          gain_unrealized_percentage: number | null
          gain_unrealized_value: number | null
          id: string
          is_trading: boolean | null
          last_change_portfolio: string | null
          lastDividendPayDate: string | null
          market_price: number | null
          perc_of_portfolio: number | null
          portfolio_id: string | null
          price_growth: number | null
          price_target: number | null
          startTradeDate: string | null
          ticker: string
          total_dividend_income: number | null
          total_return_margin: number | null
          total_return_value: number | null
        }
        Insert: {
          amount_active_shares?: number | null
          average_cost_per_share?: number | null
          created_at?: string | null
          dividend_upcoming_date?: string | null
          dividend_upcoming_value?: number | null
          exchange: string
          gain_unrealized_percentage?: number | null
          gain_unrealized_value?: number | null
          id?: string
          is_trading?: boolean | null
          last_change_portfolio?: string | null
          lastDividendPayDate?: string | null
          market_price?: number | null
          perc_of_portfolio?: number | null
          portfolio_id?: string | null
          price_growth?: number | null
          price_target?: number | null
          startTradeDate?: string | null
          ticker: string
          total_dividend_income?: number | null
          total_return_margin?: number | null
          total_return_value?: number | null
        }
        Update: {
          amount_active_shares?: number | null
          average_cost_per_share?: number | null
          created_at?: string | null
          dividend_upcoming_date?: string | null
          dividend_upcoming_value?: number | null
          exchange?: string
          gain_unrealized_percentage?: number | null
          gain_unrealized_value?: number | null
          id?: string
          is_trading?: boolean | null
          last_change_portfolio?: string | null
          lastDividendPayDate?: string | null
          market_price?: number | null
          perc_of_portfolio?: number | null
          portfolio_id?: string | null
          price_growth?: number | null
          price_target?: number | null
          startTradeDate?: string | null
          ticker?: string
          total_dividend_income?: number | null
          total_return_margin?: number | null
          total_return_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_portfolio_portfolio_id_fkey"
            columns: ["portfolio_id"]
            referencedRelation: "portfolio"
            referencedColumns: ["id"]
          }
        ]
      }
      test: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      transaction: {
        Row: {
          change: string
          count: number
          created_at: string | null
          date: string
          id: string
          price: number
          ticker: string
          type: string
        }
        Insert: {
          change: string
          count: number
          created_at?: string | null
          date: string
          id?: string
          price: number
          ticker: string
          type: string
        }
        Update: {
          change?: string
          count?: number
          created_at?: string | null
          date?: string
          id?: string
          price?: number
          ticker?: string
          type?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          username: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          username: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
