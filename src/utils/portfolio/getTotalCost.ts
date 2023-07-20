import { supabaseClient } from "@/config/supabaseClient";

export const getTotalCost = async () => {
  const response = await supabaseClient
    .from("transaction")
    .select()
    .eq("type", "buy");

  const result = Number(
    response.data
      ?.reduce((acc, item) => {
        return (acc += item.count * item.price);
      }, 0)
      ?.toFixed(2)
  );

  return result;
};
