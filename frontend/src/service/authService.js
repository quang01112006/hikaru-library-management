import axiosClient from "../api/axiosClient";

export const loginApi = (username, password) => {
  return axiosClient.post("/users/login", { username, password });
};

export const addUserApi = (userData) => {
  return axiosClient.post("/users", userData);
};

export const getAllUsersApi = () => {
  return axiosClient.get("/users");
};
export const updateUserApi = (userId, updateUserData) => {
  return axiosClient.put(`/users/${userId}`, updateUserData);
};
export const deleteUserApi = (userId) => {
  return axiosClient.delete(`/users/${userId}`);
};
