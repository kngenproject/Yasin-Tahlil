# Hadhroh · Yasin · Tahlil · Do'a

Aplikasi web bacaan Hadhroh, Surah Yasin, Tahlil, dan Do'a — tersedia offline (PWA).

## Struktur File

```
├── index.html          ← Halaman utama (rename dari islamic-app-pro.html)
├── manifest.json       ← Web App Manifest (PWA)
├── sw.js               ← Service Worker (offline cache)
├── .nojekyll           ← Diperlukan untuk GitHub Pages
└── icons/
    ├── icon-192.png    ← Icon PWA 192×192
    └── icon-512.png    ← Icon PWA 512×512
```

## Deploy ke GitHub Pages

1. Upload semua file ke repo
2. Masuk ke **Settings → Pages**
3. Set source ke **main branch / root**
4. Akses via `https://<username>.github.io/<repo>/`

## Fitur

- 📖 Hadhroh, Surah Yasin, Tahlil, Do'a lengkap
- 🌙 Dark mode
- 🔡 Pilihan font & ukuran teks Arab
- 📵 Offline ready (PWA)
- 📲 Bisa diinstall di HP
