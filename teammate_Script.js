// ==========================================
// 1. KHAI B├üO BIß║╛N TO├ÇN Cß╗ñC
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
let dangTamDung = false; // Biß║┐n ─æß╗â theo d├╡i xem c├│ ─æang Pause hay kh├┤ng

// ==========================================
// 2. C├üC H├ÇM Xß╗¼ L├¥ CHUNG (Viß║┐t sß║╡n ─æß╗â d├╣ng lß║íi)
// ==========================================

// H├ám chß║íy ─æß║┐m ng╞░ß╗úc
function batDauDemNguoc() {
    clearInterval(boDem); // Dß╗ìn dß║╣p bß╗Ö ─æß║┐m c┼⌐ cho an to├án
    
    boDem = setInterval(function() {
        if (giay === 0) {
            if (phut === 0) {
                // Hß║╛T GIß╗£ 25 PH├ÜT
                clearInterval(boDem);
                datLaiGiaoDien(); // Gß╗ìi h├ám reset giao diß╗çn
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

// H├ám Reset giao diß╗çn vß╗ü l├║c ch╞░a bß║Ñm Start
function datLaiGiaoDien() {
    // 1. Hiß╗çn lß║íi n├║t Start
    nutStart.style.opacity = "1";
    nutStart.style.pointerEvents = "auto";

    // 2. Cß║Ñt n├║t Stop v├á Pause ─æi
    nutStop.classList.add('nut-an');
    nutStop.classList.remove('nß║úy-len');
    
    nutPause.classList.add('nut-an');
    nutPause.classList.remove('nß║úy-xuong');
    nutPause.style.opacity = "1"; // Reset lß║íi ─æß╗Ö s├íng n├║t Pause

    // 3. M├¿o ─æi ngß╗º
    hinhMeo.src = "asset/meongu.GIF"; 
}


// ==========================================
// 3. Sß╗░ KIß╗åN Bß║ñM C├üC N├ÜT
// ==========================================

// --- N├ÜT START ---
nutStart.addEventListener('click', function() {
    this.style.opacity = "0";
    this.style.pointerEvents = "none";

    nutStop.classList.remove('nut-an');
    nutStop.classList.add('nß║úy-len');
    
    nutPause.classList.remove('nut-an');
    nutPause.classList.add('nß║úy-xuong');

    hinhMeo.src = "asset/meodung.GIF";

    if (bang) {
        bang.classList.remove('bang-an');
        bang.classList.add('bang-hien');
    }

    // Set lß║íi 25 ph├║t v├á bß║»t ─æß║ºu chß║íy
    phut = 25;
    giay = 0;
    dangTamDung = false;
    hienThi.innerText = "25:00";
    batDauDemNguoc();
});

// --- N├ÜT STOP (Dß╗¬NG Hß║▓N) ---
nutStop.addEventListener('click', function() {
    clearInterval(boDem); // Dß╗½ng ngay bß╗Ö ─æß║┐m
    hienThi.innerText = "25:00"; // Chß╗» nhß║úy vß╗ü 25:00
    datLaiGiaoDien(); // Thu dß╗ìn c├íc n├║t bß║Ñm
});

// --- N├ÜT PAUSE (Tß║áM Dß╗¬NG / ─ÉI TIß║╛P) ---
nutPause.addEventListener('click', function() {
    if (dangTamDung === false) {
        // TR╞»ß╗£NG Hß╗óP 1: ─Éang chß║íy -> Bß║Ñm v├áo ─æß╗â Tß║áM Dß╗¬NG
        clearInterval(boDem); // ─É├│ng b─âng thß╗¥i gian
        dangTamDung = true;   // Ghi nhß╗¢ l├á ─æang Pause
        
        hinhMeo.src = "asset/meongu.GIF"; // M├¿o tranh thß╗º chß╗úp mß║»t
        this.style.opacity = "0.6"; // L├ám n├║t Pause tß╗æi ─æi mß╗Öt ch├║t ─æß╗â b├ío hiß╗çu
        
    } else {
        // TR╞»ß╗£NG Hß╗óP 2: ─Éang tß║ím dß╗½ng -> Bß║Ñm v├áo ─æß╗â CHß║áY TIß║╛P
        batDauDemNguoc();     // Gß╗ìi h├ám chß║íy tiß║┐p (n├│ sß║╜ chß║íy tiß║┐p sß╗æ ph├║t/gi├óy ─æang l╞░u)
        dangTamDung = false;  // Tß║»t chß║┐ ─æß╗Ö Pause
        
        hinhMeo.src = "asset/meodung.GIF"; // M├¿o dß║¡y l├ám viß╗çc tiß║┐p
        this.style.opacity = "1"; // N├║t Pause s├íng lß║íi nh╞░ c┼⌐
    }
});
