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
- `src/main.jsx`: komponen React dan alur permainan.
- `src/style.css`: tema, ilustrasi kedai, animasi, dan responsivitas.
- `tests/engine.test.js`: pengujian rumus dan skenario kejadian.

## Asumsi penilaian

Skor = 40% profitabilitas + 30% akurasi + 20% pengelolaan kas + 10% efisiensi. Profitabilitas memakai target laba Rp10 juta selama empat minggu. Akurasi memakai selisih absolut laba terhadap nilai terbesar antara laba anggaran absolut dan biaya tetap, untuk menghindari pembagian nol. Setiap komponen dibatasi 0–100. Definisi juga ditampilkan pada laporan akhir.

Kejadian dan fluktuasi pasar diundi saat anggaran dikonfirmasi, lalu disimpan agar memuat ulang halaman tidak mengubah kejadian. Biaya keputusan opsional tidak boleh melebihi kas yang tersisa setelah anggaran dialokasikan.
