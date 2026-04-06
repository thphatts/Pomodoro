const nutStart = document.getElementById('nut-bat-dau') || document.getElementById('start');
const nutStop = document.getElementById('nut-stop') || document.getElementById('stop-btn');
const nutPause = document.getElementById('nut-pause') || document.getElementById('pause-btn');
const hinhMeo = document.getElementById('meo-chinh') || document.getElementById('cat');
const bang = document.getElementById('cum-dem-gio') || document.querySelector('.timer-container');
const hienThi = document.getElementById('so-giay') || document.getElementById('timer-display');

// Âm thanh kêu "Ting" khi hết giờ (tạo động để không phụ thuộc HTML)
const amThanhTing = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

// Cấu hình thời gian và trạng thái
let thoiGianGocMacDinh = 25 * 60; // Số giây mặc định (25 phút)
let thoiGianConLai = thoiGianGocMacDinh;
let boDem = null;
let dangChay = false;
let tieuDeGoc = document.title || "Mèo Pomodoro";

// ----------------------------------------------------
// HÀM: Cập nhật đồng hồ và hiển thị trên tiêu đề Tab 
// ----------------------------------------------------
function capNhatHienThi(giay) {
    let m = Math.floor(giay / 60);
    let s = giay % 60;
    
    // Định dạng kiểu 00:00
    let chuoiHienThi = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
    
    if (hienThi) {
        hienThi.innerText = chuoiHienThi;
    }
    
    // [YÊU CẦU 4]: Khi thoát web thời gian hiện trên thanh tab
    if (dangChay) {
        document.title = chuoiHienThi + " - Tập trung!";
    } else {
        document.title = tieuDeGoc;
    }
}

// Khởi tạo hiển thị lần đầu
capNhatHienThi(thoiGianConLai);

// ----------------------------------------------------
// [YÊU CẦU 3]: LẤY DỮ LIỆU TỪ Ô NHẬP
// ----------------------------------------------------
const oNhapPhut = document.getElementById('_input');

// ----------------------------------------------------
// [YÊU CẦU 1]: ẤN START CHẠY NGƯỢC, HẾT GIỜ KÊU TING
// ----------------------------------------------------
if (nutStart) {
    nutStart.addEventListener('click', function() {
        if (thoiGianConLai <= 0) {
            alert("Vui lòng nhấp vào đồng hồ để đặt lại thời gian!");
            return;
        }

        // Đổi giao diện nút Start
        this.style.opacity = "0";
        this.style.pointerEvents = "none";

        // Hiện nút Stop & Pause
        if (nutStop && nutPause) {
            // Nảy lên cho Stop
            nutStop.classList.remove('nut-an');
            nutStop.classList.add('nảy-len');
            nutStop.style.opacity = "1";
            nutStop.style.pointerEvents = "auto"; 

            // Nảy xuống cho Pause
            nutPause.classList.remove('nut-an');
            nutPause.classList.add('nảy-xuong');
            nutPause.style.opacity = "1";
            nutPause.style.pointerEvents = "auto";
        }
        
        // Hiện bảng nền đồng hồ nếu có
        if (bang) {
            bang.classList.remove('bang-an');
            bang.classList.add('bang-hien');
        }

        // Đổi mèo sang trạng thái đứng/tập trung
        if (hinhMeo) {
            hinhMeo.src = "asset/meodung.gif";
        }

        dangChay = true;
        
        // Lấy thời gian từ ô nhập
        if (oNhapPhut && oNhapPhut.value) {
            let phutNhap = parseInt(oNhapPhut.value);
            if (!isNaN(phutNhap) && phutNhap > 0) {
                thoiGianConLai = phutNhap * 60;
                thoiGianGocMacDinh = thoiGianConLai;
            }
        }
        capNhatHienThi(thoiGianConLai);
        
        // Bắt đầu đếm ngược thời gian
        if (boDem) clearInterval(boDem);
        
        boDem = setInterval(function() {
            if (thoiGianConLai > 0) {
                thoiGianConLai--;
                capNhatHienThi(thoiGianConLai);
            } else {
                // KHI HẾT GIỜ (Thời gian = 0)
                clearInterval(boDem);
                dangChay = false;
                
                // Phát tiếng "Ting"
                amThanhTing.play().catch(e => console.log("LỖI âm thanh: " + e));
                alert("Hoàn thành! Bạn đã tập trung rất tốt.");
                
                resetGiaoDien();
            }
        }, 1000);
    });
}

// ----------------------------------------------------
// [YÊU CẦU 2]: NÚT PAUSE (Tạm dừng khi đang chạy)
// ----------------------------------------------------
if (nutPause) {
    nutPause.addEventListener('click', function() {
        if (dangChay) {
            // HÀNH ĐỘNG DỪNG
            clearInterval(boDem);
            dangChay = false;
            document.title = "(Tạm dừng) " + tieuDeGoc;
            
            // Đổi CSS làm mờ nhẹ biểu thị trạng thái đang pause
            nutPause.style.opacity = "0.6"; 
            if (hinhMeo) hinhMeo.src = "asset/meongu.gif"; 
        } else if (thoiGianConLai > 0) {
            // HÀNH ĐỘNG TIẾP TỤC
            nutPause.style.opacity = "1"; 
            dangChay = true;
            if (hinhMeo) hinhMeo.src = "asset/meodung.gif";

            boDem = setInterval(function() {
                if (thoiGianConLai > 0) {
                    thoiGianConLai--;
                    capNhatHienThi(thoiGianConLai);
                } else {
                    clearInterval(boDem);
                    dangChay = false;
                    amThanhTing.play();
                    alert("Hoàn thành!");
                    resetGiaoDien();
                }
            }, 1000);
        }
    });
}

// ----------------------------------------------------
// [YÊU CẦU 2]: NÚT STOP (Hủy bỏ tiến trình hiện tại)
// ----------------------------------------------------
if (nutStop) {
    nutStop.addEventListener('click', function() {
        clearInterval(boDem);
        dangChay = false;
        
        // Trả lại thời gian ban đầu đã thiết lập
        thoiGianConLai = thoiGianGocMacDinh; 
        capNhatHienThi(thoiGianConLai);
        
        resetGiaoDien();
    });
}

// ----------------------------------------------------
// HÀM PHỤ: Trả sự kiện nút và hình ảnh về lúc ban đầu
// ----------------------------------------------------
function resetGiaoDien() {
    document.title = tieuDeGoc;
    
    // Phục hồi hộp Start
    if (nutStart) {
        nutStart.style.opacity = "1";
        nutStart.style.pointerEvents = "auto";
    }
    
    // Gỡ Stop / Pause
    if (nutStop && nutPause) {
        nutStop.style.opacity = "0";
        nutStop.style.pointerEvents = "none";
        nutStop.classList.add('nut-an');
        nutStop.classList.remove('nảy-len');
        
        nutPause.style.opacity = "0";
        nutPause.style.pointerEvents = "none";
        nutPause.classList.add('nut-an');
        nutPause.classList.remove('nảy-xuong');
        nutPause.style.opacity = "1"; 
    }

    // Đưa mèo trở lại ngủ gật
    if (hinhMeo) {
        hinhMeo.src = "asset/meongu.gif";
    }
}
