import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  getAllUsersApi,
  addUserApi,
  deleteUserApi,
} from "../services/authService";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }) => loginApi(username, password),
  });
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersApi,
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
