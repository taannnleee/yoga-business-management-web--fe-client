import axios from 'axios';
import { API_URL } from "@/config/url";

// Tạo instance của Axios
const axiosInstance = axios.create({
    baseURL: `${API_URL}`, // Địa chỉ API của bạn
});

// Giả sử bạn lưu token trong localStorage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');


const setAccessToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
};
const removeAccessToken = () => localStorage.removeItem('accessToken');

// Hàm refresh token
const refreshToken = async () => {
    console.log("refresh token nè")
    try {
        const refresh_token = getRefreshToken();
        const response = await axiosInstance.post('/api/auth/refresh', {}, {
            headers: {
                'x-token': `Bearer ${refresh_token}` // Truyền refresh token trong header
            }
        });
        const { accesstoken } = response.data;
        setAccessToken(accesstoken); // Cập nhật token mới
        return accesstoken;
    } catch (error) {
        console.error('Refresh token failed', error);
        removeAccessToken();
        window.location.href = '/login';
    }
};

// Interceptor Request - Thêm token vào header mỗi yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor Response - Kiểm tra lỗi 401 (Token hết hạn)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu yêu cầu này đã thử lại
            const newToken = await refreshToken(); // Làm mới token
            axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`; // Cập nhật lại token trong header
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Cập nhật lại token cho yêu cầu gốc
            return axiosInstance(originalRequest); // Thử lại yêu cầu gốc với token mới
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
