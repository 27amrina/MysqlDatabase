VERSI 1.4
- Menambahkan tombol Back dan Next untuk berpindah soal lebih cepat.
- Menampilkan indikator Soal X dari 18 dan judul soal aktif.
- Tombol Back nonaktif pada soal pertama dan Next nonaktif pada soal terakhir.
- Pada HP, navigasi dibuat sticky di bagian bawah agar mudah dijangkau.
- Perpindahan soal tetap tersimpan otomatis ke LocalStorage.

VERSI 1.2 - LOCALSTORAGE AUTOSAVE

MEDIA INTERAKTIF SQL TERMINAL — SISTEM KEPENDUDUKAN
VERSI REVISI 1.1
====================================================

Cara menggunakan:
1. Ekstrak ZIP jika masih berupa file ZIP.
2. Buka file index.html menggunakan Google Chrome, Microsoft Edge, atau Firefox.
3. Isi nama siswa dan kelas.
4. Pilih Mode Belajar, Latihan, atau Ujian.
5. Kerjakan 18 soal melalui terminal SQL.

Fitur utama:
- Simulator terminal MySQL tanpa internet dan tanpa server database.
- DDL: CREATE DATABASE, USE, CREATE TABLE, ALTER TABLE.
- DML: INSERT.
- UPDATE dan DELETE dengan perlindungan wajib WHERE.
- DQL: SELECT, WHERE, LIKE, JOIN, COUNT, GROUP BY, ORDER BY.
- SHOW DATABASES, SHOW TABLES, DESC/DESCRIBE.
- Menjalankan beberapa query sekaligus dengan pemisah titik koma (;).
- Database Explorer dan pratinjau isi tabel.
- Hint bertingkat pada Mode Belajar/Latihan.
- Penilaian otomatis total 100 dengan pemeriksaan struktur, isi data, dan hasil query.
- Validasi tipe data dasar: INT, VARCHAR(n), DATE, DECIMAL(p,s), dan YEAR.
- LocalStorage autosave untuk menyimpan progres, database simulasi, query, draft terminal, tampilan terminal, nilai, dan waktu.
- Sesi tersimpan per kombinasi Nama Siswa + Kelas, sehingga beberapa siswa dapat memiliki progres masing-masing pada browser yang sama.
- Autosave berjalan saat query dijalankan, draft diketik, soal berpindah, hint dibuka, tabel preview dipilih, browser disembunyikan/ditutup, dan setiap ±10 detik.
- Ekspor riwayat pengerjaan ke file .sql.
- Pembahasan dan contoh query setelah menekan tombol Selesai.

Perbaikan Versi 1.1:
- Multi-query: CREATE/INSERT/DELETE dapat ditempel sebagai beberapa statement dan dijalankan berurutan.
- Perintah CLEAR/CLS kembali menampilkan header terminal dengan benar.
- Mode Ujian tidak menampilkan status benar/salah atau nilai sebelum dikumpulkan.
- Setelah Mode Ujian dikumpulkan, timer berhenti dan terminal dikunci.
- Mode sesi lama dipertahankan saat melanjutkan progres untuk mencegah Mode Ujian dibuka sebagai Mode Belajar.
- Validasi soal diperketat, termasuk pasangan kelurahan-kecamatan, seluruh field penduduk, dan satu UPDATE untuk dua kolom.
- Soal DQL dinilai dari hasil tabel query dan bentuk query yang diminta, bukan sekadar pencocokan kata.
- INSERT multi-baris dibuat atomik: bila salah satu baris gagal, baris sebelumnya pada statement yang sama tidak disimpan.

Catatan:
Simulator ini dirancang khusus untuk latihan soal Proyek Sistem Data Kependudukan dan mendukung subset SQL yang dibutuhkan oleh 18 soal. Ini bukan pengganti penuh server MySQL/MariaDB.

Data identitas pada latihan bersifat fiktif.


PERUBAHAN v1.3
- Tombol Jalankan, Clear, dan Hint dipisahkan dari area input terminal.
- Tombol dipindahkan ke bawah terminal agar area mengetik lebih lega.
- Lebar area terminal diprioritaskan pada desktop/tablet dan memenuhi lebar layar pada ponsel.
- Tinggi terminal ponsel diperbesar agar riwayat query lebih mudah dibaca.
