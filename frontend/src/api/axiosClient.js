import axios from "axios";

const axiosClient = axios.create({ baseURL: "http://localhost:5001/api" });

// --- 1. GẮN THẺ (Request) ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. XỬ LÝ LỖI (Response) ---
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;

    //Tự động đá về Login nếu Token hết hạn/không hợp lệ
    if (response && response.status === 401) {
      // 1. Xóa Token rác đi
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // 2. Đá về trang login

      window.location.href = "/login";
    }

    console.error("API Error:", error.response?.data?.message || error.message);
    throw error;
  }
);

export default axiosClient;
