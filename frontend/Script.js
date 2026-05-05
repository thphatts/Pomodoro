// ==========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC VÀ CẤU HÌNH API
// ==========================================
const API_BASE_URL = 'http://localhost:8080/api';

// Các phần tử DOM
const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');
const bang = document.getElementById('cum-dem-gio');
const hienThi = document.getElementById('so-giay');
const nutCaiDat = document.getElementById('nut-cai-dat');
const nutShop = document.getElementById('mo-shop');
const nutViTop = document.getElementById('mo-vi');

// Biến thời gian
let thoiGianDatTruoc = 20;
let phut = thoiGianDatTruoc;
let giay = 0;
let macDinhPhut = 25;
let tiepDauMeo = 'meo';
let boDem = null;
let dangTamDung = false;
let dangDemGio = false;

// Biến skin mèo
let skinMeoNgu = 'asset/meongu.gif';
let skinMeoDung = 'asset/meodung.gif';
let skinMeoAn = 'asset/meoan.gif';

// Biến người dùng và xác thực
let currentUser = null;
let authToken = null;
let viTien = 0;
let petFullness = 50;
let petHappiness = 0;

// ==========================================
// 2. HÀM TIỆN ÍCH API
// ==========================================
async function apiRequest(url, method = 'GET', body = null, requireAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (requireAuth && authToken) {
        headers['Authorization'] = 'Bearer ' + authToken;
    }
    
    const options = {
        method,
        headers
    };
    
    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        return { status: 'error', message: 'Không thể kết nối server' };
    }
}

// ==========================================
// 3. HỆ THỐNG ĐĂNG KÝ / ĐĂNG NHẬP
// ==========================================
const nutReady = document.getElementById('nut-ready');
const manHinhBatDau = document.getElementById('man-hinh-bat-dau');
const manHinhGameChinh = document.getElementById('man-hinh-game-chinh');
const signupOverlay = document.getElementById('signup-overlay');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const btnSignup = document.getElementById('btn-signup');
const closeSignup = document.getElementById('close-signup');
const linkLogin = document.getElementById('link-login');

// Bấm Ready -> Hiện bảng đăng ký
if (nutReady) {
    nutReady.addEventListener('click', function() {
        if (manHinhBatDau) manHinhBatDau.classList.replace('man-hinh-hien', 'man-hinh-an');
        if (manHinhGameChinh) manHinhGameChinh.classList.replace('man-hinh-an', 'man-hinh-hien');
        if (signupOverlay) signupOverlay.style.display = 'flex';
    });
}

// Xử lý đăng ký
if (btnSignup) {
    btnSignup.addEventListener('click', async function() {
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        if (!username || !password) {
            thongBaoShop('Vui lòng nhập đầy đủ thông tin!', 'error');
            return;
        }
        
        // Bước 1: Đăng ký tài khoản
        const registerResult = await apiRequest(API_BASE_URL + '/auth/register', 'POST', { username, password }, false);
        
        if (registerResult.status === 'success') {
            thongBaoShop('Đăng ký thành công! Đang đăng nhập...', 'ok');
            
            // Bước 2: Tự động đăng nhập sau khi đăng ký thành công
            const loginResult = await apiRequest(API_BASE_URL + '/auth/login', 'POST', { username, password }, false);
            
            if (loginResult.status === 'success' && loginResult.token) {
                authToken = loginResult.token;
                currentUser = {
                    id: loginResult.userId,
                    username: loginResult.username
                };
                
                // Lưu token vào localStorage
                localStorage.setItem('auth_token', authToken);
                
                // Chuyển sang bảng chọn mèo
                if (signupOverlay) signupOverlay.style.display = 'none';
                moBangChonMeo();
            } else {
                // Nếu đăng nhập thất bại, vẫn cho phép chơi nhưng không có dữ liệu server
                thongBaoShop('Đăng ký thành công! (Chế độ offline)', 'ok');
                if (signupOverlay) signupOverlay.style.display = 'none';
                moBangChonMeo();
            }
        } else {
            thongBaoShop(registerResult.message || 'Đăng ký thất bại!', 'error');
        }
    });
}

// Đóng bảng đăng ký
if (closeSignup) {
    closeSignup.addEventListener('click', function() {
        if (signupOverlay) signupOverlay.style.display = 'none';
    });
}

