let macDinhPhut = 25;
let phut = macDinhPhut;
let giay = 0;
let boDem = null;
let dangTamDung = false;
let dangDemGio = false;

export function getTimerState() {
    return { macDinhPhut, phut, giay, dangTamDung, dangDemGio };
}

export function setMacDinhPhut(val) {
    macDinhPhut = val;
}

export function resetTimer() {
    clearInterval(boDem);
    phut = macDinhPhut;
    giay = 0;
    dangTamDung = false;
    dangDemGio = false;
}

export function pauseTimer() {
    if (!dangTamDung) {
        clearInterval(boDem);
        dangTamDung = true;
    }
}

export function startTimer(onTick, onComplete) {
    if (!dangTamDung && !dangDemGio) {
        phut = macDinhPhut;
        giay = 0;
    }
    dangTamDung = false;
    dangDemGio = true;

    clearInterval(boDem);
    boDem = setInterval(() => {
        if (giay === 0) {
            if (phut === 0) {
                clearInterval(boDem);
                dangDemGio = false;
                onComplete();
                return;
            }
            phut--;
            giay = 59;
        } else {
            giay--;
        }
        
        let tongGiayHienTai = phut * 60 + giay;
        let tongGiayBanDau = macDinhPhut * 60;
        let phanTram = (tongGiayHienTai / tongGiayBanDau) * 100;
        
        onTick(phut, giay, phanTram);
    }, 1000);
}

export function formatTime(p, g = 0) {
    const m = p < 10 ? "0" + p : String(p);
    const s = g < 10 ? "0" + g : String(g);
    return m + ":" + s;
}
