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
export const approveBorrowApi = (recordId) =>
  axiosClient.patch(`/borrows/${recordId}/approve`);
export const getBorrowsByReaderIdApi = (readerId) => {
  return axiosClient.get(`/borrows/reader/${readerId}`);
};