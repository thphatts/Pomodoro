import { startTimer, pauseTimer, resetTimer, getTimerState, setMacDinhPhut, formatTime } from '../services/timerService.js';
import { saveSession } from '../api/playerApi.js';
import { updatePlayerData, addOfflineReward } from '../services/playerService.js';
import { capNhatTienUI, capNhatThanhNangLuong, thongBaoShop } from './shopUI.js';
import { getSkins, startJumpAnimation, stopJumpAnimation } from './petUI.js';

let nutStart, nutStop, nutPause, hinhMeo, bang, hienThi, nutCaiDat;
let timePopupOverlay, currentTimeVal;

export function initTimerUI() {
    nutStart = document.getElementById('nut-bat-dau');
    nutStop = document.getElementById('nut-stop');
    nutPause = document.getElementById('nut-pause');
    hinhMeo = document.getElementById('meo-chinh');
    bang = document.getElementById('cum-dem-gio');
    hienThi = document.getElementById('so-giay');
    nutCaiDat = document.getElementById('nut-cai-dat');
    
    timePopupOverlay = document.getElementById('time-popup-overlay');
    currentTimeVal = document.getElementById('current-time-val');

    if (nutStart) nutStart.addEventListener('click', handleStartClick);
    if (nutStop) nutStop.addEventListener('click', handleStopClick);
    if (nutPause) nutPause.addEventListener('click', handlePauseClick);

    // Settings
    const closePopup = document.getElementById('close-popup');
    const okConfirm = document.getElementById('ok-confirm');
    const nutGiamTime = document.getElementById('giam-time');
    const nutTangTime = document.getElementById('tang-time');

    if (nutCaiDat) {
        nutCaiDat.addEventListener('click', () => {
            hienThiChuThoiGianPopup();
            if (timePopupOverlay) timePopupOverlay.style.display = 'flex';
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', () => {
            if (timePopupOverlay) timePopupOverlay.style.display = 'none';
        });
    }

    if (okConfirm) {
        okConfirm.addEventListener('click', () => {
            resetTimer();
            datLaiGiaoDien();
            const state = getTimerState();
            if (hienThi) hienThi.innerText = formatTime(state.macDinhPhut);
            if (timePopupOverlay) timePopupOverlay.style.display = 'none';
            
            let barThucAn = document.getElementById('bar-thuc-an');
            let barCamXuc = document.getElementById('bar-cam-xuc');
            if (barThucAn) barThucAn.style.width = '100%';
            if (barCamXuc) barCamXuc.style.width = '100%';
        });
    }

    if (nutTangTime) {
        nutTangTime.addEventListener('click', () => {
            let state = getTimerState();
            let newTime = state.macDinhPhut + 5;
            if (newTime > 120) newTime = 120;
            setMacDinhPhut(newTime);
            hienThiChuThoiGianPopup();
        });
    }

    if (nutGiamTime) {
        nutGiamTime.addEventListener('click', () => {
            let state = getTimerState();
            let newTime = state.macDinhPhut - 5;
            if (newTime < 1) newTime = 1;
            setMacDinhPhut(newTime);
            hienThiChuThoiGianPopup();
        });
    }
}

function hienThiChuThoiGianPopup() {
    if (currentTimeVal) {
        const state = getTimerState();
        currentTimeVal.innerText = formatTime(state.macDinhPhut);
    }
}

function handleStartClick() {
    if (nutStart) {
        nutStart.classList.add('nut-an');
        nutStart.classList.remove('nut-start-hien');
    }
    
    if (nutStop) nutStop.classList.remove('nut-an');
    if (nutPause) {
        nutPause.classList.remove('nut-an');
        nutPause.style.opacity = "1";
    }
    
    const { skinMeoDung } = getSkins();
    if (hinhMeo) hinhMeo.src = skinMeoDung;
    
    if (bang) {
        bang.classList.remove('bang-an');
        bang.classList.add('bang-hien');
    }
    
    const bangTien = document.getElementById('bang-tien');
    if (bangTien) bangTien.classList.add('nut-an');
    
    const manHinhShop = document.getElementById('man-hinh-shop');
    if (manHinhShop) {
        manHinhShop.classList.remove('shop-hien');
        manHinhShop.classList.add('shop-an');
    }
    
    const nutShop = document.getElementById('mo-shop');
    const nutViTop = document.getElementById('mo-vi');
    if (nutShop) nutShop.style.pointerEvents = "none";
    if (nutViTop) nutViTop.style.pointerEvents = "none";
    if (nutCaiDat) nutCaiDat.style.pointerEvents = "none";
    
    const state = getTimerState();
    if (hienThi) hienThi.innerText = formatTime(state.macDinhPhut);
    
    startTimer(
        (phut, giay, phanTram) => {
            if (hienThi) hienThi.innerText = formatTime(phut, giay);
            let barThucAn = document.getElementById('bar-thuc-an');
            let barCamXuc = document.getElementById('bar-cam-xuc');
            if (barThucAn) barThucAn.style.width = phanTram + '%';
            if (barCamXuc) barCamXuc.style.width = phanTram + '%';
        },
        () => xuLyHoanThanhPomodoro()
    );
}

