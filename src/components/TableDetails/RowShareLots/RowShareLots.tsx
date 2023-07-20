export const RowShareLots = ({
  averagePrice,
  gain,
  marketPrice,
  shares,
  totalCost,
  tradeDate,
}: {
  tradeDate: string | null;
  shares: number | null;
  averagePrice: number | null;
  totalCost: number | null;
  marketPrice: number | null;
  gain: number | null;
}) => {
  return (
    <tr>
      <td>{tradeDate}</td>
      <td>{shares}</td>
      <td>{averagePrice}</td>
      <td>{totalCost}</td>
      <td>{marketPrice}</td>
      <td>{gain}</td>
    </tr>
  );
};
