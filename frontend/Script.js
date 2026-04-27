// ==========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC VÀ SKIN MÈO
// ==========================================
const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');
const bang = document.getElementById('cum-dem-gio');
const hienThi = document.getElementById('so-giay');
const nutCaiDat = document.getElementById('nut-cai-dat');
const nutShop = document.getElementById('mo-shop');
const nutViTop = document.getElementById('mo-vi');

let macDinhPhut = 25; // Thời gian do user cài đặt (phút)
let thoiGianDatTruoc = macDinhPhut; // Luôn sync với macDinhPhut
let phut = macDinhPhut;
let giay = 0;
let tiepDauMeo = 'meo'; // Tiền tố hỗ trợ đổi mèo sau này
let boDem = null;
let dangTamDung = false;
let dangDemGio = false;

// BIẾN LƯU TRỮ SKIN MÈO HIỆN TẠI (Mặc định là mèo vàng ngủ)
let skinMeoNgu = 'asset/meongu.GIF'; 
let skinMeoDung = 'asset/meodung.gif';
let skinMeoAn = 'asset/meoan.GIF'; // Mèo bình thường ăn

// ==========================================
// 2. CÁC HÀM XỬ LÝ CHUNG
// ==========================================
function batDauDemNguoc() {
    clearInterval(boDem);
    boDem = setInterval(function () {
        if (giay === 0) {
            if (phut === 0) {
                clearInterval(boDem);
                dangDemGio = false;

                // ==========================================================
                // ĐỒNG HỒ VỪA CHẠY VỀ 00:00 (HẾT GIỜ)
                // ==========================================================

                // 1. Hiệu ứng Mèo Nhảy + DONE
                if(hinhMeo) hinhMeo.classList.add('meo-nhay');
                let bangDone = document.getElementById('bang-done');
                if(bangDone) bangDone.classList.remove('nut-an');

                // 2. Mèo đi ngủ và ẩn DONE sau 4 giây, rồi mới reset + thưởng tiền
                setTimeout(() => {
                    if(hinhMeo) hinhMeo.classList.remove('meo-nhay');
                    if(bangDone) bangDone.classList.add('nut-an');
                    datLaiGiaoDien(true); // true = có thưởng tiền
                }, 4000);

                return;
                // ==========================================================
            }
            phut--;
            giay = 59;
        } else {
            giay--;
        }
        // Logic thanh năng lượng tụt (dùng macDinhPhut làm gốc)
        let tongGiayHienTai = phut * 60 + giay;
        let tongGiayBanDau = macDinhPhut * 60;
        let phanTram = (tongGiayHienTai / tongGiayBanDau) * 100;
        let barThucAn = document.getElementById('bar-thuc-an');
        let barCamXuc = document.getElementById('bar-cam-xuc');
        if(barThucAn) barThucAn.style.width = phanTram + '%';
        if(barCamXuc) barCamXuc.style.width = phanTram + '%';

        const thoiGianHienThi = dinhDangThoiGian(phut, giay);
        hienThi.innerText = thoiGianHienThi;
        // Cập nhật tab title khi đang học (yêu cầu của Phát)
        document.title = `⏱ ${thoiGianHienThi} — Mèo Pomodoro`;
    }, 1000);
}

function dinhDangThoiGian(phutValue, giayValue = 0) {
    const m = phutValue < 10 ? "0" + phutValue : String(phutValue);
    const s = giayValue < 10 ? "0" + giayValue : String(giayValue);
    return m + ":" + s;
}

// Hàm Reset giao diện về lúc chưa bấm Start
// tinhThuong = true chỉ khi đồng hồ tự chạy hết (không phải bấm STOP)
function datLaiGiaoDien(tinhThuong = false) {
    if (nutStart) {
        nutStart.classList.remove('nut-an');
        nutStart.classList.add('nut-start-hien');
        nutStart.style.pointerEvents = "auto";
        nutStart.style.opacity = "1";
    }

    nutStop.classList.add('nut-an');
    nutPause.classList.add('nut-an');

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

    // Đặt lại tab title về bình thường
    document.title = 'Mèo Pomodoro';

    // 🎁 Chỉ thưởng tiền khi học XONG tự nhiên (không phải bấm Stop)
    if (tinhThuong) {
        const tienThuong = macDinhPhut * 3; // mỗi phút = 3 xu
        viTien += tienThuong;
        capNhatTienUI();
        thongBaoShop(`+${tienThuong} xu! 🎉`, 'ok');
    }
}

