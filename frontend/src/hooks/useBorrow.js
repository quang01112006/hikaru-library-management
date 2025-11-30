import {
  useQuery,
  useMutation,
  useQueryClient,
  Mutation,
} from "@tanstack/react-query";
import {
  getBorrowHistoryApi,
  createBorrowRecordApi,
  returnBookApi,
  approveBorrowApi,
  getBorrowsByReaderIdApi,
  cancelBorrowApi,
} from "../service/borrowService";
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
export const useApproveBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveBorrowApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
export const useGetBorrowsByReader = (readerId) => {
  return useQuery({
    queryKey: ["borrows", "reader", readerId],
    queryFn: () => getBorrowsByReaderIdApi(readerId),
    enabled: !!readerId, // CHỈ CHẠY KHI CÓ ID
  });
};

export const useCancelBorrow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBorrowApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
    },
  });
};
