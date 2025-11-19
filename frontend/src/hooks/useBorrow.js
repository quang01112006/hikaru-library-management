import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBorrowHistoryApi,
  createBorrowRecordApi,
  returnBookApi,
} from "../services/borrowService";
export const useGetBorrowHistory = () => {
  return useQuery({
    queryKey: ["borrows"],
    queryFn: getBorrowHistoryApi,
  });
};

export const useCreateBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBorrowRecordApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: returnBookApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
