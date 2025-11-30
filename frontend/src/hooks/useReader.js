import {
  getAllReadersApi,
  getReaderByIdApi,
  addReaderApi,
  updateReaderApi,
  deleteReaderApi,
  registerReaderApi,
} from "../service/readerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import axiosClient from "../api/axiosClient";

export const useGetReaders = () => {
  return useQuery({
    queryKey: ["readers"],
    queryFn: getAllReadersApi,
  });
};

export const useGetReaderById = (readerId) => {
  return useQuery({
    queryKey: ["readers", readerId],
    queryFn: () => getReaderByIdApi(readerId),
    enabled: !!readerId,
  });
};

export const useAddReader = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReaderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });
};
export const useUpdateReader = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateReaderApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });
};
export const useDeleteReader = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReaderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readers"] });
    },
  });
};

export const useLoginReader = () => {
  return useMutation({
    mutationFn: ({ email, password }) => {
      // Gọi API login riêng của Reader
      return axiosClient.post("/readers/login", { email, password });
    },
  });
};

export const useRegisterReader = () => {
  return useMutation({
    mutationFn: registerReaderApi,
    
  });
};
