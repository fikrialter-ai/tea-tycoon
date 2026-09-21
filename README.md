# TEA TYCOON — Budget • Brew • Grow

Game edukasi berbahasa Indonesia untuk AFL 1 — MK Budgeting. React, Vite, Tailwind CSS, dan lucide-react. Tanpa server aplikasi, database, atau login.

## Menjalankan

```sh
npm install
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

Progres disimpan otomatis di localStorage browser. Tombol mulai ulang meminta konfirmasi sebelum menghapus progres. Stok tidak dibawa ke minggu berikutnya; semua stok yang disiapkan dikenakan biaya bahan.

## Struktur

- `src/data.js`: asumsi, kejadian, bobot skor, dan materi edukasi.
- `src/engine.js`: perhitungan murni anggaran, realisasi, selisih, dan skor.
- `src/main.jsx`: HUD dan perpindahan fase permainan.
- `src/learning.jsx`: intro tiga kartu, misi, tutorial lima tahap, Teala, dan siklus budgeting.
- `src/gameplay.jsx`: layar perencanaan, kejadian, keputusan, hasil, evaluasi, transisi, dan ringkasan.
- `src/shared.jsx`: komponen dari versi awal yang dipakai kembali, termasuk ilustrasi kedai, input, tabel selisih, dan laporan akhir.
- `src/journey.js`: pemulihan progres, penentuan minggu, dan insight edukasi.
- `src/style.css` dan `src/game.css`: tema kedai yang dipertahankan serta sistem tipografi, HUD, dan visual onboarding. Inter disertakan lokal.
- `tests/engine.test.js`: pengujian rumus dan skenario kejadian.
- `tests/browser-check.mjs`: alur empat minggu di desktop/mobile, hasil sesuai mesin simulasi, progres lama, keputusan, dan mulai ulang. Jalankan `node tests/browser-check.mjs` saat dev server aktif; memerlukan Microsoft Edge.

## Alur pemain baru

Landing → intro 3 kartu → misi → tutorial → anggaran → kejadian → keputusan (jika diperlukan) → hasil aktual → evaluasi → transisi minggu → laporan akhir setelah minggu 4.

Rumus dan data bisnis versi awal dipertahankan. Hasil hanya dicatat ketika simulasi dijalankan; membuka evaluasi, kembali ke hasil, atau memuat ulang tidak menambah kas atau riwayat. Save key tetap `tealab-game-v1`, sehingga progres lama dapat dilanjutkan. Panduan selalu tersedia dari HUD dan ringkasan seluruh minggu tersedia pada laporan akhir.

## Asumsi penilaian

Skor = 40% profitabilitas + 30% akurasi + 20% pengelolaan kas + 10% efisiensi. Profitabilitas memakai target laba Rp10 juta selama empat minggu. Akurasi memakai selisih absolut laba terhadap nilai terbesar antara laba anggaran absolut dan biaya tetap, untuk menghindari pembagian nol. Setiap komponen dibatasi 0–100. Definisi juga ditampilkan pada laporan akhir.

Kejadian dan fluktuasi pasar diundi saat anggaran dikonfirmasi, lalu disimpan agar memuat ulang halaman tidak mengubah kejadian. Biaya keputusan opsional tidak boleh melebihi kas yang tersisa setelah anggaran dialokasikan.
