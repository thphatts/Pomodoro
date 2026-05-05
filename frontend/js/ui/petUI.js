import { DANH_SACH_MEO } from '../config/constants.js';
import { fetchPlayerStatus } from '../api/playerApi.js';
import { updatePlayerData, getPlayerStats } from '../services/playerService.js';
import { getAuthToken } from '../services/authService.js';
import { capNhatTienUI, capNhatThanhNangLuong } from './shopUI.js';
import { hienUIChinh } from './timerUI.js';

let chiSoMeoHienTai = 0;
let skinMeoNgu = 'asset/meongu.gif';
let skinMeoDung = 'asset/meodung.gif';
let skinMeoAn = 'asset/meoan.gif';

export function getSkins() {
    return { skinMeoNgu, skinMeoDung, skinMeoAn };
}

export function initPetUI() {
    const popupChoose = document.getElementById('choose-meow-overlay');
    const btnNextMeow = document.getElementById('next-meow');
    const btnPrevMeow = document.getElementById('prev-meow');
    const btnChooseCat = document.getElementById('btn-choose-cat');
    const hinhMeo = document.getElementById('meo-chinh');
    const nutStart = document.getElementById('nut-bat-dau');

    if (btnNextMeow) {
        btnNextMeow.addEventListener('click', () => {
            chiSoMeoHienTai = (chiSoMeoHienTai + 1) % DANH_SACH_MEO.length;
            capNhatHinhMeo();
        });
    }

    if (btnPrevMeow) {
        btnPrevMeow.addEventListener('click', () => {
            chiSoMeoHienTai = (chiSoMeoHienTai - 1 + DANH_SACH_MEO.length) % DANH_SACH_MEO.length;
            capNhatHinhMeo();
        });
    }

    if (btnChooseCat) {
        btnChooseCat.addEventListener('click', async function() {
            if (popupChoose) popupChoose.style.display = 'none';
            
            const meoDuocChon = DANH_SACH_MEO[chiSoMeoHienTai];
            skinMeoNgu = meoDuocChon.hinhNgu;
            skinMeoDung = meoDuocChon.hinhDung;
            skinMeoAn = meoDuocChon.hinhAn;
            
            if (hinhMeo) hinhMeo.src = skinMeoNgu;
            
            if (nutStart) {
                nutStart.classList.remove('nut-an');
                setTimeout(() => nutStart.classList.add('nut-start-hien'), 10);
            }
            hienUIChinh();
            
            await loadUserInfo();
        });
    }
}

export function capNhatHinhMeo() {
    const imgMain = document.getElementById('img-main');
    const imgSide = document.getElementById('img-side');
    if (imgMain && imgSide) {
        imgMain.src = DANH_SACH_MEO[chiSoMeoHienTai].hinhDung;
        let chiSoMeoPhu = (chiSoMeoHienTai === 0) ? 1 : 0;
        imgSide.src = DANH_SACH_MEO[chiSoMeoPhu].hinhDung;
    }
}

export function openChooseCatModal() {
    const popupChoose = document.getElementById('choose-meow-overlay');
    capNhatHinhMeo();
    if (popupChoose) popupChoose.style.display = 'flex';
}

export async function loadUserInfo() {
    if (!getAuthToken()) return;
    
    const data = await fetchPlayerStatus();
    if (data && data.coins !== undefined) {
        updatePlayerData(data.coins, data.petFullness || 50, data.petHappiness || 0);
        capNhatTienUI();
        capNhatThanhNangLuong();
    }
}

export function startEatingAnimation() {
    const meoAn = document.getElementById('meo-an');
    const meoXamAn = document.getElementById('meo-xam-an');
    const meoChinh = document.getElementById('meo-chinh');
    const hinhMeo = document.getElementById('meo-chinh');
    
    if (meoChinh) {
        meoChinh.style.opacity = '0';
        
        // Cần đảm bảo so sánh chuỗi bất chấp case
        const skinLower = skinMeoAn.toLowerCase();
        if (skinLower.includes('meoan') && meoAn) {
            meoAn.classList.add('dang-an');
        } else if (skinLower.includes('meoxamoan') && meoXamAn) {
            meoXamAn.classList.add('dang-an');
        }
        
        setTimeout(() => {
            if (meoAn) meoAn.classList.remove('dang-an');
            if (meoXamAn) meoXamAn.classList.remove('dang-an');
            meoChinh.style.opacity = '1';
            if (hinhMeo) hinhMeo.src = skinMeoDung;
        }, 2500);
    }
}

export function startJumpAnimation() {
    const hinhMeo = document.getElementById('meo-chinh');
    if (hinhMeo) hinhMeo.classList.add('meo-nhay');
}

export function stopJumpAnimation() {
    const hinhMeo = document.getElementById('meo-chinh');
    if (hinhMeo) hinhMeo.classList.remove('meo-nhay');
}
