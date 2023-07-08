import { useEffect } from "react";
import axios from "axios";
import { getXataClient } from "@/types/xata";

export default function Home() {
  // useEffect(() => {
  //   axios.get("/api/hello").then((res) => console.log(res));
  // }, []);

  return (
    <>
      <button
        onClick={async () => {
          // const res = await axios.get("/api/add");
          // console.log(res.data);

          try {
            console.log("XATA");
            const xata = getXataClient();
            const a = await xata.db.stock
              .select(["gics.sector.name", "gics.subIndustry.name"])
              .getMany();
            console.log(a);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        add
      </button>
    </>
  );
}
