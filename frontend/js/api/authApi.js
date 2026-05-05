import { API_BASE_URL } from '../config/constants.js';
import { apiRequest } from './apiClient.js';

export async function loginApi(username, password) {
    // MOCK DATA: Bỏ qua gọi API thực tế
    // return await apiRequest(`${API_BASE_URL}/auth/login`, 'POST', { username, password }, false);
    
    console.log("Mock login cho user:", username);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === "" || password === "") {
                resolve({ status: 'error', message: 'Vui lòng nhập đầy đủ thông tin (Mock)' });
                return;
            }
            resolve({
                status: 'success',
                token: 'mock-jwt-token-12345',
                userId: 999,
                username: username,
                message: 'Đăng nhập giả lập thành công'
            });
        }, 500); // Giả lập độ trễ mạng 0.5s
    });
}

export async function registerApi(username, password) {
    // MOCK DATA: Bỏ qua gọi API thực tế
    // return await apiRequest(`${API_BASE_URL}/auth/register`, 'POST', { username, password }, false);
    
    console.log("Mock register cho user:", username);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (username === "" || password === "") {
                resolve({ status: 'error', message: 'Vui lòng nhập đầy đủ thông tin (Mock)' });
                return;
            }
            resolve({
                status: 'success',
                message: 'Đăng ký giả lập thành công'
            });
        }, 500); // Giả lập độ trễ mạng 0.5s
    });
}
