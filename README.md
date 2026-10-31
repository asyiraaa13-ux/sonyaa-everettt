# Sonyaa Everett — Website Seleksi Staff
Website SPA (HTML/CSS/JS) + Firebase (Auth & Firestore).

## Menjalankan
- Lokal: `npx serve .` atau `python3 -m http.server` lalu buka http://localhost:8000 (jangan buka via file://, agar audio & Firebase jalan).
- Deploy: unggah seluruh folder ke Netlify / Firebase Hosting / GitHub Pages.

## Konfigurasi Firebase
1. console.firebase.google.com → buat proyek → tambahkan Web App → salin config ke `FIREBASE_CONFIG` di `js/main.js`.
2. Aktifkan Authentication (Email/Password) dan Cloud Firestore.
3. Buat akun admin di Authentication, lalu di Firestore buat dokumen `admins/{UID}` dengan field `username`, `role`, `permissions`.
4. Tempel rules di bawah ke Firestore → Rules.

```
rules_version = '2';
service cloud.firestore { match /databases/{db}/documents {
  function isAdmin(){ return request.auth != null && exists(/databases/$(db)/documents/admins/$(request.auth.uid)); }
  match /applicants/{id} {
    allow get: if true;            // hanya bisa dibaca bila tahu ID unik
    allow list: if isAdmin();
    allow create: if request.resource.data.status == 'PENDING' && request.resource.data.application_id == id && request.resource.data.reviewed_by == null;
    allow update: if isAdmin();
  }
  match /application_logs/{id} { allow read, create: if isAdmin(); }
  match /admins/{uid} { allow get: if request.auth != null && request.auth.uid == uid; }
  match /global_chat/{id} { allow read: if true; allow create: if request.resource.data.keys().hasOnly(['n','m','t']) && request.resource.data.m.size() <= 300; }
} }
```
Catatan keamanan: verifikasi nomor WhatsApp di halaman status dicek di sisi browser. Untuk verifikasi yang ketat, pindahkan pengecekan ke Cloud Function.

## Aset
- Video: `assets/videos/live.mp4` (ganti file untuk mengubah video).
- Suara: `assets/sounds/*.wav` (click, open, close, error, success, fail) — sintetis, bebas hak cipta, boleh diganti.
