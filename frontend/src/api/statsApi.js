
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stats'; 

export const fetchHomeData = async () => {
    try {
        const [statsRes, chartRes] = await Promise.all([
            axios.get(API_URL),        // Lấy Vùng 1 & Vùng 3
            axios.get(`${API_URL}/chart`), // Lấy Vùng 2
        ]);

        return {
            summary: statsRes.data.summary,
            overdueList: statsRes.data.overdueList,
            chartData: chartRes.data,
        };
    } catch (error) {
        console.error("Lỗi khi gọi API Trang Chủ:", error);
        return { summary: {}, overdueList: [], chartData: [] };
    }
};