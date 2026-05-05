import { SHOP_STORAGE_KEY } from '../config/constants.js';

let viTien = 0;
let petFullness = 50;
let petHappiness = 0;
let khoDoAn = {};

export function initPlayer() {
    try {
        khoDoAn = JSON.parse(localStorage.getItem(SHOP_STORAGE_KEY) || '{}');
    } catch (e) {
        khoDoAn = {};
    }
}

export function updatePlayerData(coins, fullness, happiness) {
    if (coins !== undefined) viTien = coins;
    if (fullness !== undefined) petFullness = fullness;
    if (happiness !== undefined) petHappiness = happiness;
}

export function addOfflineReward(minutes) {
    const tienThuong = minutes * 3;
    viTien += tienThuong;
    return tienThuong;
}

export function buyItemOffline(sp) {
    if (viTien < sp.gia) return false;
    viTien -= sp.gia;
    petFullness = Math.min(petFullness + sp.nutrition, 100);
    khoDoAn[sp.id] = (khoDoAn[sp.id] || 0) + 1;
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(khoDoAn));
    return true;
}

export function addPurchasedItem(spId) {
    khoDoAn[spId] = (khoDoAn[spId] || 0) + 1;
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(khoDoAn));
}

export function getPlayerStats() {
    return { viTien, petFullness, petHappiness, khoDoAn };
}

export function hasEnoughCoins(amount) {
    return viTien >= amount;
}
