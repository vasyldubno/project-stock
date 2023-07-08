import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  // useEffect(() => {
  //   axios.get("/api/hello").then((res) => console.log(res));
  // }, []);

  return (
    <>
      <button
        onClick={async () => {
          const res = await axios.get("/api/add");
          console.log(res.data);
        }}
      >
        add
      </button>
    </>
  );
}
