// ============ PHẦN 1: LIÊN KẾT GIAO DIỆN ============
const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');

// Nếu bên HTML chưa có thẻ <input id="input"> thì code vẫn chạy với 25 phút
const _NhapThoiGian = document.getElementById('input'); 
const hienThi = document.getElementById('so-giay');
const bang = document.getElementById('cum-dem-gio');

// ============ PHẦN 2: CÁC BIẾN HOẠT ĐỘNG ============
let DangChay = false;
let ThoiGianConLai = 0; // Đơn vị: giây
let BienDemThoiGian = null;
let dangTamDung = false;

// YÊU CẦU 1: Âm thanh khi hết giờ (Bạn cần tạo 1 file mp3 tên là "ting.mp3" để cùng chỗ với file html)
const amThanhTing = new Audio('ting.mp3'); 

// ============ PHẦN 3: CÁC HÀM XỬ LÝ ============

// Cập nhật lại giao diện và Tab tiêu đề
function CapNhatHienThi(giay) {
    const phut = Math.floor(giay / 60);
    const _giay = giay % 60;

    const hienthiphut = phut < 10 ? "0" + phut : phut;
    const hienthigiay = _giay < 10 ? "0" + _giay : _giay;

    const chuoiHienThi = hienthiphut + ":" + hienthigiay;
    
    if (hienThi) hienThi.innerText = chuoiHienThi;

    // YÊU CẦU 4: Khi chuyển tab khác, thời gian vẫn tiếp tục hiện trên thanh tab
    document.title = `(${chuoiHienThi}) Pomodoro`;
}

// YÊU CẦU 2: Nhấn Stop là hủy (Về lại bằng 0 và không đếm nữa)
function HuyBo() { 
    clearInterval(BienDemThoiGian);
    DangChay = false;
    dangTamDung = false;
    ThoiGianConLai = 0;
    
    if (hienThi) hienThi.innerText = "00:00";
    document.title = "Mèo Pomodoro";
    
    if (hinhMeo) hinhMeo.src = "asset/meongu.GIF";
    if (bang) bang.classList.add('bang-an');       
    
    // Nút START hiện lại rực rỡ để bấm được
    if (nutStart) {
        nutStart.classList.remove('nut-an');
        nutStart.classList.add('nảy-xuong');
        nutStart.style.opacity = "1"; 
        nutStart.style.pointerEvents = "auto";
    }
    
    // Ẩn nút Stop và Pause chờ lượt mới
    if (nutStop) nutStop.classList.add('nut-an');
    if (nutPause) nutPause.classList.add('nut-an');
}   


// YÊU CẦU 1: Đến hết thời gian thì kêu tiếng ting
function HetGio() { 
    setTimeout(() => {
        // Mở nhạc Ting Ting
        amThanhTing.play().catch(e => console.log("Lỗi: Không tìm thấy file ting.mp3"));

        alert("Hết giờ rồi, giỏi lắm!");
        HuyBo(); // Chạy hàm hủy (reset dọn dẹp mọi thứ về ban đầu)
    }, 500);
}

// YÊU CẦU 1: Nút start bấm chạy đếm lùi
function BamGio() { 
    if (DangChay && !dangTamDung) return; // Đang chạy bình thường thì không cho click Start thêm nữa
    
    if (!DangChay) { // Chơi một ván mới hoàn toàn
        // YÊU CẦU 3: Chỉnh thời gian đếm ngược tuỳ ý 
        let soPhutNhap = 25; // Nhưng mặc định là 25 phút nếu nhác nhập
        if (_NhapThoiGian && _NhapThoiGian.value) {
            soPhutNhap = parseInt(_NhapThoiGian.value);
            if (isNaN(soPhutNhap) || soPhutNhap <= 0) {
                alert("Bạn nhập số phút tào lao rồi, nhập lại nhen!");
                return;
            }
        }
        ThoiGianConLai = soPhutNhap * 60; // VD nhập 5 => 5 x 60 = 300 giây
    }

    DangChay = true;
    dangTamDung = false;

    // Gán hoạt ảnh Giao diện khi bắt đầu chạy
    if (bang) {
        bang.classList.remove('bang-an');
        bang.classList.add('bang-hien');
    }
    if (hinhMeo) hinhMeo.src = "asset/meodung.GIF";
    
    if (nutStart) {
        nutStart.style.opacity = "0"; // Làm mờ Start
        nutStart.style.pointerEvents = "none";
    }
    if (nutStop) {
        nutStop.classList.remove('nut-an');
        nutStop.classList.add('nảy-len');
        nutStop.style.opacity = "1";
        nutStop.style.pointerEvents = "auto";
    }
    if (nutPause) {
        nutPause.classList.remove('nut-an');
        nutPause.classList.add('nảy-xuong');
        nutPause.style.opacity = "1";
        nutPause.style.pointerEvents = "auto";
    }

    CapNhatHienThi(ThoiGianConLai); // In đồng hồ lần đầu

    // Xoá bộ đếm cũ cẩn thận để không bị đếm chồng
    clearInterval(BienDemThoiGian);
    BienDemThoiGian = setInterval(function() {
        ThoiGianConLai--; 
        
        if (ThoiGianConLai <= 0) {
            CapNhatHienThi(0);
            clearInterval(BienDemThoiGian);
            HetGio();
        } else {
            CapNhatHienThi(ThoiGianConLai);
        }
    }, 1000);
}

// YÊU CẦU 2: Pause là tạm dừng (nhưng ko reset giờ)
function TamDung() { 
    if (DangChay && !dangTamDung) {
        clearInterval(BienDemThoiGian); // Dừng đếm thời gian lại
        dangTamDung = true;
        
        if (hinhMeo) hinhMeo.src = "asset/meongu.GIF"; // Đổi về mèo ngủ 
        alert("Đã tạm dừng! Bấm vào 'Start' để tính giờ tiếp.");
        
        if (nutStart) {
            nutStart.style.opacity = "1"; // Cho phép nút Start bấm lại được để tiếp tục (Resume)
            nutStart.style.pointerEvents = "auto"; 
        }
    }
}

// ============ PHẦN 4: GẮN SỰ KIỆN NÚT BẤM ============
if (nutStart) nutStart.addEventListener('click', BamGio);
if (nutStop) nutStop.addEventListener('click', HuyBo); 
if (nutPause) nutPause.addEventListener('click', TamDung);