# GSearch - GatotKaca Cyber Modern

Aplikasi pencarian seperti Google dengan kearifan lokal Indonesia dan tema cyber modern yang menampilkan karakter GatotKaca dalam versi modern.

## ✨ Fitur

### 🔍 **Pencarian Google dengan API**
- **Google Custom Search API Integration** - Hasil pencarian yang stabil dan reliable
- **Rate Limiting** - 100 queries/day gratis dengan tracking otomatis
- **Smart Fallback** - Otomatis switch ke DuckDuckGo jika limit tercapai
- **Indonesia Localization** - Pencarian dengan preferensi bahasa dan wilayah Indonesia
- **Real-time Results** - Hasil pencarian cepat dengan format JSON terstruktur
- **API Usage Tracking** - Visual indicator untuk penggunaan quota API

### 🎨 **Tema GatotKaca Cyber Modern**
- Desain cyber modern dengan sentuhan budaya Indonesia
- Warna neon: Gold (GatotKaca), Cyan (Cyber), Purple (Energy)
- Animasi smooth dan micro-interactions
- Background particle effects

### ⚡ **Fitur Interaktif**
- Pencarian suara (Voice Search)
- Keyboard shortcuts (Ctrl+K, Esc, Ctrl+/)
- Quick access categories
- Loading animation GatotKaca
- Hover effects dan transisi

### 🌐 **Konten Lokal Indonesia**
- Kategori: Berita Indonesia, Budaya, Kuliner, Wisata, Teknologi
- Preferensi hasil pencarian untuk konten Indonesia
- Bahasa Indonesia sebagai default

## 🚀 Instalasi & Penggunaan

### **Langkah 1: Clone atau Download**
```bash
# Jika menggunakan git
git clone <repository-url>
cd gsearch

# Atau download file ZIP dan ekstrak
```

### **Langkah 2: Buka di Browser**
```bash
# Buka file index.html di browser modern
# Chrome, Firefox, Safari, atau Edge versi terbaru

# Atau gunakan live server (recommended)
# Jika menggunakan VS Code: Install Live Server extension
# Klik kanan pada index.html -> Open with Live Server
```

### **Langkah 3: Gunakan Aplikasi**
1. **Buka aplikasi** di browser
2. **Ketik kata kunci** di search box
3. **Klik "CARI"** atau tekan Enter
4. **Lihat hasil** dengan tema GatotKaca cyber
5. **Coba fitur lain**: voice search, kategori, keyboard shortcuts

## 🎯 Keyboard Shortcuts

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl+K` | Fokus ke search box |
| `Esc` | Hapus hasil pencarian |
| `Ctrl+/` | Tampilkan bantuan |
| `Enter` | Lakukan pencarian |

## 🏗️ Struktur Proyek

```
gsearch/
├── index.html              # Halaman utama
├── css/
│   ├── style.css          # Custom styles
│   └── animations.css     # Animasi khusus
├── js/
│   ├── app.js             # Main application
│   ├── search.js          # Fungsi pencarian
│   └── animations.js     # Sistem animasi
├── assets/
│   ├── images/            # Gambar dan logo
│   └── fonts/             # Font kustom
└── README.md              # Dokumentasi
```

## 🛠️ Teknologi yang Digunakan

### **Frontend**
- **HTML5** - Struktur halaman
- **CSS3** - Styling dan animasi
- **JavaScript (ES6+)** - Logika aplikasi
- **Tailwind CSS** - Utility-first CSS framework

### **Integrasi**
- **Google Search** - Mesin pencarian
- **CORS Proxy** - Mengatasi CORS issues
- **Web Speech API** - Pencarian suara
- **Font Awesome** - Icons

### **Fitur Browser**
- **CSS Grid & Flexbox** - Layout modern
- **CSS Animations & Transitions** - Efek visual
- **LocalStorage** - Penyimpanan client-side
- **Fetch API** - HTTP requests

## 🎨 Desain & Tema

### **Color Palette**
- **GatotKaca Gold**: `#FFD700`
- **Cyber Blue**: `#00FFFF`
- **Dark Space**: `#0A0A0A`
- **Energy Purple**: `#9D00FF`
- **Matrix Green**: `#00FF41`

### **Typography**
- **Orbitron** - Font cyber untuk headings
- **Inter** - Font readable untuk body text

### **Animations**
- Particle floating effects
- GatotKaca loading animation
- Button hover effects
- Page transitions
- Search result animations

## 🔧 Konfigurasi

### **Mengubah Tema Warna**
Edit file `css/style.css`:
```css
:root {
    --gatotkaca-gold: #FFD700;    /* Warna emas GatotKaca */
    --cyber-blue: #00FFFF;        /* Warna cyber blue */
    --energy-purple: #9D00FF;     /* Warna energy purple */
}
```

