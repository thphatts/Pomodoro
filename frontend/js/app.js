import { initAuth } from './services/authService.js';
import { initPlayer } from './services/playerService.js';
import { initAuthUI } from './ui/authUI.js';
import { initShopUI, capNhatTienUI, renderShop } from './ui/shopUI.js';
import { initPetUI, loadUserInfo } from './ui/petUI.js';
import { initTimerUI } from './ui/timerUI.js';
import { getAuthToken } from './services/authService.js';

function khoiTaoUngDung() {
    // 1. Khởi tạo các services state
    initAuth();
    initPlayer();

    // 2. Khởi tạo các UI controllers
    initAuthUI();
    initShopUI();
    initPetUI();
    initTimerUI();

    // 3. Tải thông tin ban đầu nếu đã có token
    if (getAuthToken()) {
        loadUserInfo();
    }

    // 4. Render UI lần đầu
    capNhatTienUI();
    renderShop();

    // 5. Logic điện thoại trên bàn
    const dienThoai = document.getElementById('dien-thoai-ban');
    const dienThoaiNhac = document.getElementById('dien-thoai-nhac');
    const roomOverlay = document.getElementById('room-overlay');
    const closeRoom = document.getElementById('close-room');

    if (dienThoai && dienThoaiNhac) {
        let isPickedUp = false;
        const togglePhone = () => {
            isPickedUp = !isPickedUp;
            if (isPickedUp) {
                dienThoai.classList.add('nut-an');
                dienThoaiNhac.classList.remove('nut-an');
                // Hiện bảng tạo phòng khi nhấc máy
                if (roomOverlay) roomOverlay.style.display = 'flex';
            } else {
                dienThoai.classList.remove('nut-an');
                dienThoaiNhac.classList.add('nut-an');
                // Ẩn bảng khi để máy xuống
                if (roomOverlay) roomOverlay.style.display = 'none';
            }
        };
        dienThoai.addEventListener('click', togglePhone);
        dienThoaiNhac.addEventListener('click', togglePhone);
    }

    // Đóng bảng tạo phòng bằng nút X
    if (closeRoom && roomOverlay) {
        closeRoom.addEventListener('click', () => {
            roomOverlay.style.display = 'none';
            // Đồng thời để điện thoại về trạng thái chưa nhấc
            const dienThoai = document.getElementById('dien-thoai-ban');
            const dienThoaiNhac = document.getElementById('dien-thoai-nhac');
            if (dienThoai && dienThoaiNhac) {
                dienThoai.classList.remove('nut-an');
                dienThoaiNhac.classList.add('nut-an');
            }
        });
    }
}

// Chạy khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', khoiTaoUngDung);
