import { supabaseClient } from "@/config/supabaseClient";
import { ISupaScreener } from "@/types/types";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateScreener = () => {
  const queryClient = useQueryClient();

  const updateScreener = useMutation<
    any,
    any,
    {
      value: string;
      field: keyof ISupaScreener;
      screener: ISupaScreener | null;
    },
    any
  >({
    mutationKey: ["updateScreener"],
    mutationFn: async ({ field, value, screener }) => {
      const res = await supabaseClient
        .from("screener")
        .update({
          [field]: value,
        })
        .eq("id", screener?.id)
        .select();

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["screeners"]);
    },
  });
  return updateScreener;
};
