// ==========================================
// 1. KHAI BÁO BIẾN TOÀN CỤC
// ==========================================
const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');
const bang = document.getElementById('cum-dem-gio');
const hienThi = document.getElementById('so-giay'); 

// Thêm biến cho các yêu cầu bổ sung
const _NhapThoiGian = document.getElementById('input'); 
const amThanhTing = new Audio('ting.mp3');

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
                // YÊU CẦU 1: HẾT GIỜ THÌ KÊU VÀ HIỆN THÔNG BÁO
                clearInterval(boDem);
                setTimeout(() => {
                    amThanhTing.play().catch(e => console.log("Lỗi: Không tìm thấy file ting.mp3"));
                    alert("Hết giờ rồi, giỏi lắm!");
                    datLaiGiaoDien(); // Gọi hàm reset giao diện
                }, 500);
                return; 
            }
            phut--;      
            giay = 59;   
        } else {
            giay--;      
        }

        let s = giay < 10 ? "0" + giay : giay;
        let m = phut < 10 ? "0" + phut : phut;
        let chuoiHienThi = m + ":" + s;
        
        hienThi.innerText = chuoiHienThi;
        
        // YÊU CẦU 4: Cập nhật tiêu đề Tab ngay cả khi thoát web
        document.title = `(${chuoiHienThi}) Pomodoro`;
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
    dangTamDung = false; // Reset trạng thái Pause
    
    // Reset luôn tiêu đề
    document.title = "Mèo Pomodoro";
    hienThi.innerText = "00:00"; 

    // 3. Mèo đi ngủ
    hinhMeo.src = "asset/meongu.GIF"; 
    
    // Ẩn bảng đồng hồ (tuỳ chọn)
    if (bang) bang.classList.add('bang-an');
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

    // YÊU CẦU 3: Lấy thời gian đếm ngược tùy ý từ Input
    let soPhutNhap = 25; 
    if (_NhapThoiGian && _NhapThoiGian.value) {
        soPhutNhap = parseInt(_NhapThoiGian.value);
        if (isNaN(soPhutNhap) || soPhutNhap <= 0) {
            alert("Vui lòng nhập số phút hợp lệ!");
            datLaiGiaoDien();
            return;
        }
    }
    
    phut = soPhutNhap;
    giay = 0;
    dangTamDung = false;
    
    let m = phut < 10 ? "0" + phut : phut;
    let chuoiHienThi = m + ":00";
    hienThi.innerText = chuoiHienThi;
    document.title = `(${chuoiHienThi}) Pomodoro`;

    batDauDemNguoc();
});

// --- NÚT STOP (DỪNG HẲN) ---
nutStop.addEventListener('click', function() {
    clearInterval(boDem); // Dừng ngay bộ đếm
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