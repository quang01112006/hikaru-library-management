import axiosClient from "../api/axiosClient";

export const getBorrowHistoryApi = () => {
  return axiosClient.get("/borrows");
};
export const createBorrowRecordApi = (data) => {
  return axiosClient.post("/borrows", data);
};
export const returnBookApi = (recordId) => {
  return axiosClient.patch(`/borrows/${recordId}/return`);
};