### **Menambah Kategori**
Edit file `index.html`:
```html
<button class="category-btn" data-query="kategori baru">
    <i class="fas fa-icon"></i>Nama Kategori
</button>
```

### **Google API Configuration**
Edit file `js/search.js`:
```javascript
// Google Custom Search API Configuration
this.apiKey = 'YOUR_GOOGLE_API_KEY';           // Ganti dengan API Key Anda
this.searchEngineId = 'YOUR_SEARCH_ENGINE_ID';    // Ganti dengan Search Engine ID Anda
this.apiUrl = 'https://www.googleapis.com/customsearch/v1';
this.dailyLimit = 100;                           // Free tier limit
```

### **Cara Mendapatkan API Key dan Search Engine ID**
1. **Buat Google Custom Search Engine**:
   - Kunjungi: https://cse.google.com/cse/
   - Klik "Add" untuk membuat search engine baru
   - Masukkan website yang mau di-search (bisa `*.com` untuk semua situs)
   - Copy "Search engine ID"

2. **Buat API Key**:
   - Kunjungi: https://console.cloud.google.com/
   - Buat project baru atau pilih yang ada
   - Aktifkan "Custom Search API"
   - Buat API Key di "Credentials" → "Create Credentials" → "API Key"
   - Copy API Key yang dibuat

3. **Update Konfigurasi**:
   - Ganti `YOUR_GOOGLE_API_KEY` dengan API Key Anda
   - Ganti `YOUR_SEARCH_ENGINE_ID` dengan Search Engine ID Anda

### **Rate Limiting & Quota**
- **Free Tier**: 100 queries per hari
- **Tracking**: Otomatis tersimpan di localStorage
- **Reset**: Otomatis reset setiap hari
- **Fallback**: Otomatis switch ke DuckDuckGo jika limit tercapai

## 🌟 Fitur Tambahan

### **Voice Search**
- Klik ikon mikrofon 🎤
- Ucapkan kata kunci pencarian
- Hasil akan otomatis ditampilkan

### **Quick Categories**
- **Berita Indonesia**: Berita terkini dari Indonesia
- **Budaya**: Konten budaya nusantara
- **Kuliner**: Makanan khas Indonesia
- **Wisata**: Destinasi wisata dalam negeri
- **Teknologi**: Teknologi lokal Indonesia

### **Performance Features**
- Lazy loading animations
- Optimized particle effects
- Debounced search input
- Efficient DOM manipulation

## 🐛 Troubleshooting

### **Masalah Umum**

**1. CORS Error**
- Pastikan menggunakan CORS proxy
- Cek koneksi internet
- Gunakan browser modern

**2. Animasi Tidak Berjalan**
- Pastikan CSS terload dengan benar
- Cek browser support untuk CSS animations
- Nonaktifkan reduced motion jika perlu

**3. Voice Search Tidak Berfungsi**
- Gunakan Chrome atau browser yang support Web Speech API
- Pastikan mikrofon terhubung
- Berikan permission untuk akses mikrofon

**4. Hasil Pencarian Kosong**
- Cek koneksi internet
- Pastikan search query valid
- Coba kata kunci yang berbeda

### **Browser Support**
- ✅ **Chrome** (Recommended)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ❌ **Internet Explorer** (Tidak support)

## 📱 Mobile Responsiveness

Aplikasi ini sudah dioptimalkan untuk:
- **Smartphone** (320px+)
- **Tablet** (768px+)
- **Desktop** (1024px+)

Fitur mobile:
- Touch-friendly interface
- Responsive search box
- Optimized animations
- Mobile-first approach

## 🔒 Privacy & Security

### **Data Collection**
- ❌ Tidak ada data pribadi yang disimpan
- ❌ Tidak ada tracking cookies
- ❌ Tidak ada analytics

### **Search Privacy**
- Pencarian dilakukan langsung ke Google
- Tidak ada logging search queries
- Tidak ada personalization tanpa consent

## 🤝 Kontribusi

Contributions are welcome! Jika ingin berkontribusi:

1. **Fork** repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

## 📄 License

Project ini dilisensikan under MIT License - lihat file [LICENSE](LICENSE) untuk details.

## 🙏 Credits & Thanks

- **Google Search** - Mesin pencarian
- **Tailwind CSS** - CSS framework
- **Font Awesome** - Icon library
- **Indonesian Culture** - Inspirasi tema

## 📞 Contact

Jika ada pertanyaan atau masukan:
- **Email**: [your-email@example.com]
- **GitHub**: [github.com/yourusername]
- **Issues**: [GitHub Issues]

---

**Dibuat dengan ❤️ menggunakan teknologi web modern dan kearifan lokal Indonesia**

⚡ **GatotKaca Cyber Technology** - © 2024 GSearch