const loginOverlay = document.getElementById("login-overlay");
const loginUsernameInput = document.getElementById("login-username-input");
const loginPasswordInput = document.getElementById("login-password-input");
const btnLogin = document.getElementById("btn-login");

if (btnLogin) {
    btnLogin.addEventListener("click", async function() {
        const username = loginUsernameInput ? loginUsernameInput.value.trim() : "";
        const password = loginPasswordInput ? loginPasswordInput.value.trim() : "";

        if (!username || !password) {
            thongBaoShop("Vui lòng nhập đầy đủ thông tin!", "error");
            return;
        }

        const loginResult = await apiRequest(API_BASE_URL + "/auth/login", "POST", { username, password }, false);

        if (loginResult.status === "success" && loginResult.token) {
            authToken = loginResult.token;
            currentUser = {
                id: loginResult.userId,
                username: loginResult.username
            };
            localStorage.setItem("auth_token", authToken);

            if (loginOverlay) loginOverlay.style.display = "none";
            moBangChonMeo();
        } else {
            thongBaoShop(loginResult.message || "Đăng nhập thất bại!", "error");
        }
    });
}


// ==========================================
// 4. HỆ THỐNG CHỌN MÈO
// ==========================================
const popupChoose = document.getElementById('choose-meow-overlay');
const imgMain = document.getElementById('img-main');
const imgSide = document.getElementById('img-side');
const btnNextMeow = document.getElementById('next-meow');
const btnPrevMeow = document.getElementById('prev-meow');
const btnChooseCat = document.getElementById('btn-choose-cat');

