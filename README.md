# Undangan Pernikahan Digital — Royal Blue

Website undangan digital dengan dua tampilan:
1. Cover undangan dengan foto pasangan dan tombol **Buka Undangan**.
2. Halaman isi undangan panjang dengan efek scroll, countdown, galeri, lokasi, dan formulir ucapan demo.

Dibuat menggunakan HTML, CSS, dan JavaScript vanilla agar ringan dan mudah dikustomisasi.

## Cara menjalankan

**Cara paling mudah**
1. Ekstrak file ZIP.
2. Buka folder `undangan-royal-blue`.
3. Klik dua kali `index.html` untuk membukanya di browser.

Jika browser membatasi fitur tertentu saat file dibuka langsung, jalankan server lokal:
- Buka folder proyek di VS Code.
- Pasang ekstensi Live Server.
- Klik kanan `index.html` → **Open with Live Server**.

## Cara mengganti data pasangan

Buka `js/script.js`, lalu ubah bagian `WEDDING_CONFIG`:

```js
const WEDDING_CONFIG = {
  groom: "Ardi",
  bride: "Nadia",
  dateLabel: "Minggu, 20 Desember 2026",
  weddingDate: "2026-12-20T08:00:00+07:00",
  mapsUrl: "https://maps.google.com/?q=Lokasi+Pernikahan",
  calendarTitle: "Pernikahan Ardi & Nadia",
  calendarLocation: "Kediaman Mempelai Wanita",
  calendarDescription: "Undangan pernikahan Ardi dan Nadia"
};
```

`weddingDate` memakai format ISO dengan zona waktu `+07:00` untuk WIB. Perbarui tanggal dan jam di sini serta `dateLabel` agar countdown dan label tanggal sesuai.

## Cara mengganti foto

Ganti file placeholder di `assets/images/` dengan foto sendiri. Agar mudah, pertahankan nama file berikut:
- `cover-placeholder.svg` — foto cover
- `groom-placeholder.svg` — foto mempelai pria
- `bride-placeholder.svg` — foto mempelai wanita
- `gallery-1-placeholder.svg`
- `gallery-2-placeholder.svg`
- `gallery-3-placeholder.svg`

Untuk foto asli, disarankan format WebP atau JPG yang sudah dikompres. Jika nama file diubah, sesuaikan juga `src` pada `index.html`.

## Cara menambahkan musik

1. Siapkan file audio MP3 yang boleh digunakan.
2. Simpan sebagai `assets/audio/romantic.mp3`.
3. Pastikan nama file dan jalurnya sama persis.
4. Musik dicoba diputar setelah tombol **Buka Undangan** ditekan. Jika file belum tersedia, website tetap berjalan dan tombol musik tetap tampil.

Autoplay dapat dibatasi oleh browser; pengguna bisa menekan tombol musik untuk mencoba memutarnya.

## Cara mengubah lokasi

Ubah `mapsUrl` di `WEDDING_CONFIG` dengan link lokasi Google Maps yang benar. Ubah teks alamat acara di `index.html` pada bagian Akad Nikah dan Resepsi.

## Mengubah teks cerita, orang tua, dan informasi acara

Buka `index.html`, cari bagian yang ingin diubah, lalu edit teksnya. Cerita pasangan pada proyek ini adalah contoh placeholder; gantilah dengan cerita yang benar.

## Formulir ucapan / RSVP

Formulir saat ini **hanya demo di browser**. Ucapan akan tampil pada halaman saat itu, tetapi tidak dikirim ke pemilik undangan dan tidak tersimpan setelah halaman dimuat ulang. Untuk menyimpan data semua tamu, diperlukan backend atau layanan database.

## Hosting gratis

Website statis ini bisa diunggah ke GitHub Pages, Netlify, atau hosting statis lain. Unggah seluruh isi folder proyek, bukan hanya `index.html`. Pastikan huruf besar/kecil nama file dan folder sama persis.

## Catatan performa

- Animasi bunga dibatasi maksimal 8 elemen aktif.
- Elemen muncul saat di-scroll menggunakan `IntersectionObserver`.
- Gambar di galeri memakai lazy loading.
- Efek animasi dikurangi saat perangkat mengaktifkan `prefers-reduced-motion`.
- Google Fonts membutuhkan internet; jika font eksternal gagal dimuat, website memakai font fallback.
