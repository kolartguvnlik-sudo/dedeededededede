// nav.js - KOLART Merkezi Sistem (Profil, Ayarlar, Konum, Acil Durum & Navigasyon)
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const siteID = localStorage.getItem("siteID");
    const userName = (currentUser?.name || currentUser?.username || "GÜVENLİK").toUpperCase();

    // KOPYALAMA VE SEÇME ENGELLEME (JS)
    document.addEventListener("contextmenu", (e) => e.preventDefault(), false);

    // 1. TÜM SİSTEM MODALLARI VE NAVİGASYON (HTML ENJEKSİYONU)
    const systemHTML = `
    <div id="profileMenuModal" class="modal-overlay" onclick="toggleProfileMenu(false)" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 20000; display: none; justify-content: center; align-items: flex-end;">
        <div class="modal-content" onclick="event.stopPropagation()" style="width: 100%; max-width: 390px; background: #161616; border-radius: 30px 30px 0 0; padding: 30px 20px; border-top: 1px solid #CCFF00; transform: translateY(100%); transition: transform 0.3s ease;">
            <div class="modal-title" style="font-weight: 900; font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><span class="material-symbols-outlined">account_circle</span> Profil İşlemleri</div>
            <div class="menu-btn" onclick="openSettings()" style="width: 100%; padding: 18px; background: #000; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; color: #fff; display: flex; align-items: center; gap: 15px; margin-bottom: 12px; cursor: pointer; font-weight: 700;"><span class="material-symbols-outlined" style="color:#CCFF00">settings</span><span>Profil Ayarlarım</span></div>
            <div class="menu-btn" onclick="sendLiveLocation()" style="width: 100%; padding: 18px; background: #000; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; color: #fff; display: flex; align-items: center; gap: 15px; margin-bottom: 12px; cursor: pointer; font-weight: 700;"><span class="material-symbols-outlined" style="color:#CCFF00">share_location</span><span>Merkeze Konum Gönder</span></div>
            <div class="menu-btn" onclick="window.location.href='egitim.html'" style="width: 100%; padding: 18px; background: #000; border: 1px solid #3498db33; border-radius: 16px; color: #fff; display: flex; align-items: center; gap: 15px; margin-bottom: 12px; cursor: pointer; font-weight: 700;"><span class="material-symbols-outlined" style="color:#3498db">school</span><span>Eğitim Paneli</span></div>
            <button class="modal-btn btn-secondary" onclick="toggleProfileMenu(false)" style="width: 100%; padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #fff; border:none; font-weight:900;">VAZGEÇ</button>
        </div>
    </div>

    <div id="settingsModal" class="modal-overlay" onclick="closeSettings()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 21000; display: none; justify-content: center; align-items: flex-end;">
        <div class="modal-content" onclick="event.stopPropagation()" style="width: 100%; max-width: 390px; background: #161616; border-radius: 30px 30px 0 0; padding: 30px 20px; border-top: 1px solid #CCFF00; transform: translateY(100%); transition: transform 0.3s ease;">
            <div class="modal-title" style="font-weight: 900; font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;"><span class="material-symbols-outlined" style="color:#CCFF00">manage_accounts</span>Profil Ayarları</div>
            <div style="margin-bottom: 15px;"><label style="display:block; font-size:10px; color:rgba(255,255,255,0.4); text-transform:uppercase; margin-bottom:5px; font-weight:800;">Personel Adı</label><input type="text" id="profName" disabled value="${userName}" style="width:100%; background:#000; border:1px solid rgba(255,255,255,0.05); padding:12px; border-radius:12px; color:#fff; opacity:0.6;"></div>
            <div style="margin-bottom: 15px;"><label style="display:block; font-size:10px; color:rgba(255,255,255,0.4); text-transform:uppercase; margin-bottom:5px; font-weight:800;">Telefon Numarası</label><input type="tel" id="newPhone" style="width:100%; background:#000; border:1px solid rgba(255,255,255,0.05); padding:12px; border-radius:12px; color:#fff;"></div>
            <div style="margin-bottom: 15px; position:relative;">
                <label style="display:block; font-size:10px; color:rgba(255,255,255,0.4); text-transform:uppercase; margin-bottom:5px; font-weight:800;">Yeni Şifre</label>
                <input type="password" id="newPass" placeholder="ŞİFREYİ YAZIN" style="width:100%; background:#000; border:1px solid rgba(255,255,255,0.05); padding:12px; border-radius:12px; color:#fff;">
                <small style="font-size: 9px; color: #CCFF00; display: block; margin-top: 5px;">* Şifre otomatik büyük harfe çevrilir.</small>
            </div>
            <button class="modal-btn" onclick="updateProfileFromNav()" style="width: 100%; padding: 15px; border-radius: 12px; background: #CCFF00; color: #000; border:none; font-weight:900; margin-bottom:10px;">BİLGİLERİ GÜNCELLE</button>
            <button class="modal-btn" onclick="closeSettings()" style="width: 100%; padding: 15px; border-radius: 12px; background: rgba(255,255,255,0.05); color: #fff; border:none; font-weight:900;">VAZGEÇ</button>
        </div>
    </div>

    <div id="locationStatusModal" class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 22000; display: none; justify-content: center; align-items: flex-end;">
        <div class="modal-content" style="width: 100%; max-width: 390px; background: #161616; border-radius: 30px 30px 0 0; padding: 40px 20px; border-top: 1px solid #CCFF00; text-align:center;">
            <div id="locStatusIconArea"></div>
            <h2 id="locStatusTitle" style="font-weight: 900; margin-bottom: 10px; color:#fff;">KONUM ALINIYOR...</h2>
            <p id="locStatusDesc" style="font-size: 14px; opacity: 0.7; margin-bottom: 30px; color:#fff;"></p>
            <button id="locModalCloseBtn" class="modal-btn" onclick="closeLocModal()" style="width: 100%; padding: 15px; border-radius: 12px; background: #CCFF00; color: #000; border:none; font-weight:900; display:none;">ANLADIM</button>
        </div>
    </div>

    <nav id="main-nav" style="display: grid; grid-template-columns: repeat(6, 1fr); position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 390px; background: #080808; padding: 12px 5px 25px 5px; border-top: 1px solid rgba(255, 255, 255, 0.08); z-index: 10000; box-shadow: 0 -10px 30px rgba(0,0,0,0.5);">
        <a href="guvenlik.html" class="nav-link" id="nav-home" style="display:flex; flex-direction:column; align-items:center; color:rgba(255,255,255,0.4); text-decoration:none; font-size:9px; font-weight:bold; gap:4px;">
            <span class="material-symbols-outlined">home</span><span>Ana Sayfa</span>
        </a>
        <a href="gecmis.html" class="nav-link" id="nav-gecmis" style="display:flex; flex-direction:column; align-items:center; color:rgba(255,255,255,0.4); text-decoration:none; font-size:9px; font-weight:bold; gap:4px;">
            <span class="material-symbols-outlined">description</span><span>Geçmiş</span>
        </a>
        <a href="cizelge.html" class="nav-link" id="nav-cizelge" style="display:flex; flex-direction:column; align-items:center; color:rgba(255,255,255,0.4); text-decoration:none; font-size:9px; font-weight:bold; gap:4px;">
            <span class="material-symbols-outlined">calendar_month</span><span>Çizelge</span>
        </a>
        <a href="mesajj.html" class="nav-link" id="nav-talimatlar" style="display:flex; flex-direction:column; align-items:center; color:rgba(255,255,255,0.4); text-decoration:none; font-size:9px; font-weight:bold; gap:4px; position:relative;">
            <span id="talimat-icon" class="material-symbols-outlined">notifications</span><span>Talimatlar</span>
            <div id="msgBadge" style="display:none; position:absolute; top:-5px; right:10px; background:#FF4D4D; color:white; font-size:9px; padding:2px 5px; border-radius:10px;">0</div>
        </a>
        <a onclick="toggleProfileMenu(true)" class="nav-link" id="nav-profil" style="display:flex; flex-direction:column; align-items:center; color:rgba(255,255,255,0.4); text-decoration:none; font-size:9px; font-weight:bold; gap:4px; cursor:pointer;">
            <span class="material-symbols-outlined">account_circle</span><span>Profil</span>
        </a>
        <a href="index.html" onclick="directLogout()" class="nav-link" id="nav-logout" style="display:flex; flex-direction:column; align-items:center; color:#FF4D4D; text-decoration:none; font-size:9px; font-weight:bold; gap:4px; cursor:pointer;">
            <span class="material-symbols-outlined">logout</span><span>Çıkış</span>
        </a>
    </nav>
    `;

    document.body.insertAdjacentHTML('beforeend', systemHTML);

    // Aktif Sayfa İşaretleme
    const currentPage = window.location.pathname.split("/").pop();
    const pageMap = { "guvenlik.html": "nav-home", "gecmis.html": "nav-gecmis", "cizelge.html": "nav-cizelge", "mesajj.html": "nav-talimatlar" };
    if (pageMap[currentPage]) {
        const el = document.getElementById(pageMap[currentPage]);
        if (el) el.style.color = "#CCFF00";
    }
});

