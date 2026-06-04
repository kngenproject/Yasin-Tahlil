# Hadhroh · Yasin · Tahlil · Do'a

[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Offline Ready](https://img.shields.io/badge/Offline-Ready-2E8B57?logo=internetexplorer)](https://web.dev/offline-fallback-page/)
[![Service Worker](https://img.shields.io/badge/Service%20Worker-Cached-FFA500?logo=workbox)](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with ❤️ for Muslims](https://img.shields.io/badge/Made%20with%20❤️%20for-Muslims-00A859)]()

> **Bacaan Hadhroh (Tawassul), Surah Yāʾ Sīn, Tahlil & Do'a** — Aplikasi PWA ringan, offline pertama, dengan kustomisasi teks Arab dan tampilan.

![Screenshot Placeholder](https://via.placeholder.com/800x400?text=Hadhroh+Yasin+Tahlil+App)

---

## ✨ Fitur Utama

- **📖 Lengkap** – Hadhroh (Tawassul + 3x Al-Fatihah), Surah Yasin (ayat 1–83), Tahlil (Al-Ikhlas, Al-Falaq, An-Naas, Ayat Kursi, dzikir), dan Do'a penutup.
- **🌙 Dua Mode Tampilan** – Terang / Gelap dengan transisi halus.
- **🎨 Kustomisasi Teks Arab**:
  - 4 ukuran teks (sm, md, lg, xl)
  - 3 font pilihan (Scheherazade New, Amiri, Noto Naskh Arabic)
  - 3 tingkat ketebalan (Normal, Sedang, Tebal)
- **🎨 Warna Latar** – 7 pilihan warna (default, krem, mint, sepia, biru langit, mawar, slate gelap).
- **📱 PWA Siap Pasang** – Bisa diinstall di HP/desktop, bekerja **offline penuh**.
- **🔄 Update Cerdas** – Stale-while-revalidate dengan notifikasi pembaruan konten.
- **⬆️ Tombol Scroll ke Atas** – Muncul saat gulir ke bawah.
- **📶 Indikator Offline** – Banner peringatan saat koneksi terputus.

---

## 🚀 Cara Menggunakan

### Secara Online (langsung dari browser)
1. Buka `index.html` di browser modern (Chrome, Edge, Firefox, Safari).
2. Navigasi via bottom navigation: **Hadhroh** → **Yasin** → **Tahlil** → **Do'a**.
3. Klik ikon ⚙️ di header untuk membuka panel pengaturan (tema, font, ukuran, warna latar).

### Instalasi sebagai Aplikasi (PWA)
- **Android / ChromeOS**: Buka menu browser → "Install app" / "Pasang aplikasi".
- **iOS (Safari)**: Gunakan "Share" → "Add to Home Screen".
- **Desktop Chrome / Edge**: Klik ikon install di address bar (⊕) atau dari menu.

Setelah terinstal, aplikasi akan bekerja **sepenuhnya offline** dan memiliki ikon di launcher.

---

## 🛠️ Teknologi & Struktur

| File | Deskripsi |
|------|------------|
| `index.html` | Semua antarmuka (UI tabs, setting sheet, konten Arab, navigasi) dan logika JS (tab, theme, font, weight, bg-color, offline, PWA installer). |
| `manifest.json` | Metadata PWA (nama, ikon, theme_color, orientasi portrait, standalone display). |
| `sw.js` | Service Worker dengan strategi **stale-while-revalidate** untuk HTML dan **cache-first** untuk aset. Deteksi perubahan konten & kirim notifikasi ke halaman. |

### Arsitektur Kunci

- **CSS Custom Properties** (CSS variables) untuk tema, ukuran font, warna latar, dan transisi.
- **Vanilla JavaScript** tanpa framework → performa ringan & dependency-free.
- **LocalStorage** untuk menyimpan preferensi pengguna (tema, font, ukuran, warna latar).
- **Service Worker**:
  - Cache semua file utama saat install.
  - Pada fetch HTML: sajikan cache lalu revalidate di background.
  - Jika konten berubah, kirim pesan `SW_UPDATED` → muncul toast "Pembaruan tersedia".
  - Cache aset statis (font, gambar, dll) dengan cache-first.

---

## 📦 Instalasi & Development (Local)

```bash
# Clone repository
git clone https://github.com/your-username/hadhroh-yasin-tahlil.git
cd hadhroh-yasin-tahlil

# Tidak perlu build — langsung jalankan
# Gunakan server lokal (misal live-server, python http.server)
python3 -m http.server 8000
# atau
npx live-server