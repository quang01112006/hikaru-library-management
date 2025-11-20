import {
  getAllBooksApi,
  getBookByIdApi,
  addBookApi,
  updateBookApi,
  deleteBookApi,
} from "../service/bookService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
export const useGetBook = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: getAllBooksApi,
  });
};
export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBookApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateBookApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
export const useGetBookById = (bookId) => {
  return useQuery({
    queryKey: ["books", bookId],
    queryFn: () => getBookByIdApi(bookId),
    enabled: !!bookId, //ép kiểu về boolean, giúp chỉ chạy khi có id
  });
};
export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBookApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
