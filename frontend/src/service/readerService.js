import axiosClient from "../api/axiosClient";

export const getAllReadersApi = () => {
  return axiosClient.get("/readers");
};
export const getReaderByIdApi = (readerId) => {
  return axiosClient.get(`/readers/${readerId}`);
};
export const addReaderApi = (readerData) => {
  return axiosClient.post("/readers", readerData);
};
export const updateReaderApi = (readerId, updateReaderData) => {
  return axiosClient.put(`/readers/${readerId}`, updateReaderData);
};
export const deleteReaderApi = (readerId) => {
  return axiosClient.delete(`/readers/${readerId}`);
};

export const registerReaderApi = (data) => {
  // data gồm: { name, email, password, phone }
  return axiosClient.post("/readers/register", data);
};
