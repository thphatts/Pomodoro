let currentUser = null;
let authToken = null;

export function initAuth() {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
        authToken = savedToken;
    }
}

export function getAuthToken() {
    return authToken;
}

export function setAuthData(user, token) {
    currentUser = user;
    authToken = token;
    localStorage.setItem('auth_token', token);
}

export function getCurrentUser() {
    return currentUser;
}

export function clearAuth() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('auth_token');
}
