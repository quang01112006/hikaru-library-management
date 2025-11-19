import {
  getAllCategoriesApi,
  getCategoryByIdApi,
  addCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
} from "../service/categoryService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoriesApi,
  });
};

export const useGetCategoryById = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => getCategoryByIdApi(id),
    enabled: !!id,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCategoryApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
