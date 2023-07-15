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
          created_at: string | null
          dividendValue: number
          dividendYield: number
          id: string
          payDate: string
          ticker: string
          totalAmount: number
        }
        Insert: {
          created_at?: string | null
          dividendValue: number
          dividendYield: number
          id?: string
          payDate: string
          ticker: string
          totalAmount: number
        }
        Update: {
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
      stock: {
        Row: {
          analystRatingBuy: number | null
          annualDividend: number | null
          created_at: string | null
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
          priceGrowth: number | null
          priceTarget: number | null
          roe: number | null
          sector: string
          subIndustry: string
          ticker: string
        }
        Insert: {
          analystRatingBuy?: number | null
          annualDividend?: number | null
          created_at?: string | null
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
          priceGrowth?: number | null
          priceTarget?: number | null
          roe?: number | null
          sector: string
          subIndustry: string
          ticker: string
        }
        Update: {
          analystRatingBuy?: number | null
          annualDividend?: number | null
          created_at?: string | null
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
          priceGrowth?: number | null
          priceTarget?: number | null
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
          average_cost_per_share: number | null
          created_at: string | null
          dividendPercentage: number | null
          dividendValue: number | null
          exchange: string
          gain_unrealized_percentage: number | null
          gain_unrealized_value: number | null
          gainRealizedPercentage: number | null
          gainRealizedValue: number | null
          id: string
          is_trading: boolean | null
          lastDividendPayDate: string | null
          market_price: number | null
          startTradeDate: string | null
          ticker: string
        }
        Insert: {
          average_cost_per_share?: number | null
          created_at?: string | null
          dividendPercentage?: number | null
          dividendValue?: number | null
          exchange: string
          gain_unrealized_percentage?: number | null
          gain_unrealized_value?: number | null
          gainRealizedPercentage?: number | null
          gainRealizedValue?: number | null
          id?: string
          is_trading?: boolean | null
          lastDividendPayDate?: string | null
          market_price?: number | null
          startTradeDate?: string | null
          ticker: string
        }
        Update: {
          average_cost_per_share?: number | null
          created_at?: string | null
          dividendPercentage?: number | null
          dividendValue?: number | null
          exchange?: string
          gain_unrealized_percentage?: number | null
          gain_unrealized_value?: number | null
          gainRealizedPercentage?: number | null
          gainRealizedValue?: number | null
          id?: string
          is_trading?: boolean | null
          lastDividendPayDate?: string | null
          market_price?: number | null
          startTradeDate?: string | null
          ticker?: string
        }
        Relationships: []
      }
      transaction: {
        Row: {
          count: number
          created_at: string | null
          date: string
          id: string
          price: number
          ticker: string
          type: string
        }
        Insert: {
          count: number
          created_at?: string | null
          date: string
          id?: string
          price: number
          ticker: string
          type: string
        }
        Update: {
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
