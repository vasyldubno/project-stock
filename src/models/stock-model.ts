import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    ticker: String,
    exchange: String,
    name: String,
    gics: {
      sector: String,
      subIndustry: String,
    },
    dateAdded: String,
    cik: String,
    yearFounded: String,
    priceCurrent: Number,
    priceTarget: Number,
    priceGrowth: Number,
    growthRevenue: Number,
    PE: Number,
    PEG: Number,
    marketCap: Number,
    dividendYield: Number,
    annualDividend: Number,
    payoutRation: Number,
    ROE: Number,
    GFValue: Number,
    GFValueMargin: Number,
    isDividendAristocrat: Boolean,
    isDividendKing: Boolean,
    analystRating: {
      buy: Number,
    },
    index: [String],
  },
  {
    timestamps: true,
  }
);

export const StockModel = mongoose.model("Kest", stockSchema);
