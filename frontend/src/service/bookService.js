import axiosClient from "../api/axiosClient";

export const getAllBooksApi = () => {
  return axiosClient.get("/books");
};
export const getBookByIdApi = (bookId) => {
  return axiosClient.get(`/books/${bookId}`);
};
export const addBookApi = (bookData) => {
  return axiosClient.post("/books", bookData);
};
export const updateBookApi = (bookId, updateBookData) => {
  return axiosClient.put(`/books/${bookId}`, updateBookData);
};
export const deleteBookApi = (bookId) => {
  return axiosClient.delete(`/books/${bookId}`);
};
