import { loginApi, registerApi } from '../api/authApi.js';
import { setAuthData } from '../services/authService.js';
import { thongBaoShop } from './shopUI.js';
import { openChooseCatModal } from './petUI.js';

export function initAuthUI() {
    const nutReady = document.getElementById('nut-ready');
    const manHinhBatDau = document.getElementById('man-hinh-bat-dau');
    const manHinhGameChinh = document.getElementById('man-hinh-game-chinh');
    const signupOverlay = document.getElementById('signup-overlay');
    const loginOverlay = document.getElementById('login-overlay');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const btnSignup = document.getElementById('btn-signup');
    const closeSignup = document.getElementById('close-signup');

    const loginUsernameInput = document.getElementById('login-username-input');
    const loginPasswordInput = document.getElementById('login-password-input');
    const btnLogin = document.getElementById('btn-login');
    const closeLogin = document.getElementById('close-login');

    const linkDangNhap = document.getElementById('link-login');
    const linkDangKy = document.getElementById('link-signup');

    if (nutReady) {
        nutReady.addEventListener('click', function() {
            if (manHinhBatDau) manHinhBatDau.classList.replace('man-hinh-hien', 'man-hinh-an');
            if (manHinhGameChinh) manHinhGameChinh.classList.replace('man-hinh-an', 'man-hinh-hien');
            if (signupOverlay) signupOverlay.style.display = 'flex';
        });
    }

    if (btnSignup) {
        btnSignup.addEventListener('click', async function() {
            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value.trim() : '';
            
            if (!username || !password) {
                thongBaoShop('Vui lòng nhập đầy đủ thông tin!', 'error');
                return;
            }
            
            const registerResult = await registerApi(username, password);
            
            if (registerResult.status === 'success') {
                thongBaoShop('Đăng ký thành công! Đang đăng nhập...', 'ok');
                
                const loginResult = await loginApi(username, password);
                
                if (loginResult.status === 'success' && loginResult.token) {
                    setAuthData({ id: loginResult.userId, username: loginResult.username }, loginResult.token);
                    if (signupOverlay) signupOverlay.style.display = 'none';
                    openChooseCatModal();
                } else {
                    thongBaoShop('Đăng ký thành công! (Chế độ offline)', 'ok');
                    if (signupOverlay) signupOverlay.style.display = 'none';
                    openChooseCatModal();
                }
            } else {
                thongBaoShop(registerResult.message || 'Đăng ký thất bại!', 'error');
            }
        });
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', async function() {
            const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
            const password = loginPasswordInput ? loginPasswordInput.value.trim() : "";

            if (!username || !password) {
                thongBaoShop("Vui lòng nhập đầy đủ thông tin!", "error");
                return;
            }

            const loginResult = await loginApi(username, password);

            if (loginResult.status === "success" && loginResult.token) {
                setAuthData({ id: loginResult.userId, username: loginResult.username }, loginResult.token);
                if (loginOverlay) loginOverlay.style.display = "none";
                openChooseCatModal();
            } else {
                thongBaoShop(loginResult.message || "Đăng nhập thất bại!", "error");
            }
        });
    }

    if (linkDangNhap) {
        linkDangNhap.addEventListener('click', function(e) {
            e.preventDefault();
            if (signupOverlay) signupOverlay.style.display = 'none';
            if (loginOverlay) loginOverlay.style.display = 'flex';
        });
    }

    if (linkDangKy) {
        linkDangKy.addEventListener('click', function(e) {
            e.preventDefault();
            if (loginOverlay) loginOverlay.style.display = 'none';
            if (signupOverlay) signupOverlay.style.display = 'flex';
        });
    }

    if (closeSignup) {
        closeSignup.addEventListener('click', function() {
            if (signupOverlay) signupOverlay.style.display = 'none';
        });
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            if (loginOverlay) loginOverlay.style.display = 'none';
        });
    }
}
