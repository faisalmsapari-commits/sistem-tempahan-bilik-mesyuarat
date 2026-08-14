# MPLBP e-BILIK

### Sistem Pengurusan Tempahan Bilik Mesyuarat Bersepadu
**Majlis Perbandaran Langkawi Bandaraya Pelancongan (MPLBP)**

---

## 1. Pengenalan Sistem

**MPLBP e-BILIK** ialah sebuah aplikasi web pengurusan fasiliti dan tempahan bilik mesyuarat bersepadu bertaraf korporat yang dibangunkan khusus untuk kegunaan warga kerja **Majlis Perbandaran Langkawi Bandaraya Pelancongan (MPLBP)**.

Sistem ini direka bentuk untuk menghapuskan kebergantungan kepada borang manual, mengelakkan konflik/pertindihan tempahan secara automatik berasaskan transaksi masa nyata, mempercepatkan aliran kerja kelulusan pihak pengurusan, memantau penyediaan fasiliti oleh urus setia, menyediakan pas pendaftaran digital berasaskan kod QR, serta menawarkan paparan kiosk pintar di luar pintu bilik mesyuarat (*Door Display Tablet Mode*).

---

## 2. Seni Bina & Teknologi

Sistem ini dibina menggunakan piawaian web moden yang teguh dan selamat:

- **Frontend Core**: React 18 (TypeScript), HTML5 Semantik.
- **Reka Bentuk & Penggayaan**: Tailwind CSS (Tema Korporat Biru Diraja MPLBP `#1e3a8a`, Kelabu Slate, Teal `#0d9488`, Amber `#d97706`).
- **Ikonografi & Tipografi**: Lucide React, Google Fonts (*Plus Jakarta Sans*, *JetBrains Mono*).
- **Backend & Cloud Database**:
  - **Firebase Authentication**: Pengesahan pengguna berpusat, pengurusan sesi, tetapan semula kata laluan.
  - **Cloud Firestore**: Pangkalan data dokumen NoSQL masa nyata dengan kawalan akses ketat.
  - **Firebase Storage**: Storan selamat untuk gambar bilik mesyuarat, gambar profil, dan lampiran dokumen.
  - **Firestore Security Rules**: Peraturan kawalan berasaskan peranan (RBAC) di peringkat pelayan.
- **Enjin Sandaran Pembangunan (*Reactive Database Engine*)**: Storan reaktif setempat yang membolehkan sistem diuji serta-merta tanpa perlu memasang kunci Firebase terlebih dahulu, dan boleh dihubungkan ke Firebase Cloud dengan hanya memasukkan konfigurasi dalam fail `.env.local`.

---

## 3. Matriks Peranan & Kawalan Akses (RBAC)

| Peranan (*Role*) | Keterangan & Had Kuasa |
|---|---|
| **Pentadbir Sistem** (`PENTADBIR_SISTEM`) | Akses penuh ke seluruh sistem: Mengurus pengguna, bilik mesyuarat, jabatan, cuti umum, tetapan polisi sistem, penyelenggaraan, melihat log audit keselamatan, dan laporan analitik eksekutif. |
| **Pegawai Pelulus** (`PELULUS`) | Modul Kelulusan: Meneliti permohonan tempahan menunggu, meluluskan, menolak (wajib alasan penolakan rasmi), atau memulangkan permohonan untuk pembetulan. |
| **Urus Setia Fasiliti** (`URUS_SETIA`) | Papan pemantauan penyediaan susunan kerusi/meja, pengujian sistem audio visual/mikrofon, tempahan jamuan/minuman, kebersihan, dan pemantauan daftar masuk QR. |
| **Pentadbir Jabatan** (`PENTADBIR_JABATAN`) | Mengurus tempahan dan kakitangan di bawah jabatan masing-masing, serta melihat laporan penggunaan jabatan. |
| **Kakitangan Pengguna** (`KAKITANGAN`) | Melihat ketersediaan bilik pada kalendar interaktif, membuat tempahan baharu (sekali / berulang), mengurus tempahan sendiri, menjana pas kod QR, memuat turun slip rasmi, dan mengemaskini profil. |

