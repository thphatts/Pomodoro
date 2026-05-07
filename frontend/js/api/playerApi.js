import { API_BASE_URL } from '../config/constants.js';
import { apiRequest } from './apiClient.js';

export async function fetchPlayerStatus() {
    return await apiRequest(`${API_BASE_URL}/status`, 'GET', null, true);
}

export async function saveSession(minutes) {
    return await apiRequest(`${API_BASE_URL}/session/save`, 'POST', { minutes }, true);
}

export async function buyItemApi(price, nutrition) {
    return await apiRequest(`${API_BASE_URL}/player/buy?price=${price}&nutrition=${nutrition}`, 'POST', null, true);
}
