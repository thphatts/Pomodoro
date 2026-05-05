// ==========================================
// CẤU HÌNH BIẾN TOÀN CỤC VÀ HẰNG SỐ
// ==========================================

export const API_BASE_URL = 'http://localhost:8080/api';
export const SHOP_STORAGE_KEY = 'shop_inventory_v1';

export const DANH_SACH_MEO = [
    {
        hinhNgu: 'asset/meongu.gif',
        hinhDung: 'asset/meodung.gif',
        hinhAn: 'asset/meoan.gif'
    },
    {
        hinhNgu: 'asset/meoxamngu.gif',
        hinhDung: 'asset/meoxamdung.gif',
        hinhAn: 'asset/meoxamoan.gif'
    }
];

export const SAN_PHAM_SHOP = [
    { id: 'pudding', ten: 'Pudding', gia: 4, nutrition: 10, hinh: 'asset/banhflat.png' },
    { id: 'tra-sua', ten: 'Milk Tea', gia: 6, nutrition: 15, hinh: 'asset/trasua.png' },
    { id: 'cake', ten: 'Cake', gia: 10, nutrition: 25, hinh: 'asset/banhkem.png' }
];
