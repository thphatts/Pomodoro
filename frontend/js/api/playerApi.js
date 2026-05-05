import { API_BASE_URL } from '../config/constants.js';
import { apiRequest } from './apiClient.js';

export async function fetchPlayerStatus() {
    // return await apiRequest(`${API_BASE_URL}/status`, 'GET', null, true);
    console.log("Mock fetchPlayerStatus");
    return new Promise(resolve => setTimeout(() => resolve({
        status: 'success',
        coins: 500,
        userPets: [
            { petId: 1, name: 'Cún Corgi', level: 2, health: 80, happiness: 90, isCurrent: true }
        ],
        inventory: []
    }), 300));
}

export async function saveSession(minutes) {
    // return await apiRequest(`${API_BASE_URL}/session/save`, 'POST', { minutes }, true);
    console.log("Mock saveSession:", minutes);
    return new Promise(resolve => setTimeout(() => resolve({
        status: 'success',
        earnedCoins: minutes * 2,
        message: 'Lưu session thành công (Mock)'
    }), 300));
}

export async function buyItemApi(price, nutrition) {
    // return await apiRequest(`${API_BASE_URL}/player/buy?price=${price}&nutrition=${nutrition}`, 'POST', null, true);
    console.log("Mock buyItemApi:", price, nutrition);
    return new Promise(resolve => setTimeout(() => resolve({
        status: 'success',
        message: 'Mua vật phẩm thành công (Mock)'
    }), 300));
}
