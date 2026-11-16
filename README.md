# Deniz Kromaj Yüzey Teknoloji — web sitesi (v2)

Statik site: HTML + CSS + vanilla JS. Build adımı yok.

## Dosyalar
- `index.html` — tek sayfa (hero, kaplamalar, katman modeli, süreç, standartlar, sektörler, hakkımızda, iletişim)
- `css/style.css` — tüm stiller (renkler `:root` içinde)
- `js/intro.js` — açılış animasyonu (oturum başına bir kez oynar, "Atla" ve Esc ile geçilir, `prefers-reduced-motion` açıksa oynamaz)
- `js/main.js` — menü, filtreler, katman modeli, teklif formu (WhatsApp'a gönderir)

## Görseller
Kod, sunucudaki mevcut `assets/` klasörünü kullanır:
`assets/logo-beyaz.png`, `assets/logo-renkli.png`, `assets/kaplama-{cerakote,kalay,krom,eloksal,alodin,bakir,nikel}.webp`.
Görsel yoksa logo yerine metin, kaplama görseli yerine renkli bir krom küre gösterilir.

## Yayına alma (cPanel)
1. `public_html` içindeki eski `index.html` dosyasını yedekle (ör. `index-eski.html`).
2. Bu zip'i `public_html` içine yükle ve **Extract** et. `assets/` klasörüne dokunma.
3. Tarayıcıda siteyi aç; intro'yu tekrar görmek için gizli sekme kullan.

## Yapılacaklar
- Firma e-posta adresi gelince iletişim kartlarına ve forma ekle (`js/main.js` → `WA` sabitinin yanına).
- Sertifikalar (AS9100, ISO 9001 vb.) varsa "Kalite ve standartlar" bölümüne ekle.
- Intro'daki "25 µm" kalınlık sayacını firmanın tipik değerine göre ayarla (`js/intro.js`, `lv * 25`).
