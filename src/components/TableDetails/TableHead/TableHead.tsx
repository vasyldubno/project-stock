export const TableHead = ({ columns }: { columns: string[] }) => {
  return (
    <thead>
      <tr>
        {columns.map((item, index) => (
          <th
            key={index}
            style={{
              textAlign: "start",
              fontWeight: "normal",
              fontSize: "0.7rem",
              color: "#5b636a",
            }}
          >
            {item}
          </th>
        ))}
      </tr>
    </thead>
  );
};
