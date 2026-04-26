import re

# Resolve style.css
with open('frontend/style.css', 'r', encoding='utf-8') as f:
    style = f.read()

def replace_style(m):
    return m.group(1) + '\n' + m.group(2)

style = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> huy/giao-dien-moi', replace_style, style, flags=re.DOTALL)

with open('frontend/style.css', 'w', encoding='utf-8') as f:
    f.write(style)


# Resolve index.html
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html_c1 = '''        <img src="asset/nutshop.PNG" alt="Cửa hàng" class="nut-cua-hang nut-an" id="mo-shop">   
        <img src="asset/nutcaidat.PNG" alt="Cài đặt" class="nut-cai-dat nut-an" id="nut-cai-dat">
        
        <div class="thanh-wrap thanh-thuc-an-wrap">
            <img src="asset/thanhthucan.PNG" alt="Thanh Thức ăn" class="thanh-frame">
            <div class="thanh-loi" id="bar-thuc-an">
                <img src="asset/Mức thức ăn.png" alt="Mức" class="thanh-muc">
            </div>
        </div>
        
        <div class="thanh-wrap thanh-cam-xuc-wrap">
            <img src="asset/thanhcamxuc.PNG" alt="Thanh cảm xúc" class="thanh-frame">
            <div class="thanh-loi" id="bar-cam-xuc">
                <img src="asset/Mức cảm xúc.png" alt="Mức" class="thanh-muc">
            </div>
        </div>
        <img src="asset/nutvitien.PNG" alt="Ví tiền" class="vi-tien nut-an" id="mo-vi">'''

html = re.sub(r'<<<<<<< HEAD.*?mo-vi".*?=======\n.*?(<div class="thanh-wrap.*?id="mo-vi">)\n>>>>>>> huy/giao-dien-moi', html_c1, html, flags=re.DOTALL, count=1)

html_c2 = '''        <div class="danh-sach-do-an">
            <!--<img src="asset/banhkem.PNG" alt="Bánh kem" class="banh-kem">
            <img src="asset/trasua.PNG" alt="Trà sữa" class="tra-sua">
            <img src="asset/banhflat.PNG" alt="Bánh flat" class="banh-flat">
            </div>-->
            
        </div>
    <p></p>
    <p></p>
    
    <!-- Popup chỉnh thời gian -->
    <div id="time-popup-overlay" class="overlay" style="display: none;">
        <div class="pixel-popup">
            <img src="asset/bangchinhthoigian.PNG" alt="Bảng chỉnh thời gian" class="popup-bg">
            <div class="close-icon" id="close-popup" aria-label="Đóng bảng"><img src="asset/dauX.svg" alt="X" width="100%"></div>

            <div class="time-display-box">
                <span id="current-time-val">25:00</span>
            </div>

            <div class="control-row">
                <button class="arrow-btn giam-btn" id="giam-time" aria-label="Giảm thời gian">
                    <img src="asset/nutgiamthoigian.PNG" alt="Giảm">
                </button>
                <button class="arrow-btn tang-btn" id="tang-time" aria-label="Tăng thời gian">
                    <img src="asset/nuttangthoigian.PNG" alt="Tăng">
                </button>
            </div>

            <button class="ok-btn" id="ok-confirm" aria-label="Xác nhận">
                <img src="asset/nutok.PNG" alt="OK">
            </button>
        </div>
    </div>
        </div>'''

html = re.sub(r'<<<<<<< HEAD.*?<div id="time-popup-overlay".*?=======\n.*?(<div class="danh-sach-do-an">.*?</div>\n    </div>\n        </div>)\n>>>>>>> huy/giao-dien-moi', html_c2, html, flags=re.DOTALL)

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

# Resolve Script.js
with open('frontend/Script.js', 'r', encoding='utf-8') as f:
    script = f.read()

# First conflict in Script.js: 
# HEAD: btnPrevMeow logic
# huy/giao-dien-moi: duplicate nutStart logic (we want to discard huy/giao-dien-moi's part here and KEEP HEAD's)
script_c1 = '''
if (btnPrevMeow) {
    btnPrevMeow.addEventListener('click', () => {
        chiSoMeoHienTai = (chiSoMeoHienTai - 1 + danhSachMeo.length) % danhSachMeo.length;
        capNhatHinhMeo();
    });
}'''
script = re.sub(r'<<<<<<< HEAD\n\nif \(btnPrevMeow\).*?=======\n.*?\n>>>>>>> huy/giao-dien-moi', script_c1, script, flags=re.DOTALL)

# Second conflict in Script.js:
# HEAD: datLaiGiaoDien() reward logic
# huy/giao-dien-moi: popup logic
# We want BOTH.
def replace_script(m):
    return m.group(1) + '\n\n' + m.group(2)

script = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> huy/giao-dien-moi', replace_script, script, flags=re.DOTALL)

with open('frontend/Script.js', 'w', encoding='utf-8') as f:
    f.write(script)

print("Conflicts resolved successfully.")
