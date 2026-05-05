import { getAuthToken } from '../services/authService.js';

export async function apiRequest(url, method = 'GET', body = null, requireAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (requireAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: 'Không thể kết nối server' };
    }
}
