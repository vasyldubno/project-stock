import axios from "axios";

interface IResponse {
  c: number;
}

export const getPriceCurrent = async (ticker: string) => {
  const response = await axios.get<IResponse>(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=cenkaeiad3i2t1u14mvgcenkaeiad3i2t1u14n00`
  );

  return Number(response.data.c.toFixed(2));
};
