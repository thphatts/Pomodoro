import { SAN_PHAM_SHOP } from '../config/constants.js';
import { getPlayerStats, hasEnoughCoins, addPurchasedItem, updatePlayerData, buyItemOffline } from '../services/playerService.js';
import { getAuthToken } from '../services/authService.js';
import { buyItemApi } from '../api/playerApi.js';
import { startEatingAnimation } from './petUI.js';

let soTienEl, danhSachDoAnEl, manHinhShop, khungGame, cumMeo, bgMeoAn, nutCaiDat, nutStart;

export function initShopUI() {
    soTienEl = document.getElementById('so-tien');
    danhSachDoAnEl = document.querySelector('.danh-sach-do-an');
    manHinhShop = document.getElementById('man-hinh-shop');
    khungGame = document.querySelector('.khung-game');
    cumMeo = document.getElementById('cum-meo');
    bgMeoAn = document.getElementById('bg-meo-an');
    nutCaiDat = document.getElementById('nut-cai-dat');
    nutStart = document.getElementById('nut-bat-dau');
    const nutShop = document.getElementById('mo-shop');
    const nutMuiTenBack = document.getElementById('dong-shop');
    const nutVi = document.getElementById('mo-vi');
    const bangTien = document.getElementById('bang-tien');

    if (nutShop) nutShop.addEventListener('click', moShop);

    if (nutMuiTenBack) {
        nutMuiTenBack.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dongShop();
        });
    }

    if (nutVi && bangTien) {
        nutVi.addEventListener('click', function(e) {
            e.stopPropagation();
            // Need to check timer running state here, maybe dispatch event or export variable
            // For now, toggle bangTien
            if (bangTien.classList.contains('nut-an')) {
                bangTien.classList.remove('nut-an');
                bangTien.classList.add('hieu-ung-bop');
            } else {
                bangTien.classList.add('nut-an');
                bangTien.classList.remove('hieu-ung-bop');
            }
        });
    }

    document.addEventListener('click', function(event) {
        if (bangTien && !bangTien.classList.contains('nut-an')) {
            if (!bangTien.contains(event.target) && nutVi && !nutVi.contains(event.target)) {
                bangTien.classList.add('nut-an');
                bangTien.classList.remove('hieu-ung-bop');
            }
        }
    });

    if (danhSachDoAnEl) {
        danhSachDoAnEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.shop-buy-btn');
            if (btn) xuLyMuaHang(btn.dataset.productId);
        });
    }
}

export function thongBaoShop(noiDung, loai = 'ok') {
    let box = document.getElementById('shop-toast');
    if (!box) {
        box = document.createElement('div');
        box.id = 'shop-toast';
        box.style.position = 'fixed';
        box.style.top = '20px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.padding = '10px 16px';
        box.style.borderRadius = '10px';
        box.style.fontFamily = '"Pixelify Sans", sans-serif';
        box.style.fontSize = '20px';
        box.style.zIndex = '9999';
        box.style.transition = 'opacity 0.2s ease';
        box.style.opacity = '0';
        document.body.appendChild(box);
    }
    
    box.style.backgroundColor = loai === 'ok' ? '#55A881' : '#d35f5f';
    box.style.color = '#fff';
    box.innerText = noiDung;
    box.style.opacity = '1';
    
    clearTimeout(box._shopTimer);
    box._shopTimer = setTimeout(() => {
        box.style.opacity = '0';
    }, 1200);
}

export function renderShop() {
    if (!danhSachDoAnEl) return;
    danhSachDoAnEl.innerHTML = '';
    const stats = getPlayerStats();
    
    SAN_PHAM_SHOP.forEach((sp) => {
        const daMua = Number(stats.khoDoAn[sp.id] || 0);
        const card = document.createElement('div');
        card.className = 'shop-item-card';
        card.innerHTML = `
            <div class="shop-item-square">
                <img src="${sp.hinh}" alt="${sp.ten}" class="shop-item-img">
                <div class="shop-item-owned">x${daMua}</div>
            </div>
            <div class="shop-item-gia">${sp.gia} xu</div>
            <button class="shop-buy-btn" data-product-id="${sp.id}">buy</button>
        `;
        danhSachDoAnEl.appendChild(card);
    });
    
    for (let i = 0; i < 3; i++) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'shop-item-card';
        emptyCard.innerHTML = `<div class="shop-item-square empty"></div>`;
        danhSachDoAnEl.appendChild(emptyCard);
    }
}