function handleStopClick() {
    resetTimer();
    const state = getTimerState();
    if (hienThi) hienThi.innerText = formatTime(state.macDinhPhut);
    datLaiGiaoDien();
    
    let barThucAn = document.getElementById('bar-thuc-an');
    let barCamXuc = document.getElementById('bar-cam-xuc');
    if (barThucAn) barThucAn.style.width = '100%';
    if (barCamXuc) barCamXuc.style.width = '100%';
}

function handlePauseClick() {
    const state = getTimerState();
    const { skinMeoNgu, skinMeoDung } = getSkins();

    if (!state.dangTamDung) {
        pauseTimer();
        if (hinhMeo) hinhMeo.src = skinMeoNgu;
        if (nutPause) nutPause.style.opacity = "0.6";
    } else {
        startTimer(
            (phut, giay, phanTram) => {
                if (hienThi) hienThi.innerText = formatTime(phut, giay);
                let barThucAn = document.getElementById('bar-thuc-an');
                let barCamXuc = document.getElementById('bar-cam-xuc');
                if (barThucAn) barThucAn.style.width = phanTram + '%';
                if (barCamXuc) barCamXuc.style.width = phanTram + '%';
            },
            () => xuLyHoanThanhPomodoro()
        );
        if (hinhMeo) hinhMeo.src = skinMeoDung;
        if (nutPause) nutPause.style.opacity = "1";
    }
}

async function xuLyHoanThanhPomodoro() {
    startJumpAnimation();
    let bangDone = document.getElementById('bang-done');
    if (bangDone) {
        bangDone.classList.remove('nut-an');
    }
    
    const state = getTimerState();
    const minutes = state.macDinhPhut;
    const data = await saveSession(minutes);
    
    if (data && data.status === 'success') {
        updatePlayerData(data.totalCoins, undefined, data.petHappiness);
        capNhatTienUI();
        capNhatThanhNangLuong();
        
        const tienThuong = data.coinsEarned;
        thongBaoShop(`+${tienThuong} xu! 🎉`, 'ok');
    } else {
        const tienThuong = addOfflineReward(minutes);
        capNhatTienUI();
        thongBaoShop(`+${tienThuong} xu! 🎉`, 'ok');
    }
    
    setTimeout(() => {
        datLaiGiaoDien();
        stopJumpAnimation();
        if (bangDone) bangDone.classList.add('nut-an');
    }, 4000);
}

export function datLaiGiaoDien() {
    const nutShop = document.getElementById('mo-shop');
    const nutViTop = document.getElementById('mo-vi');
    const { skinMeoNgu } = getSkins();

    if (nutStart) {
        nutStart.classList.remove('nut-an');
        nutStart.classList.add('nut-start-hien');
        nutStart.style.pointerEvents = "auto";
        nutStart.style.opacity = "1";
    }
    if (nutStop) nutStop.classList.add('nut-an');
    if (nutPause) nutPause.classList.add('nut-an');
    
    if (bang) {
        bang.classList.add('bang-an');
        bang.classList.remove('bang-hien');
    }
    if (hinhMeo) hinhMeo.src = skinMeoNgu;
    
    if (nutShop) nutShop.style.pointerEvents = "auto";
    if (nutViTop) nutViTop.style.pointerEvents = "auto";
    
    if (nutCaiDat) {
        nutCaiDat.style.setProperty('visibility', 'visible', 'important');
        nutCaiDat.style.setProperty('opacity', '1', 'important');
        nutCaiDat.style.pointerEvents = "auto";
    }
}

export function hienUIChinh() {
    const nutShop = document.getElementById('mo-shop');
    const nutViTop = document.getElementById('mo-vi');
    
    [nutShop, nutViTop, nutCaiDat].forEach((nut) => {
        if (nut) {
            nut.classList.remove('nut-an');
            nut.style.setProperty('visibility', 'visible', 'important');
            nut.style.setProperty('opacity', '1', 'important');
            nut.style.pointerEvents = 'auto';
        }
    });
}