---

## 4. Struktur Koleksi Cloud Firestore

```text
users/{uid}
  ├── uid (string)
  ├── nama (string)
  ├── emel (string)
  ├── noTelefon (string)
  ├── noStaf (string)
  ├── jawatan (string)
  ├── jabatanId (string)
  ├── jabatanNama (string)
  ├── unit (string)
  ├── role (PENTADBIR_SISTEM | PELULUS | URUS_SETIA | PENTADBIR_JABATAN | KAKITANGAN)
  ├── status (AKTIF | TIDAK_AKTIF)
  └── gambarProfil (url string)

rooms/{roomId}
  ├── roomId (string)
  ├── nama (string)
  ├── kodBilik (string)
  ├── lokasi (string)
  ├── aras (string)
  ├── kapasiti (number)
  ├── penerangan (string)
  ├── gambar (url string)
  ├── kemudahan (array string)
  ├── status (AKTIF | TIDAK_AKTIF | PENYELENGGARAAN)
  └── warna (hex string)

bookings/{bookingId}
  ├── bookingId (string)
  ├── noRujukan (string, cth: MB-2026-000101)
  ├── tajukMesyuarat (string)
  ├── tujuan (string)
  ├── tarikh (YYYY-MM-DD)
  ├── masaMula (HH:mm)
  ├── masaTamat (HH:mm)
  ├── roomId (string)
  ├── roomName (string)
  ├── userId (string)
  ├── userName (string)
  ├── bilanganPeserta (number)
  ├── pengerusi (string)
  ├── urusSetia (string)
  ├── peralatan (object)
  ├── perkhidmatan (object)
  ├── status (DRAF | MENUNGGU_KELULUSAN | DILULUSKAN | DITOLAK | DIPULANGKAN | DIBATALKAN | SEDANG_DIGUNAKAN | SELESAI | TIDAK_HADIR)
  ├── qrCodeData (string)
  ├── checkInAt (ISO string)
  └── checkOutAt (ISO string)

departments/{deptId}
notifications/{notifId}
audit_logs/{logId}
maintenance/{maintId}
holidays/{holidayId}
settings/global-settings
```

---

## 5. Logik Enjin Tempahan & Pencegahan Pertindihan

Sistem menggunakan formula semakan pertindihan masa nyata:

$$\text{newStart} < \text{existingEnd} \quad \text{DAN} \quad \text{newEnd} > \text{existingStart}$$

Syarat semakan integriti tempahan:
1. Bilik mesyuarat mestilah berstatus `AKTIF` (bukan `TIDAK_AKTIF` atau `PENYELENGGARAAN`).
2. Masa mula mestilah mendahului masa tamat (`masaMula < masaTamat`).
3. Bilangan peserta tidak melebihi kapasiti maksimum bilik.
4. Tiada pertindihan dengan tempahan lain yang berstatus `MENUNGGU_KELULUSAN`, `DILULUSKAN`, atau `SEDANG_DIGUNAKAN`.
5. Bagi **Tempahan Berulang (*Recurring*)**, semakan pertindihan dijalankan secara atomik ke atas **SEMUA** tarikh siri sebelum sebarang rekod disimpan.

---

## 6. Akaun Demo & Akses Pantas (Role Switcher)

Sistem didatangkan dengan data demo pra-muat untuk menguji setiap peranan serta-merta:

| Peranan | Emel Log Masuk | Kata Laluan |
|---|---|---|
| **Pentadbir Sistem** | `admin@mplbp.gov.my` | `mplbp2026` |
| **Pegawai Pelulus** | `pelulus@mplbp.gov.my` | `mplbp2026` |
| **Urus Setia Fasiliti** | `urussetia@mplbp.gov.my` | `mplbp2026` |
| **Pentadbir Jabatan** | `deptadmin@mplbp.gov.my` | `mplbp2026` |
| **Kakitangan** | `kakitangan@mplbp.gov.my` | `mplbp2026` |