export function capNhatTienUI() {
    const stats = getPlayerStats();
    if (soTienEl) soTienEl.innerText = String(stats.viTien);
}

export function capNhatThanhNangLuong() {
    const stats = getPlayerStats();
    let barThucAn = document.getElementById('bar-thuc-an');
    let barCamXuc = document.getElementById('bar-cam-xuc');
    if (barThucAn) barThucAn.style.width = Math.min(stats.petFullness, 100) + '%';
    if (barCamXuc) barCamXuc.style.width = Math.min(stats.petHappiness, 100) + '%';
}

async function xuLyMuaHang(productId) {
    const sp = SAN_PHAM_SHOP.find((item) => item.id === productId);
    if (!sp) return;
    
    if (!hasEnoughCoins(sp.gia)) {
        thongBaoShop('Không đủ tiền!', 'error');
        return;
    }
    
    if (getAuthToken()) {
        const data = await buyItemApi(sp.gia, sp.nutrition);
        
        if (data && data.status === 'success') {
            updatePlayerData(data.coins, data.petFullness, data.petHappiness);
            addPurchasedItem(sp.id);
            capNhatTienUI();
            capNhatThanhNangLuong();
            renderShop();
            thongBaoShop(`Đã mua ${sp.ten}!`, 'ok');
            startEatingAnimation();
        } else if (data && data.status === 'error') {
            thongBaoShop(data.message || 'Mua hàng thất bại!', 'error');
        } else {
            handleOfflineBuy(sp);
        }
    } else {
        handleOfflineBuy(sp);
    }
}

function handleOfflineBuy(sp) {
    if (buyItemOffline(sp)) {
        capNhatTienUI();
        capNhatThanhNangLuong();
        renderShop();
        thongBaoShop(`Đã mua ${sp.ten}!`, 'ok');
        startEatingAnimation();
    }
}

export function moShop() {
    // Check if timer is running? We should export a way to check from timerService.
    import('../services/timerService.js').then(({ getTimerState }) => {
        if (getTimerState().dangDemGio || !manHinhShop) return;
        
        if (khungGame) khungGame.classList.add('shop-dang-mo');
        if (cumMeo) cumMeo.classList.add('meo-sang-trai');
        if (bgMeoAn) bgMeoAn.classList.add('bg-meo-an-hien');
        
        if (nutCaiDat) {
            nutCaiDat.style.setProperty('visibility', 'hidden', 'important');
            nutCaiDat.style.setProperty('opacity', '0', 'important');
            nutCaiDat.style.pointerEvents = 'none';
        }
        
        if (nutStart) {
            nutStart.style.setProperty('visibility', 'hidden', 'important');
            nutStart.style.setProperty('opacity', '0', 'important');
            nutStart.style.pointerEvents = 'none';
        }
        
        manHinhShop.classList.remove('shop-an');
        manHinhShop.classList.add('shop-hien');
    });
}

export function dongShop() {
    if (!manHinhShop) return;
    
    if (khungGame) khungGame.classList.remove('shop-dang-mo');
    if (cumMeo) cumMeo.classList.remove('meo-sang-trai');
    if (bgMeoAn) bgMeoAn.classList.remove('bg-meo-an-hien');
    
    if (nutCaiDat) {
        nutCaiDat.style.setProperty('visibility', 'visible', 'important');
        nutCaiDat.style.setProperty('opacity', '1', 'important');
        nutCaiDat.style.pointerEvents = 'auto';
    }
    
    if (nutStart) {
        nutStart.style.setProperty('visibility', 'visible', 'important');
        nutStart.style.setProperty('opacity', '1', 'important');
        nutStart.style.pointerEvents = 'auto';
    }
    
    manHinhShop.classList.remove('shop-hien');
    manHinhShop.classList.add('shop-an');
}