// --- PROFİL VE AYARLAR FONKSİYONLARI ---
window.toggleProfileMenu = (show) => {
    const modal = document.getElementById('profileMenuModal');
    const content = modal.querySelector('.modal-content');
    if(show) {
        modal.style.display = 'flex';
        setTimeout(() => content.style.transform = 'translateY(0)', 10);
    } else {
        content.style.transform = 'translateY(100%)';
        setTimeout(() => modal.style.display = 'none', 300);
    }
};

window.openSettings = () => {
    toggleProfileMenu(false);
    const modal = document.getElementById('settingsModal');
    const content = modal.querySelector('.modal-content');
    modal.style.display = 'flex';
    setTimeout(() => content.style.transform = 'translateY(0)', 10);
};

window.closeSettings = () => {
    const modal = document.getElementById('settingsModal');
    modal.querySelector('.modal-content').style.transform = 'translateY(100%)';
    setTimeout(() => modal.style.display = 'none', 300);
};

// --- KONUM GÖNDERME SİSTEMİ ---
window.sendLiveLocation = () => {
    toggleProfileMenu(false);
    const statusModal = document.getElementById('locationStatusModal');
    const statusTitle = document.getElementById('locStatusTitle');
    const statusDesc = document.getElementById('locStatusDesc');
    const statusIconArea = document.getElementById('locStatusIconArea');
    const closeBtn = document.getElementById('locModalCloseBtn');

    statusModal.style.display = 'flex';
    statusIconArea.innerHTML = '<div style="border:3px solid rgba(204,255,0,0.1); border-top:3px solid #CCFF00; border-radius:50%; width:50px; height:50px; animation:spin 1s linear infinite; margin:0 auto 15px;"></div>';
    statusTitle.innerText = "KONUM ALINIYOR...";
    statusDesc.innerText = "Lütfen bekleyin, GPS verisi doğrulanıyor.";
    closeBtn.style.display = "none";

    if (!navigator.geolocation) {
        updateLocModalNav("HATA", "GPS desteği yok.", "error");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
        updateLocModalNav("BAŞARILI", "Konumunuz merkeze iletildi.", "success");
    }, (err) => {
        updateLocModalNav("HATA", "Konum izni reddedildi.", "error");
    }, { enableHighAccuracy: true });
};