> *Nota: Anda juga boleh menukar peranan pada bila-bila masa melalui butang **Peranan: [Peranan Semasa]** di bahagian atas bar navigasi.*

---

## 7. Cara Menjalankan Sistem Secara Lokal

### Keperluan:
- Penyemak imbas moden (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- Node.js (v18+).

### Langkah Menjalankan:
1. Buka PowerShell atau Command Prompt pada direktori projek:
   ```bash
   cd "C:\antigravity\sistem tempahan bilik mesyuarat"
   ```

2. Jalankan pelayan pembangunan tempatan:
   ```bash
   node server.js
   ```

3. Buka penyemak imbas anda dan layari:
   ```text
   http://localhost:3000
   ```

---

## 8. Cara Konfigurasi Firebase Cloud Sebenar

Untuk menyambungkan sistem ke projek Firebase Cloud sebenar:

1. Cipta projek baharu di [Firebase Console](https://console.firebase.google.com).
2. Aktifkan **Firebase Authentication** (kaedah *Email/Password*).
3. Cipta pangkalan data **Cloud Firestore** dalam mod *Production*.
4. Aktifkan **Firebase Storage**.
5. Salin `.env.example` kepada `.env.local` dan masukkan kunci API Firebase anda:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=mplbp-ebilik.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mplbp-ebilik
   VITE_FIREBASE_STORAGE_BUCKET=mplbp-ebilik.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. Guna peraturan keselamatan yang disediakan:
   - Salin kandungan fail `firestore.rules` ke ruangan *Firestore Security Rules*.
   - Salin kandungan fail `storage.rules` ke ruangan *Storage Security Rules*.
   - Deploy indeks komposit menggunakan `firestore.indexes.json`.

---

## 9. Ciri-Ciri Utama Sistem

1. **Papan Pemuka Interaktif**: Statistik langsung, jadual mesyuarat hari ini, dan aktiviti terkini.
2. **Borang Tempahan Pintar**: Multi-step booking form, sokongan tempahan berulang, pemilihan susunan meja (Bentuk U, Teater, Bilik Darjah, Meja Bulat), peralatan audio visual dan jamuan.
3. **Kalendar Tempahan Bersepadu**: Mod paparan Bulan, Minggu dan Hari dengan penapis bilik dan status.
4. **Aliran Kerja Kelulusan Berperingkat**: Notifikasi masa nyata, tindakan Lulus, Tolak (wajib justifikasi), dan Pulangkan untuk pembetulan.
5. **Pas Kod QR Digital**: Kod QR selamat yang dijana automatik bagi setiap tempahan diluluskan untuk tujuan daftar masuk pantas.
6. **Paparan Luar Bilik (Door Display / Kiosk Mode)**: Paparan skrin penuh untuk tablet/TV di luar bilik mesyuarat dengan penunjuk status langsung (🟢 TERSEDIA, 🔴 SEDANG DIGUNAKAN, 🟠 AKAN DIGUNAKAN), pemasa undur, jadual mesyuarat, dan imbasan QR.
7. **Papan Pemantauan Urus Setia**: Pengurusan senarai semak penyediaan bilik mesyuarat (Menunggu, Dalam Proses, Selesai).
8. **Modul Laporan & Analitik**: Kad KPI eksekutif, trend bulanan, kadar penggunaan setiap bilik, pecahan jabatan, penjanaan laporan rasmi, cetakan slip mesyuarat dan eksport CSV.
9. **Log Audit Keselamatan**: Merekodkan cap masa, pengguna, peranan, alamat IP, dan butiran setiap transaksi secara tidak boleh diubah (*immutable*).
10. **Pengurusan Pentadbiran**: CRUD pengguna, jabatan, penyelenggaraan bilik, takwim cuti umum, dan tetapan polisi operasi.

---

Hak Cipta Terpelihara &copy; 2026 **Majlis Perbandaran Langkawi Bandaraya Pelancongan (MPLBP)**.
