// ==========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC
// ==========================================
const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');
const bang = document.getElementById('cum-dem-gio');
const hienThi = document.getElementById('so-giay'); 

let phut = 25; 
let giay = 0;
let boDem = null;
let dangTamDung = false; // Biến để theo dõi xem có đang Pause hay không

// ==========================================
// 2. CÁC HÀM XỬ LÝ CHUNG (Viết sẵn để dùng lại)
// ==========================================

// Hàm chạy đếm ngược
function batDauDemNguoc() {
    clearInterval(boDem); // Dọn dẹp bộ đếm cũ cho an toàn
    
    boDem = setInterval(function() {
        if (giay === 0) {
            if (phut === 0) {
                // HẾT GIỜ 25 PHÚT
                clearInterval(boDem);
                datLaiGiaoDien(); // Gọi hàm reset giao diện
                return; 
            }
            phut--;      
            giay = 59;   
        } else {
            giay--;      
        }

        let s = giay < 10 ? "0" + giay : giay;
        let m = phut < 10 ? "0" + phut : phut;
        hienThi.innerText = m + ":" + s;
    }, 1000);
}

// Hàm Reset giao diện về lúc chưa bấm Start
function datLaiGiaoDien() {
    // 1. Hiện lại nút Start
    nutStart.style.opacity = "1";
    nutStart.style.pointerEvents = "auto";

    // 2. Cất nút Stop và Pause đi
    nutStop.classList.add('nut-an');
    nutStop.classList.remove('nảy-len');
    
    nutPause.classList.add('nut-an');
    nutPause.classList.remove('nảy-xuong');
    nutPause.style.opacity = "1"; // Reset lại độ sáng nút Pause

    // 3. Mèo đi ngủ
    hinhMeo.src = "asset/meongu.GIF"; 
}


// ==========================================
// 3. SỰ KIỆN BẤM CÁC NÚT
// ==========================================

// --- NÚT START ---
nutStart.addEventListener('click', function() {
    this.style.opacity = "0";
    this.style.pointerEvents = "none";

    nutStop.classList.remove('nut-an');
    nutStop.classList.add('nảy-len');
    
    nutPause.classList.remove('nut-an');
    nutPause.classList.add('nảy-xuong');

    hinhMeo.src = "asset/meodung.GIF";

    if (bang) {
        bang.classList.remove('bang-an');
        bang.classList.add('bang-hien');
    }

    // Set lại 25 phút và bắt đầu chạy
    phut = 25;
    giay = 0;
    dangTamDung = false;
    hienThi.innerText = "25:00";
    batDauDemNguoc();
});

// --- NÚT STOP (DỪNG HẲN) ---
nutStop.addEventListener('click', function() {
    clearInterval(boDem); // Dừng ngay bộ đếm
    hienThi.innerText = "25:00"; // Chữ nhảy về 25:00
    datLaiGiaoDien(); // Thu dọn các nút bấm
});

// --- NÚT PAUSE (TẠM DỪNG / ĐI TIẾP) ---
nutPause.addEventListener('click', function() {
    if (dangTamDung === false) {
        // TRƯỜNG HỢP 1: Đang chạy -> Bấm vào để TẠM DỪNG
        clearInterval(boDem); // Đóng băng thời gian
        dangTamDung = true;   // Ghi nhớ là đang Pause
        
        hinhMeo.src = "asset/meongu.GIF"; // Mèo tranh thủ chợp mắt
        this.style.opacity = "0.6"; // Làm nút Pause tối đi một chút để báo hiệu
        
    } else {
        // TRƯỜNG HỢP 2: Đang tạm dừng -> Bấm vào để CHẠY TIẾP
        batDauDemNguoc();     // Gọi hàm chạy tiếp (nó sẽ chạy tiếp số phút/giây đang lưu)
        dangTamDung = false;  // Tắt chế độ Pause
        
        hinhMeo.src = "asset/meodung.GIF"; // Mèo dậy làm việc tiếp
        this.style.opacity = "1"; // Nút Pause sáng lại như cũ
    }
});

const nutVi = document.getElementById('mo-vi');
const bangTien = document.getElementById('bang-tien');

nutVi.addEventListener('click', function() {
    // Nếu đang ẩn thì hiện và chạy hiệu ứng
    if (bangTien.classList.contains('nut-an')) {
        bangTien.classList.remove('nut-an');
        bangTien.classList.add('hieu-ung-bop');
    } else {
        // Nếu bấm lại lần nữa thì ẩn đi
        bangTien.classList.add('nut-an');
        bangTien.classList.remove('hieu-ung-bop');
    }
});

// Khai báo các biến cho Shop
// Khai báo biến
// Thêm đoạn này vào cuối file Script.js
// Điều khiển Shop
// Khai báo thêm biến cụm mèo

// Thêm đoạn này vào CUỐI file Script.js của bạn
// --- ĐIỀU KHIỂN SHOP VÀ ĐẨY MÈO ---
// --- ĐIỀU KHIỂN SHOP VÀ ĐẨY MÈO ---
const nutMoShop = document.getElementById('mo-shop');
const nutDongShop = document.getElementById('dong-shop');
const manHinhShop = document.getElementById('man-hinh-shop');
const cumMeo = document.getElementById('cum-meo');

if (nutMoShop && manHinhShop) {
    nutMoShop.onclick = function() {
        manHinhShop.classList.remove('shop-an');
        manHinhShop.classList.add('shop-hien');
        
        if (cumMeo) {
            cumMeo.classList.add('meo-sang-trai');
        }
    };
}

if (nutDongShop && manHinhShop) {
    nutDongShop.onclick = function() {
        manHinhShop.classList.remove('shop-hien');
        manHinhShop.classList.add('shop-an');
        
        if (cumMeo) {
            cumMeo.classList.remove('meo-sang-trai');
        }
    };
}

// Thêm đoạn này vào CUỐI file Script.js của bạn
// ==========================================
// 4. ĐIỀU KHIỂN CHUYỂN CẢNH (READY -> GAME)
// ==========================================

// Thêm đoạn này vào CUỐI file Script.js của bạn
// ==========================================
// 4. ĐIỀU KHIỂN CHUYỂN CẢNH (READY -> GAME) VÀ SÁNG MÀN HÌNH
// ==========================================

const nutReady = document.getElementById('nut-ready');
const nutstart = document.getElementById('nut-bat-dau');
const manHinhBatDau = document.getElementById('man-hinh-bat-dau');
const manHinhGameChinh = document.getElementById('man-hinh-game-chinh');
const lopPhuToi = document.getElementById('man-hoi-toi');

if (nutReady) {
    nutReady.addEventListener('click', function() {
        // 1. Làm sáng màn hình
        if (lopPhuToi) lopPhuToi.classList.add('man-hinh-sang-bung');

        // 2. Chuyển đổi màn hình
        manHinhBatDau.classList.replace('man-hinh-hien', 'man-hinh-an');
        manHinhGameChinh.classList.replace('man-hinh-an', 'man-hinh-hien');

        // 3. HIỆN NÚT START (Quan trọng)
        if (nutstart) {
            nutstart.classList.remove('nut-an');
            console.log("Nút Start đã hiện!");
        }
    });
}