// ⚠️ Listener trực tiếp phía trên đã bị xóa — chỉ giữ 1 bộ listener bên dưới (trong if-null-check)

// ==========================================
// 3. SỰ KIỆN BẤM CÁC NÚT (START/STOP/PAUSE)
// ==========================================
if (nutStart) {
    nutStart.addEventListener('click', function () {
        this.classList.add('nut-an');
        this.classList.remove('nut-start-hien');

        if (nutStop) nutStop.classList.remove('nut-an');
        if (nutPause) {
            nutPause.classList.remove('nut-an');
            nutPause.style.opacity = "1";
        }
        
        // Gán hình ĐỨNG theo con mèo đang được chọn
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

        if (nutShop) nutShop.style.pointerEvents = "none";
        if (nutViTop) nutViTop.style.pointerEvents = "none";
        if (nutCaiDat) nutCaiDat.style.pointerEvents = "none";

        phut = macDinhPhut; // Dùng macDinhPhut (đã sync với thoiGianDatTruoc)
        giay = 0;
        dangTamDung = false;
        dangDemGio = true;
        thoiGianDatTruoc = macDinhPhut; // Sync lại để reward tính đúng
        hienThi.innerText = dinhDangThoiGian(macDinhPhut);
        batDauDemNguoc();
    });
}

if (nutStop) {
    nutStop.addEventListener('click', function () {
        clearInterval(boDem);
        dangDemGio = false;
        // STOP = không thưởng tiền (tinhThuong = false)
        datLaiGiaoDien(false);
        // Reset thanh năng lượng về 100%
        const barThucAn = document.getElementById('bar-thuc-an');
        const barCamXuc = document.getElementById('bar-cam-xuc');
        if(barThucAn) barThucAn.style.width = '100%';
        if(barCamXuc) barCamXuc.style.width = '100%';
        hienThi.innerText = dinhDangThoiGian(macDinhPhut);
    });
}

if (nutPause) {
    nutPause.addEventListener('click', function () {
        if (dangTamDung === false) {
            clearInterval(boDem);
            dangTamDung = true;
            if (hinhMeo) hinhMeo.src = skinMeoNgu; 
            this.style.opacity = "0.6";
        } else {
            batDauDemNguoc();
            dangTamDung = false;
            if (hinhMeo) hinhMeo.src = skinMeoDung; 
            this.style.opacity = "1";
        }
    });
}

// ==========================================
// 4. ĐIỀU KHIỂN VÍ TIỀN
// ==========================================
const nutVi = document.getElementById('mo-vi');
const bangTien = document.getElementById('bang-tien');

if (nutVi && bangTien) {
    nutVi.addEventListener('click', function (e) {
        e.stopPropagation();
        if (dangDemGio) return;
        
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
        if (!bangTien.contains(event.target) && !nutVi.contains(event.target)) {
            bangTien.classList.add('nut-an');
            bangTien.classList.remove('hieu-ung-bop');
        }
    }
});

// ==========================================
// 5. ĐIỀU KHIỂN SHOP VÀ ĐẨY MÈO
// ==========================================
const manHinhShop = document.getElementById('man-hinh-shop');
const cumMeo = document.getElementById('cum-meo');
const khungGame = document.querySelector('.khung-game');
const bgMeoAn = document.getElementById('bg-meo-an'); // Đã thêm biến này

function moShop() {
    if (dangDemGio || !manHinhShop) return;

    if (khungGame) khungGame.classList.add('shop-dang-mo');
    if (cumMeo) cumMeo.classList.add('meo-sang-trai');
    
    if (bgMeoAn) bgMeoAn.classList.add('bg-meo-an-hien'); // Hiện background mèo ăn
    
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
}

function dongShop() {
    if (!manHinhShop) return;

    if (khungGame) khungGame.classList.remove('shop-dang-mo');
    if (cumMeo) cumMeo.classList.remove('meo-sang-trai');
    
    if (bgMeoAn) bgMeoAn.classList.remove('bg-meo-an-hien'); // Ẩn background mèo ăn
    
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

if (nutShop) nutShop.addEventListener('click', moShop);

const nutMuiTenBack = document.getElementById('dong-shop');
if (nutMuiTenBack) {
    nutMuiTenBack.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dongShop();
    });
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && manHinhShop && manHinhShop.classList.contains('shop-hien')) {
        dongShop();
    }
});

