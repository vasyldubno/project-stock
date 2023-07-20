export const RowDividend = ({
  amountPerShare,
  amountShares,
  payDate,
  totalAmount,
}: {
  payDate: string;
  totalAmount: number;
  amountShares: number;
  amountPerShare: number;
}) => {
  return (
    <tr>
      <td>{payDate}</td>
      <td>{amountShares}</td>
      <td>{amountPerShare}</td>
      <td>{totalAmount}</td>
    </tr>
  );
};
