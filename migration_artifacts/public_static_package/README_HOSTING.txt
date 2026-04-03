PAKET INI KHUSUS UNTUK SHARED HOSTING PHP/HTML.

Isi paket:
- index.html
- folder assets/
- file statis hasil build frontend

Penting:
- Halaman PUBLIC website akan berjalan sebagai situs statis.
- CMS/Admin (/admin) TIDAK akan berfungsi di hosting ini karena membutuhkan backend Node.js/Express dan API.
- Database SQL tetap disediakan terpisah, tetapi tidak bisa dipakai penuh tanpa server backend yang mendukung Node.js.

Cara upload:
1. Upload seluruh isi paket ini ke public_html atau htdocs hosting.
2. Pastikan index.html berada di root folder web.
3. Jika ingin CMS/admin aktif, gunakan VPS/hosting Node.js lalu deploy backend terpisah.
