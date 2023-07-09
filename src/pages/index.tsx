import axios from "axios";

export default function Home() {
  // useEffect(() => {
  //   axios.get("/api/hello").then((res) => console.log(res));
  // }, []);

  return (
    <>
      <div>
        <button
          onClick={async () => {
            const res = await axios.get("/api/hello");
            console.log(res.data);
          }}
        >
          /api/hello
        </button>
      </div>

      <div>
        <button
          onClick={async () => {
            const res = await axios.get("/api/market-cap");
            console.log(res.data);
          }}
        >
          /api/market-cap
        </button>
      </div>

      <div>
        <button
          onClick={async () => {
            const res = await axios.get("/api/price-current");
            console.log(res.data);
          }}
        >
          /api/price-current
        </button>
      </div>

      <div>
        <button
          onClick={async () => {
            const res = await axios.get("/api/price-target");
            console.log(res.data);
          }}
        >
          /api/price-target
        </button>
      </div>
    </>
  );
}