const danhSachMeo = [
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

let chiSoMeoHienTai = 0;

function moBangChonMeo() {
    capNhatHinhMeo();
    if (popupChoose) popupChoose.style.display = 'flex';
}

function capNhatHinhMeo() {
    if (imgMain && imgSide) {
        imgMain.src = danhSachMeo[chiSoMeoHienTai].hinhDung;
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

if (btnChooseCat) {
    btnChooseCat.addEventListener('click', function() {
        if (popupChoose) popupChoose.style.display = 'none';
        
        const meoDuocChon = danhSachMeo[chiSoMeoHienTai];
        skinMeoNgu = meoDuocChon.hinhNgu;
        skinMeoDung = meoDuocChon.hinhDung;
        skinMeoAn = meoDuocChon.hinhAn;
        
        if (hinhMeo) hinhMeo.src = skinMeoNgu;
        
        if (nutStart) {
            nutStart.classList.remove('nut-an');
            setTimeout(() => nutStart.classList.add('nut-start-hien'), 10);
        }
        hienUIChinh();
        
        // Load thông tin user từ server
        loadUserInfo();
    });
}

// ==========================================
// 5. TẢI THÔNG TIN USER TỪ SERVER
// ==========================================
async function loadUserInfo() {
    if (!authToken) return;
    
    const data = await apiRequest(API_BASE_URL + '/status', 'GET', null, true);
    if (data && data.coins !== undefined) {
        viTien = data.coins;
        petFullness = data.petFullness || 50;
        petHappiness = data.petHappiness || 0;
        capNhatTienUI();
        capNhatThanhNangLuong();
    }
}

function capNhatThanhNangLuong() {
    let barThucAn = document.getElementById('bar-thuc-an');
    let barCamXuc = document.getElementById('bar-cam-xuc');
    if (barThucAn) barThucAn.style.width = Math.min(petFullness, 100) + '%';
    if (barCamXuc) barCamXuc.style.width = Math.min(petHappiness, 100) + '%';
}

// ==========================================
// 6. BỘ ĐẾM NGƯỢC POMODORO
// ==========================================
function batDauDemNguoc() {
    clearInterval(boDem);
    boDem = setInterval(function() {
        if (giay === 0) {
            if (phut === 0) {
                clearInterval(boDem);
                dangDemGio = false;
                xuLyHoanThanhPomodoro();
                return;
            }
            phut--;
            giay = 59;
        } else {
            giay--;
        }
        hienThi.innerText = dinhDangThoiGian(phut, giay);
        
        // Cập nhật thanh năng lượng
        let tongGiayHienTai = phut * 60 + giay;
        let tongGiayBanDau = macDinhPhut * 60;
        let phanTram = (tongGiayHienTai / tongGiayBanDau) * 100;
        let barThucAn = document.getElementById('bar-thuc-an');
        let barCamXuc = document.getElementById('bar-cam-xuc');
        if (barThucAn) barThucAn.style.width = phanTram + '%';
        if (barCamXuc) barCamXuc.style.width = phanTram + '%';
    }, 1000);
}

function dinhDangThoiGian(phutValue, giayValue = 0) {
    const m = phutValue < 10 ? "0" + phutValue : String(phutValue);
    const s = giayValue < 10 ? "0" + giayValue : String(giayValue);
    return m + ":" + s;
}

// Xử lý khi hoàn thành pomodoro
async function xuLyHoanThanhPomodoro() {
    // Hiệu ứng mèo nhảy + DONE
    if (hinhMeo) hinhMeo.classList.add('meo-nhay');
    let bangDone = document.getElementById('bang-done');
    if (bangDone) {
        bangDone.classList.remove('nut-an');
    }
    
    // Gọi API lưu phiên học và nhận thưởng
    const minutes = macDinhPhut;
    const data = await apiRequest(API_BASE_URL + '/session/save', 'POST', { minutes: minutes }, true);
    
    if (data && data.status === 'success') {
        viTien = data.totalCoins;
        petHappiness = data.petHappiness || petHappiness;
        capNhatTienUI();
        capNhatThanhNangLuong();
        
        const tienThuong = data.coinsEarned;
        thongBaoShop(`+${tienThuong} xu! 🎉`, 'ok');
    } else {
        // Fallback nếu không có server
        const tienThuong = macDinhPhut * 3;
        viTien += tienThuong;
        capNhatTienUI();
        thongBaoShop(`+${tienThuong} xu! 🎉`, 'ok');
    }
    
    // Ẩn hiệu ứng sau 4 giây
    setTimeout(() => {
        datLaiGiaoDien();
        if (hinhMeo) hinhMeo.classList.remove('meo-nhay');
        if (bangDone) bangDone.classList.add('nut-an');
    }, 4000);
}

// ==========================================
// 7. ĐIỀU KHIỂN NÚT START/STOP/PAUSE
// ==========================================
if (nutStart) {
    nutStart.addEventListener('click', function() {
        this.classList.add('nut-an');
        this.classList.remove('nut-start-hien');
        
        if (nutStop) nutStop.classList.remove('nut-an');
        if (nutPause) {
            nutPause.classList.remove('nut-an');
            nutPause.style.opacity = "1";
        }
        
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
        
        phut = thoiGianDatTruoc;
        giay = 0;
        dangTamDung = false;
        dangDemGio = true;
        hienThi.innerText = dinhDangThoiGian(thoiGianDatTruoc);
        batDauDemNguoc();
    });
}

if (nutStop) {
    nutStop.addEventListener('click', function() {
        clearInterval(boDem);
        dangDemGio = false;
        hienThi.innerText = dinhDangThoiGian(thoiGianDatTruoc);
        datLaiGiaoDien();
        
        // Reset thanh năng lượng
        let barThucAn = document.getElementById('bar-thuc-an');
        let barCamXuc = document.getElementById('bar-cam-xuc');
        if (barThucAn) barThucAn.style.width = '100%';
        if (barCamXuc) barCamXuc.style.width = '100%';
    });
}

if (nutPause) {
    nutPause.addEventListener('click', function() {
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
// 8. HÀM RESET GIAO DIỆN
// ==========================================
function datLaiGiaoDien() {
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

// ==========================================
// 9. ĐIỀU KHIỂN VÍ TIỀN
// ==========================================
const nutVi = document.getElementById('mo-vi');
const bangTien = document.getElementById('bang-tien');

if (nutVi && bangTien) {
    nutVi.addEventListener('click', function(e) {
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
// 10. ĐIỀU KHIỂN SHOP
// ==========================================
const manHinhShop = document.getElementById('man-hinh-shop');
const cumMeo = document.getElementById('cum-meo');
const khungGame = document.querySelector('.khung-game');
const bgMeoAn = document.getElementById('bg-meo-an');
const soTienEl = document.getElementById('so-tien');
const danhSachDoAnEl = document.querySelector('.danh-sach-do-an');

const SHOP_STORAGE_KEY = 'shop_inventory_v1';

const sanPhamShop = [
    { id: 'pudding', ten: 'Pudding', gia: 4, nutrition: 10, hinh: 'asset/banhflat.png' },
    { id: 'tra-sua', ten: 'Milk Tea', gia: 6, nutrition: 15, hinh: 'asset/trasua.png' },
    { id: 'cake', ten: 'Cake', gia: 10, nutrition: 25, hinh: 'asset/banhkem.png' }
];

let khoDoAn = {};

function capNhatTienUI() {
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

// Xử lý mua hàng với API backend
async function xuLyMuaHang(productId) {
    const sp = sanPhamShop.find((item) => item.id === productId);
    if (!sp) return;
    
    if (viTien < sp.gia) {
        thongBaoShop('Không đủ tiền!', 'error');
        return;
    }
    
    // Nếu có token thì gọi API backend, ngược lại chơi offline
    if (authToken) {
        // Gọi API backend để mua hàng
        const data = await apiRequest(
            API_BASE_URL + '/player/buy?price=' + sp.gia + '&nutrition=' + sp.nutrition,
            'POST',
            null,
            true
        );
        
        if (data && data.status === 'success') {
            viTien = data.coins;
            petFullness = data.petFullness || petFullness;
            petHappiness = data.petHappiness || petHappiness;
            
            khoDoAn[sp.id] = (khoDoAn[sp.id] || 0) + 1;
            localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(khoDoAn));
            
            capNhatTienUI();
            capNhatThanhNangLuong();
            renderShop();
            thongBaoShop(`Đã mua ${sp.ten}!`, 'ok');
            
            // Hiệu ứng mèo ăn
            hienThiMeoAn();
        } else if (data && data.status === 'error') {
            thongBaoShop(data.message || 'Mua hàng thất bại!', 'error');
        } else {
            // Lỗi kết nối, fallback sang offline mode
            xuLyMuaHangOffline(sp);
        }
    } else {
        // Chơi offline - không có server
        xuLyMuaHangOffline(sp);
    }
}

// Xử lý mua hàng offline (không có server)
function xuLyMuaHangOffline(sp) {
    viTien -= sp.gia;
    petFullness = Math.min(petFullness + sp.nutrition, 100);
    khoDoAn[sp.id] = (khoDoAn[sp.id] || 0) + 1;
    
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(khoDoAn));
    
    capNhatTienUI();
    capNhatThanhNangLuong();
    renderShop();
    thongBaoShop(`Đã mua ${sp.ten}!`, 'ok');
    
    // Hiệu ứng mèo ăn
    hienThiMeoAn();
}

function hienThiMeoAn() {
    const meoAn = document.getElementById('meo-an');
    const meoXamAn = document.getElementById('meo-xam-an');
    const meoChinh = document.getElementById('meo-chinh');
    
    if (meoChinh) {
        meoChinh.style.opacity = '0';
        
        if (skinMeoAn === 'asset/meoan.GIF' && meoAn) {
            meoAn.classList.add('dang-an');
        } else if (skinMeoAn === 'asset/meoxamoan.GIF' && meoXamAn) {
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

function moShop() {
    if (dangDemGio || !manHinhShop) return;
    
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
}

function dongShop() {
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

if (nutShop) nutShop.addEventListener('click', moShop);

const nutMuiTenBack = document.getElementById('dong-shop');
if (nutMuiTenBack) {
    nutMuiTenBack.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dongShop();
    });
}

// ==========================================
// 8.1 LOGIC ĐĂNG KÝ VÀ ĐĂNG NHẬP
// ==========================================
const bangDangKy = document.getElementById('signup-overlay');
const bangDangNhap = document.getElementById('login-overlay');
const linkDangNhap = document.getElementById('link-login');
const linkDangKy = document.getElementById('link-signup');
const nutDongSignUp = document.getElementById('close-signup');
const nutDongLogin = document.getElementById('close-login');
const nutSignUp = document.getElementById('btn-signup');
const nutLogin = document.getElementById('btn-login');

// Hàm chuyển từ bảng đăng ký sang bảng đăng nhập
function chuyenSangDangNhap(e) {
    e.preventDefault();
    if (bangDangKy) bangDangKy.style.display = 'none';
    if (bangDangNhap) bangDangNhap.style.display = 'flex';
}

// Hàm chuyển từ bảng đăng nhập sang bảng đăng ký
function chuyenSangDangKy(e) {
    e.preventDefault();
    if (bangDangNhap) bangDangNhap.style.display = 'none';
    if (bangDangKy) bangDangKy.style.display = 'flex';
}

// Hàm chuyển từ bảng đăng ký sang bảng đăng nhập
function chuyenSangDangNhap(e) {
    e.preventDefault();
    if (bangDangKy) bangDangKy.style.display = 'none';
    if (bangDangNhap) bangDangNhap.style.display = 'flex';
}

// Hàm chuyển từ bảng đăng nhập sang bảng đăng ký
function chuyenSangDangKy(e) {
    e.preventDefault();
    if (bangDangNhap) bangDangNhap.style.display = 'none';
    if (bangDangKy) bangDangKy.style.display = 'flex';
}

// Bấm "Log in" link ở dưới bảng đăng ký
if (linkDangNhap) linkDangNhap.addEventListener('click', chuyenSangDangNhap);

// Bấm "Sign up" link ở dưới bảng đăng nhập
if (linkDangKy) linkDangKy.addEventListener('click', chuyenSangDangKy);

// Bấm nút đóng bảng đăng ký
if (nutDongSignUp) {
    nutDongSignUp.addEventListener('click', function() {
        if (bangDangKy) bangDangKy.style.display = 'none';
    });
}

// Bấm nút đóng bảng đăng nhập
if (nutDongLogin) {
    nutDongLogin.addEventListener('click', function() {
        if (bangDangNhap) bangDangNhap.style.display = 'none';
    });
}


// ==========================================
// 11. CÀI ĐẶT THỜI GIAN
// ==========================================
const timePopupOverlay = document.getElementById('time-popup-overlay');
const closePopup = document.getElementById('close-popup');
const okConfirm = document.getElementById('ok-confirm');
const nutGiamTime = document.getElementById('giam-time');
const nutTangTime = document.getElementById('tang-time');
const currentTimeVal = document.getElementById('current-time-val');
const btnCaiDat = document.getElementById('nut-cai-dat');

function hienThiChuThoiGianPopup() {
    if (currentTimeVal) {
        let m = macDinhPhut < 10 ? '0' + macDinhPhut : macDinhPhut;
        currentTimeVal.innerText = m + ':00';
    }
}

if (btnCaiDat) {
    btnCaiDat.addEventListener('click', () => {
        hienThiChuThoiGianPopup();
        timePopupOverlay.style.display = 'flex';
    });
}

if (closePopup) {
    closePopup.addEventListener('click', () => {
        timePopupOverlay.style.display = 'none';
    });
}

if (okConfirm) {
    okConfirm.addEventListener('click', () => {
        clearInterval(boDem);
        dangTamDung = false;
        datLaiGiaoDien();
        
        phut = macDinhPhut;
        giay = 0;
        let m = phut < 10 ? '0' + phut : phut;
        hienThi.innerText = m + ':00';
        timePopupOverlay.style.display = 'none';
        
        let barThucAn = document.getElementById('bar-thuc-an');
        let barCamXuc = document.getElementById('bar-cam-xuc');
        if (barThucAn) barThucAn.style.width = '100%';
        if (barCamXuc) barCamXuc.style.width = '100%';
    });
}

if (nutTangTime) {
    nutTangTime.addEventListener('click', () => {
        macDinhPhut += 5;
        if (macDinhPhut > 120) macDinhPhut = 120;
        hienThiChuThoiGianPopup();
    });
}

if (nutGiamTime) {
    nutGiamTime.addEventListener('click', () => {
        macDinhPhut -= 5;
        if (macDinhPhut < 1) macDinhPhut = 1;
        hienThiChuThoiGianPopup();
    });
}

// ==========================================
// 12. KHỞI TẠO ỨNG DỤNG
// ==========================================
function khoiTaoUngDung() {
    // Load inventory từ localStorage
    try {
        khoDoAn = JSON.parse(localStorage.getItem(SHOP_STORAGE_KEY) || '{}');
    } catch (e) {
        khoDoAn = {};
    }
    
    // Kiểm tra token từ localStorage (nếu có)
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
        authToken = savedToken;
        loadUserInfo();
    }
    
    // Khởi tạo UI
    capNhatTienUI();
    renderShop();
    
    // Setup event listener cho shop
    if (danhSachDoAnEl) {
        danhSachDoAnEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.shop-buy-btn');
            if (btn) xuLyMuaHang(btn.dataset.productId);
        });
    }
}

// Chạy khi DOM sẵn sàng
window.addEventListener('DOMContentLoaded', khoiTaoUngDung);