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

        // Hàm hiển thị trạng thái nhấc máy
        const showPickedUp = () => {
            dienThoai.classList.add('nut-an');
            dienThoaiNhac.classList.remove('nut-an');
        };

        // Hàm hiển thị trạng thái chưa nhấc (chỉ reset nếu chưa bấm chọn chính thức)
        const showUnpicked = () => {
            if (!isPickedUp) {
                dienThoai.classList.remove('nut-an');
                dienThoaiNhac.classList.add('nut-an');
            }
        };

        const togglePhone = () => {
            isPickedUp = !isPickedUp;
            if (isPickedUp) {
                showPickedUp();
                if (roomOverlay) roomOverlay.style.display = 'flex';
            } else {
                showUnpicked();
                if (roomOverlay) roomOverlay.style.display = 'none';
            }
        };

        // Hiệu ứng di chuột (Hover)
        dienThoai.addEventListener('mouseenter', showPickedUp);
        dienThoaiNhac.addEventListener('mouseleave', showUnpicked);

        // Click vẫn giữ nguyên logic cũ
        dienThoai.addEventListener('click', togglePhone);
        dienThoaiNhac.addEventListener('click', togglePhone);

        // Đóng bảng tạo phòng bằng nút X
        if (closeRoom && roomOverlay) {
            closeRoom.addEventListener('click', () => {
                isPickedUp = false;
                roomOverlay.style.display = 'none';
                dienThoai.classList.remove('nut-an');
                dienThoaiNhac.classList.add('nut-an');
            });
        }
    }

    // 6. Logic phòng học (Classroom)
    const btnNewRoom = document.getElementById('btn-new-room');
    const classroomOverlay = document.getElementById('classroom-overlay');
    const hangUpBtn = document.getElementById('hang-up-btn');
    
    // Timer elements
    const classroomTimerTxt = document.getElementById('classroom-timer');
    const startBtn = document.getElementById('classroom-start-btn');
    const classroomControls = document.getElementById('classroom-controls');
    const pauseBtn = document.getElementById('classroom-pause-btn');
    const stopBtn = document.getElementById('classroom-stop-btn');

    // Mới thêm
    const petRoomTimerTxt = document.getElementById('pet-room-timer-txt');
    const btnExpandView = document.getElementById('btn-expand-view');
    const mainViewContainer = document.getElementById('main-view-container');

    let classTimerInterval = null;
    let classSeconds = 25 * 60; // 25 phút
    let isClassTimerPaused = false;

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
    }

    function updateTimersDisplay(text) {
        if (classroomTimerTxt) classroomTimerTxt.innerText = text;
        if (petRoomTimerTxt) petRoomTimerTxt.innerText = text;
    }

    if (btnExpandView && mainViewContainer) {
        btnExpandView.addEventListener('click', () => {
            const isExpanded = mainViewContainer.classList.toggle('expanded-main-view');
            if (isExpanded) {
                btnExpandView.src = 'asset/phong_hoc/New room/Avatar-closure.png';
            } else {
                btnExpandView.src = 'asset/phong_hoc/New room/Avatar-extension.png';
            }
        });
    }

    if (btnNewRoom && classroomOverlay && roomOverlay) {
        btnNewRoom.addEventListener('click', () => {
            roomOverlay.style.display = 'none';
            classroomOverlay.style.display = 'flex';
            
            // Reset timer về 25:00
            clearInterval(classTimerInterval);
            classSeconds = 25 * 60;
            isClassTimerPaused = false;
            updateTimersDisplay('25:00');
            
            startBtn.classList.remove('nut-an');
            if (classroomControls) classroomControls.classList.add('nut-an');
        });
    }

    if (startBtn && pauseBtn && stopBtn) {
        startBtn.addEventListener('click', () => {
            startBtn.classList.add('nut-an');
            if (classroomControls) classroomControls.classList.remove('nut-an');

            isClassTimerPaused = false;
            clearInterval(classTimerInterval);
            classTimerInterval = setInterval(() => {
                if (!isClassTimerPaused) {
                    if (classSeconds > 0) {
                        classSeconds--;
                        updateTimersDisplay(formatTime(classSeconds));
                    } else {
                        clearInterval(classTimerInterval);
                        alert("Hết giờ học rồi!");
                    }
                }
            }, 1000);
        });

        pauseBtn.addEventListener('click', () => {
            isClassTimerPaused = !isClassTimerPaused;
            if (isClassTimerPaused) {
                pauseBtn.style.opacity = '0.6';
            } else {
                pauseBtn.style.opacity = '1';
            }
        });

        stopBtn.addEventListener('click', () => {
            clearInterval(classTimerInterval);
            classSeconds = 25 * 60;
            isClassTimerPaused = false;
            updateTimersDisplay('25:00');

            startBtn.classList.remove('nut-an');
            if (classroomControls) classroomControls.classList.add('nut-an');
            pauseBtn.style.opacity = '1';
        });
    }

    if (hangUpBtn) {
        hangUpBtn.addEventListener('click', () => {
            // Dừng timer
            clearInterval(classTimerInterval);
            
            // Ẩn phòng học
            if (classroomOverlay) classroomOverlay.style.display = 'none';
            
            // Hiện lại bảng tạo phòng
            if (roomOverlay) roomOverlay.style.display = 'flex';
        });
    }
}

// Chạy khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', khoiTaoUngDung);
