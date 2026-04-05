const nutStart = document.getElementById('nut-bat-dau');
const nutStop = document.getElementById('nut-stop');
const nutPause = document.getElementById('nut-pause');
const hinhMeo = document.getElementById('meo-chinh');

nutStart.addEventListener('click', function() {
    // 1. Làm mờ nút Start (Không dùng display:none để giữ bố cục)
    this.style.opacity = "0";
    this.style.pointerEvents = "none";

    // 2. Xóa lớp ẩn và thêm lớp vị trí để tạo hiệu ứng nảy
    nutStop.classList.remove('nut-an');
    nutStop.classList.add('nảy-len');

    nutPause.classList.remove('nut-an');
    nutPause.classList.add('nảy-xuong');

    nutStop.style.opacity = "1";
    nutStop.style.pointerEvents = "auto"; 
    
    // Ẩn nút Start
    this.style.opacity = "0";
    this.style.pointerEvents = "none";
    
    console.log("Nút Stop đã sẵn sàng!");

    // 3. Đổi mèo
    hinhMeo.src = "asset/meodung.GIF";
    
    console.log("Đã kích hoạt hiệu ứng nảy nút!");
});

// Khai báo biến bên ngoài để tránh bị lỗi phạm vi
let giay = 0;
let phut = 0;
let boDem = null;

nutStart.addEventListener('click', function() {
    // Hiện bảng đếm giờ
   // Hiện cả cụm bảng bao gồm ảnh nền và chữ
    const bang = document.getElementById('cum-dem-gio');
    if (bang) {
        bang.classList.remove('bang-an');
    }
    // Đổi ảnh mèo sang meodung.GIF
    hinhMeo.src = "asset/meodung.GIF";
    // 1. Hiện bảng
    bang.classList.remove('bang-an');
    bang.classList.add('bang-hien');

    // 2. Reset giờ về 0 nếu bấm lại
    giay = 0;
    phut = 0;
    clearInterval(boDem); 

    // 3. Chạy bộ đếm
    boDem = setInterval(function() {
        giay++;
        if (giay >= 60) {
            phut++;
            giay = 0;
        }

        // Định dạng 00:00
        let s = giay < 10 ? "0" + giay : giay;
        let m = phut < 10 ? "0" + phut : phut;
        hienThi.innerText = m + ":" + s;
    }, 1000);

    // ... các logic nảy nút Start/Stop của bạn giữ nguyên ...
});