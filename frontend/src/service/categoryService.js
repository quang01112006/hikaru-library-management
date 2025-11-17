import axiosClient from "../api/axiosClient";

export const getAllCategoriesApi = () => {
  return axiosClient.get("/categories");
};
export const getCategoryByIdApi = (categoryId) => {
  return axiosClient.get(`/categories/${categoryId}`);
};
export const addCategoryApi = (categoryData) => {
  return axiosClient.post("/categories", categoryData);
};
export const updateCategoryApi = (categoryId, updateCategoryData) => {
  return axiosClient.put(`/categories/${categoryId}`, updateCategoryData);
};
export const deleteCategoryApi = (categoryId) => {
  return axiosClient.delete(`/categories/${categoryId}`);
};
