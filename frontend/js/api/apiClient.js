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
        
        // Kiểm tra xem phản hồi có phải là JSON không
        const contentType = response.headers.get("content-type");
        let data;
        
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
            if (!response.ok) {
                console.error('API Error Response:', data);
                // Đảm bảo luôn trả về status 'error' để UI dễ xử lý
                return { 
                    status: 'error', 
                    message: data.message || data.error || 'Đã có lỗi xảy ra',
                    details: data.details
                };
            }
            return data;
        } else {
            // Nếu không phải JSON (có thể là lỗi server trả về HTML hoặc No Content)
            if (response.ok) {
                return { status: 'success' };
            } else {
                const text = await response.text();
                console.error('API Non-JSON Error:', text);
                return { status: 'error', message: `Server error: ${response.status}` };
            }
        }
    } catch (error) {
        console.error('API Network/Fetch Error:', error);
        return { status: 'error', message: 'Không thể kết nối server' };
    }
}