function updateLocModalNav(title, desc, type) {
    document.getElementById('locStatusTitle').innerText = title;
    document.getElementById('locStatusDesc').innerText = desc;
    document.getElementById('locModalCloseBtn').style.display = "block";
    const iconArea = document.getElementById('locStatusIconArea');
    if(type === "success") {
        document.getElementById('locStatusTitle').style.color = "#00E676";
        iconArea.innerHTML = '<span class="material-symbols-outlined" style="font-size:48px; color:#00E676">check_circle</span>';
    } else {
        document.getElementById('locStatusTitle').style.color = "#FF4D4D";
        iconArea.innerHTML = '<span class="material-symbols-outlined" style="font-size:48px; color:#FF4D4D">error</span>';
    }
}

window.closeLocModal = () => {
    document.getElementById('locationStatusModal').style.display = 'none';
};

// --- ÇIKIŞ ---
window.directLogout = () => {
    // Tarayıcının seçme özelliğini ve fokusunu anında sıfırla
    window.getSelection().removeAllRanges();
    
    sessionStorage.clear();
    localStorage.removeItem("currentUser");
    // href="index.html" olduğu için replace'e gerek kalmadı, tarayıcı kendisi gidecek.
};

// CSS Spin Animasyonu ve Seçme Engelleme (JS içinden ekleme)
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    * { 
        -webkit-user-select: none !important; 
        -moz-user-select: none !important; 
        -ms-user-select: none !important; 
        user-select: none !important; 
        -webkit-touch-callout: none !important; 
        -webkit-tap-highlight-color: transparent !important; /* Mobilde tıklama efektini siler */
    }
    input, textarea { 
        -webkit-user-select: text !important; 
        -moz-user-select: text !important; 
        -ms-user-select: text !important; 
        user-select: text !important; 
    }
`;
document.head.appendChild(style);