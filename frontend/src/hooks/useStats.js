import { useQuery } from "@tanstack/react-query";
import { getStatsApi } from "../service/statsService";

export const useGetStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStatsApi,
    refetchOnWindowFocus: true,
  });
};
