import { API_BASE_URL } from '../config/constants.js';
import { apiRequest } from './apiClient.js';

export async function loginApi(username, password) {
    console.log("Gửi request đăng nhập với payload:", { username, password });
    return await apiRequest(`${API_BASE_URL}/auth/login`, 'POST', { username, password }, false);
}

export async function registerApi(username, password) {
    console.log("Gửi request đăng ký với payload:", { username, password });
    return await apiRequest(`${API_BASE_URL}/auth/register`, 'POST', { username, password }, false);
}