// ==========================================

// ==========================================
// 7. HỆ THỐNG CỬA HÀNG (SHOP LOGIC)
// ==========================================
const soTienEl = document.getElementById('so-tien');
const danhSachDoAnEl = document.querySelector('.danh-sach-do-an');

const SHOP_STORAGE_KEY = 'shop_inventory_v1';
const TIEN_STORAGE_KEY = 'wallet_money_v3';

const sanPhamShop = [
    { id: 'pudding', ten: 'Pudding', gia: 4, hinh: 'asset/banhflat.PNG' },
    { id: 'tra-sua', ten: 'Milk Tea', gia: 6, hinh: 'asset/trasua.PNG' },
    { id: 'cake', ten: 'Cake', gia: 10, hinh: 'asset/banhkem.PNG' }
];

let viTien = 284;
let khoDoAn = {};

function capNhatTienUI() {
    localStorage.setItem(TIEN_STORAGE_KEY, String(viTien));
    if (soTienEl) soTienEl.innerText = String(viTien);
}

function thongBaoShop(noiDung, loai = 'ok') {
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

function renderShop() {
    if (!danhSachDoAnEl) return;
    danhSachDoAnEl.innerHTML = '';

    sanPhamShop.forEach((sp) => {
        const daMua = Number(khoDoAn[sp.id] || 0);
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

function xuLyMuaHang(productId) {
    const sp = sanPhamShop.find((item) => item.id === productId);
    if (!sp) return;

    if (viTien < sp.gia) {
        thongBaoShop('Không đủ tiền!', 'error');
        return;
    }

    viTien -= sp.gia;
    khoDoAn[sp.id] = (khoDoAn[sp.id] || 0) + 1;

    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(khoDoAn));
    capNhatTienUI();
    renderShop();
    thongBaoShop(`Đã mua ${sp.ten}!`, 'ok');

    // 🐱 HIỆN ANIMATION MÈO ĂN
    const meoAn = document.getElementById('meo-an');
    const meoXamAn = document.getElementById('meo-xam-an');
    const meoChinh = document.getElementById('meo-chinh');
    
    if (meoChinh) {
        // Ẩn mèo bình thường
        meoChinh.style.opacity = '0';
        
        // Hiện ảnh ăn theo loại mèo được chọn
        if (skinMeoAn === 'asset/meoan.GIF' && meoAn) {
            meoAn.classList.add('dang-an');
        } else if (skinMeoAn === 'asset/meoxamoan.GIF' && meoXamAn) {
            meoXamAn.classList.add('dang-an');
        }
        
        // Ẩn sau 2.5 giây (thời gian animation ăn)
        setTimeout(() => {
            if (meoAn) meoAn.classList.remove('dang-an');
            if (meoXamAn) meoXamAn.classList.remove('dang-an');
            meoChinh.style.opacity = '1';
            // Quay lại ảnh đứng bình thường
            if (hinhMeo) hinhMeo.src = skinMeoDung;
        }, 2500);
    }
}

function khoiTaoShop() {
    const savedMoney = localStorage.getItem(TIEN_STORAGE_KEY);
    if (savedMoney !== null) {
        viTien = Number(savedMoney);
    } else {
        viTien = 284;
    }
    
    try {
        khoDoAn = JSON.parse(localStorage.getItem(SHOP_STORAGE_KEY) || '{}');
    } catch (e) { khoDoAn = {}; }

    capNhatTienUI();
    renderShop();

    if (danhSachDoAnEl) {
        danhSachDoAnEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.shop-buy-btn');
            if (btn) xuLyMuaHang(btn.dataset.productId);
        });
    }
}

window.addEventListener('DOMContentLoaded', khoiTaoShop);


// ==========================================
// 8. ĐIỀU KHIỂN LUỒNG GAME: READY -> ĐĂNG KÝ -> VÀO GAME
// ==========================================
const nutReady = document.getElementById('nut-ready');
const manHinhBatDau = document.getElementById('man-hinh-bat-dau');
const manHinhGameChinh = document.getElementById('man-hinh-game-chinh');
const lopPhuToi = document.getElementById('man-hoi-toi');

function hienUIChinh() {
    [nutShop, nutViTop, nutCaiDat].forEach((nut) => {
        if (nut) {
            nut.classList.remove('nut-an');
            nut.style.setProperty('visibility', 'visible', 'important');
            nut.style.setProperty('opacity', '1', 'important');
            nut.style.pointerEvents = 'auto';
        }
    });
}

// BƯỚC 1: Bấm Ready ngoài sảnh
if (nutReady) {
    nutReady.addEventListener('click', function () {
        if (lopPhuToi) lopPhuToi.classList.add('man-hinh-sang-bung');
        if (manHinhBatDau) manHinhBatDau.classList.replace('man-hinh-hien', 'man-hinh-an');
        if (manHinhGameChinh) manHinhGameChinh.classList.replace('man-hinh-an', 'man-hinh-hien');

        const bangDangKy = document.getElementById('signup-overlay');
        if (bangDangKy) bangDangKy.style.display = 'flex';
    });
}

// BƯỚC 2: Bấm Sign Up (Đăng ký xong) -> gọi API register rồi login, sau đó chọn mèo
async function hoanTatDangKy() {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    if (!username || !password) {
        alert('Vui lòng nhập tên đăng nhập và mật khẩu!');
        return;
    }

    try {
        // 1. Gọi API đăng ký
        const regRes = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const regData = await regRes.json();

        // Nếu lỗi đăng ký (trừ trường hợp user đã tồn tại thì vẫn cho login)
        if (regData.status === 'error' && !regData.message.includes('đã tồn tại')) {
            alert(regData.message);
            return;
        }

        // 2. Tự động login để lấy token
        const loginRes = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const loginData = await loginRes.json();

        if (loginData.status !== 'success') {
            alert('Sai mật khẩu hoặc tài khoản không tồn tại!');
            return;
        }

        // 3. Lưu token vào localStorage để dùng cho các API sau
        localStorage.setItem('jwt_token', loginData.token);
        localStorage.setItem('user_id', loginData.userId);
        localStorage.setItem('username', loginData.username);

        // 4. Cập nhật số tiền từ server
        viTien = loginData.coins || 0;
        capNhatTienUI();

    } catch (err) {
        console.warn('Không kết nối được server, chạy offline:', err);
        // Nếu không có server thì vẫn cho vào chơi bình thường (offline mode)
    }

    // 5. Ẩn popup đăng ký, mở bảng chọn mèo
    const bangDangKy = document.getElementById('signup-overlay');
    if (bangDangKy) bangDangKy.style.display = 'none';

    const bangChonMeo = document.getElementById('choose-meow-overlay');
    if (bangChonMeo) {
        capNhatHinhMeo();
        bangChonMeo.style.display = 'flex';
    }
}

const nutSignUp = document.getElementById('btn-signup');
if (nutSignUp) nutSignUp.addEventListener('click', hoanTatDangKy);

const nutDongSignUp = document.getElementById('close-signup');
if (nutDongSignUp) nutDongSignUp.addEventListener('click', hoanTatDangKy);


// ==========================================
// 9. LOGIC BẢNG CHỌN MÈO (ĐÃ SỬA LỖI ẢNH)
// ==========================================
const popupChoose = document.getElementById('choose-meow-overlay');
const imgMain = document.getElementById('img-main');
const imgSide = document.getElementById('img-side');
const btnNextMeow = document.getElementById('next-meow');
const btnPrevMeow = document.getElementById('prev-meow');
const btnChooseCat = document.getElementById('btn-choose-cat');

// DANH SÁCH MÈO ĐÃ ĐƯỢC CHUẨN HÓA ĐUÔI FILE
const danhSachMeo = [
    {
        hinhNgu: 'asset/meongu.GIF',    // Mèo vàng ngủ
        hinhDung: 'asset/meodung.GIF',  // Mèo vàng đứng
        hinhAn: 'asset/meoan.GIF'       // Mèo vàng ăn
    },
    {
        hinhNgu: 'asset/meoxamngu.GIF', 
        hinhDung: 'asset/meoxamdung.GIF', // Mèo xám đứng
        hinhAn: 'asset/meoxamoan.GIF'     // Mèo xám ăn
    }
];

let chiSoMeoHienTai = 0;

// HÀM CẬP NHẬT HÌNH ẢNH TRÊN BẢNG CHỌN MÈO (Sử dụng ảnh ĐỨNG)
function capNhatHinhMeo() {
    if (imgMain && imgSide) {
        // Cập nhật ô lớn giữa thành mèo đang đứng
        imgMain.src = danhSachMeo[chiSoMeoHienTai].hinhDung; 
        
        // Cập nhật ô mèo phụ thành mèo đang đứng
        let chiSoMeoPhu = (chiSoMeoHienTai === 0) ? 1 : 0;
        imgSide.src = danhSachMeo[chiSoMeoPhu].hinhDung; 
    }
}

if (btnNextMeow) {
    btnNextMeow.addEventListener('click', () => {
        chiSoMeoHienTai = (chiSoMeoHienTai + 1) % danhSachMeo.length;
        capNhatHinhMeo();
    });
}

if (btnPrevMeow) {
    btnPrevMeow.addEventListener('click', () => {
        chiSoMeoHienTai = (chiSoMeoHienTai - 1 + danhSachMeo.length) % danhSachMeo.length;
        capNhatHinhMeo();
    });
}



// BƯỚC 3: Bấm nút CHOOSE màu vàng
if (btnChooseCat) {
    btnChooseCat.addEventListener('click', function() {
        if (popupChoose) popupChoose.style.display = 'none';

        const meoDuocChon = danhSachMeo[chiSoMeoHienTai];
        
        skinMeoNgu = meoDuocChon.hinhNgu;
        skinMeoDung = meoDuocChon.hinhDung;
        skinMeoAn = meoDuocChon.hinhAn; // ✨ Cập nhật ảnh ăn theo mèo được chọn

        // Ra ngoài sảnh thì mèo tự động về tư thế NGỦ
        if (hinhMeo) hinhMeo.src = skinMeoNgu;

        if (nutStart) {
            nutStart.classList.remove('nut-an');
            setTimeout(() => nutStart.classList.add('nut-start-hien'), 10);
        }
        hienUIChinh();
    });
}



// --- LOGIC CÀI ĐẶT THỜI GIAN THEO YÊU CẦU ---
const timePopupOverlay = document.getElementById('time-popup-overlay');
const closePopup = document.getElementById('close-popup');
const okConfirm = document.getElementById('ok-confirm');
const nutGiamTime = document.getElementById('giam-time');
const nutTangTime = document.getElementById('tang-time');
const currentTimeVal = document.getElementById('current-time-val');
const btnCaiDat = document.getElementById('nut-cai-dat');

function hienThiChuThoiGianPopup() {
    if(currentTimeVal) {
        let m = macDinhPhut < 10 ? '0' + macDinhPhut : macDinhPhut;
        currentTimeVal.innerText = m + ':00';
    }
}

if(btnCaiDat) {
    btnCaiDat.addEventListener('click', () => {
        hienThiChuThoiGianPopup();
        timePopupOverlay.style.display = 'flex';
    });
}
if(closePopup) {
    closePopup.addEventListener('click', () => {
        timePopupOverlay.style.display = 'none';
    });
}
if(okConfirm) {
    okConfirm.addEventListener('click', () => {
        clearInterval(boDem);
        dangTamDung = false;
        dangDemGio = false;
        // Sync thoiGianDatTruoc theo giá trị mới cài đặt
        thoiGianDatTruoc = macDinhPhut;
        phut = macDinhPhut;
        giay = 0;

        // datLaiGiaoDien không thưởng tiền khi đang cài đặt
        datLaiGiaoDien(false);

        hienThi.innerText = dinhDangThoiGian(macDinhPhut);
        timePopupOverlay.style.display = 'none';

        const barThucAn = document.getElementById('bar-thuc-an');
        const barCamXuc = document.getElementById('bar-cam-xuc');
        if(barThucAn) barThucAn.style.width = '100%';
        if(barCamXuc) barCamXuc.style.width = '100%';
    });
}
if(nutTangTime) {
    nutTangTime.addEventListener('click', () => {
        macDinhPhut += 5;
        if(macDinhPhut > 120) macDinhPhut = 120;
        hienThiChuThoiGianPopup();
    });
}
if(nutGiamTime) {
    nutGiamTime.addEventListener('click', () => {
        macDinhPhut -= 5;
        if(macDinhPhut < 1) macDinhPhut = 1;
        hienThiChuThoiGianPopup();
    });
}
