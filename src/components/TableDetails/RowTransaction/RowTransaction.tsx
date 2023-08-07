import moment from "moment";

export const RowTransaction = ({
  count,
  date,
  price,
  type,
}: {
  count: number;
  price: number;
  date: string;
  type: string;
}) => {
  return (
    <tr>
      <td style={{ fontWeight: "bold" }}>{type.toUpperCase()}</td>
      <td>{moment(date).format("DD.MM.YYYY")}</td>
      <td>{count}</td>
      <td>{price}</td>
    </tr>
  );
};
