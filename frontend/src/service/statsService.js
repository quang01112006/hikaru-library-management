import axiosClient from "../api/axiosClient";

export const getStatsApi = () => {
  return axiosClient.get("/stats");
};
