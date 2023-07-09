export const convertTicker = (ticker: string | null | undefined) => {
  if (ticker) {
    return ticker.replace("-", ".");
  }
};
