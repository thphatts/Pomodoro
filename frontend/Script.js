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
// Hàm chạy đếm ngược (ĐÃ TÍCH HỢP API CỦA JAVA BACKEND)
function batDauDemNguoc() {
    clearInterval(boDem); // Dọn dẹp bộ đếm cũ cho an toàn
    
    boDem = setInterval(function() {
        if (giay === 0) {
            if (phut === 0) {
                // ==========================================================
                // CHÍNH LÀ CHỖ NÀY: ĐỒNG HỒ VỪA CHẠY VỀ 00:00 (HẾT 25 PHÚT)
                // ==========================================================
                clearInterval(boDem); // Dừng đồng hồ lại
                
                // 1. Gọi sang cổng 8080 báo cho Java biết để cộng tiền
                fetch('http://localhost:8080/api/player/reward?minutes=25', { 
                    method: 'POST' 
                })
                .then(res => res.json())
                .then(data => {
                    // Java xử lý xong trả về biến data
                    // alert("Chúc mừng! Bạn được cộng thêm xu. Tổng ví mới: " + data.coins + " xu");
                    
                    // 2. Tự động đắp số tiền mới lên giao diện cho User thấy
                    let theHienThiTien = document.getElementById('so-tien');
                    if (theHienThiTien) {
                        theHienThiTien.innerText = data.coins;
                    }
                })
                .catch(err => {
                    console.log("Lỗi: Không kết nối được với Server Java", err);
                });

                // 3. Reset lại giao diện (Mèo đi ngủ, hiện lại nút Start)
                datLaiGiaoDien(); 
                return; 
                // ==========================================================
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
    // 1. Hiện lại nút Start bằng cách giữ class hiệu ứng trượt
    if (nutStart) {
        nutStart.classList.remove('nut-an');
        nutStart.classList.add('nut-start-hien'); // Quan trọng: Phải có class này nút mới bay vào vị trí left: 135px
        nutStart.style.pointerEvents = "auto";
        nutStart.style.opacity = "1"; // Đảm bảo độ sáng
    }

    // 2. Cất nút Stop và Pause đi
    nutStop.classList.add('nut-an');
    nutPause.classList.add('nut-an');

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

nutVi.addEventListener('click', async function() {
    if (bangTien.classList.contains('nut-an')) {
        // TRƯỚC KHI HIỆN VÍ, GỌI JAVA ĐỂ LẤY SỐ DƯ
        try {
            let response = await fetch('http://localhost:8080/api/player/status');
            let data = await response.json();
            // Đắp số tiền thật vào màn hình (Thay thẻ <span> số tiền)
            document.getElementById('so-tien').innerText = data.coins;
        } catch (error) {
            console.log("Chưa bật server Java hoặc lỗi CORS:", error);
        }

        bangTien.classList.remove('nut-an');
        bangTien.classList.add('hieu-ung-bop');
    } else {
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
document.addEventListener('DOMContentLoaded', function() {
    const readyBtn = document.querySelector('.ready-button'); // Đổi class cho đúng của bạn
    const startBtn = document.querySelector('.start-button');

    // Đảm bảo ẩn ngay khi load (đề phòng CSS chưa ăn)
    startBtn.style.display = 'none';

    readyBtn.onclick = function() {
        startBtn.style.display = 'block'; // Hiện nút Start
        readyBtn.style.display = 'none';  // Ẩn nút Ready đi cho đẹp
    };
});

if (nutReady) {
    nutReady.addEventListener('click', function() {
        // 1. Làm sáng màn hình
        if (lopPhuToi) lopPhuToi.classList.add('man-hinh-sang-bung');

        // 2. Chuyển đổi màn hình (ẩn logo và nút ready)
        manHinhBatDau.classList.replace('man-hinh-hien', 'man-hinh-an');
        
        // 3. Kích hoạt hiệu ứng trượt nút Start từ trái sang
        if (nutStart) {
            // Xóa class ẩn (nếu có) và thêm class hiệu ứng
            nutStart.classList.remove('nut-an'); 
            // Cần một chút delay nhỏ để trình duyệt nhận diện việc xóa nut-an trước khi chạy animation
            setTimeout(() => {
                nutStart.classList.add('nut-start-hien');
            }, 10);
            console.log("Nút Start đang trượt vào...");
        }
    });
}

nutStart.addEventListener('click', function() {
    // Ẩn hẳn nút Start để nhường chỗ cho Stop/Pause
    this.classList.add('nut-an'); 
    this.classList.remove('nut-start-hien'); // Tạm thời bỏ class hiện để reset trạng thái

    nutStop.classList.remove('nut-an');
    nutPause.classList.remove('nut-an');
    
phut = 25; giay = 0;
    dangTamDung = false;
    hienThi.innerText = "25:00";
    batDauDemNguoc();
});
