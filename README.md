# 🛰️ Satellite Tracker - Uydu Takip Uygulaması

<div align="center">

![Satellite Tracker](https://img.shields.io/badge/Satellite-Tracker-blue?style=for-the-badge&logo=satellite)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r159-000000?style=for-the-badge&logo=three.js)

**Gerçek zamanlı uydu takibi, 3D görselleştirme ve geçiş tahminleri**

🌐 **[Canlı Demo](https://zubeyirtosun.github.io/satellite-tracker/)** • [📋 Özellikler](#özellikler) • [⚡ Kurulum](#kurulum) • [📸 Ekran Görüntüleri](#ekran-görüntüleri)

</div>

---

## 📋 Özellikler

### 🌍 **Canlı Uydu Takibi**
- **ISS Gerçek Zamanlı Takip**: Uluslararası Uzay İstasyonu'nun anlık konumu
- **Orbital Parametreler**: Hız, yükseklik, konumu canlı görüntüleme
- **Mürettebat Bilgileri**: ISS'deki astronotların listesi
- **Konum Detayları**: Bulunduğu ülke/şehir bilgileri

### 🗺️ **Harita Entegrasyonu** 
- **Leaflet Haritalar**: İnteraktif dünya haritası üzerinde uydu konumları
- **Renkli İkonlar**: Uydu türlerine göre renk kodlu gösterim
- **Popup Bilgiler**: Harita üzerinde detaylı uydu bilgileri
- **Yörünge Çizgileri**: Uydu rotalarının görsel takibi

### 🔮 **Geçiş Tahmini**
- **45+ Şehir**: 7 kıtadan büyük şehirler için geçiş tahminleri
- **Kıta Filtreleme**: Asya, Avrupa, Amerika, Okyanusya, Afrika
- **Manuel Koordinat**: Özel konum girişi desteği
- **GPS Konum**: Otomatik konum tespiti
- **Detaylı Bilgiler**: Geçiş saati, görünürlük süresi, açı bilgileri

### 📱 **Bildirim Sistemi**
- **Push Bildirimleri**: Tarayıcı bildirimleri
- **Email Entegrasyonu**: EmailJS ile email bildirimleri
- **Zamanlama**: 5 dakika - 1 saat öncesinden uyarı
- **Çoklu Uydu**: Farklı uydular için ayrı bildirimler

### 📡 **Frekans Planlayıcısı**
- **44 Uydu**: Amatör radyo uyduları database'i
- **Frekans Bilgileri**: Uplink/Downlink frekansları
- **Modülasyon Türleri**: FM, CW, SSB, Digital, APRS
- **Bant Filtreleme**: VHF, UHF, Microwave bantları
- **Takvim Eksport**: .ics dosyası oluşturma

### 🎯 **Çoklu Uydu Takibi**
- **44 Uydu Database**: 5 kategoride kapsamlı uydu listesi
  - 🔬 **Bilimsel**: ISS, Hubble, James Webb, CHEOPS, GAIA
  - 📡 **İletişim**: Starlink, TURKSAT, EUTELSAT, Intelsat
  - 🌦️ **Hava Durumu**: NOAA, Meteosat, Himawari, GOES
  - 🧭 **Navigasyon**: GPS, GLONASS, Galileo, Beidou
  - 🛡️ **Askeri**: USA, MILSTAR, LACROSSE, NROL
- **Kategori Filtreleme**: Uydu türlerine göre filtreleme
- **Harita/Liste Görünümü**: İki farklı görüntüleme modu

### 🌐 **3D Görselleştirme**
- **Three.js & React Three Fiber**: Profesyonel 3D grafikleri
- **Gerçekçi Dünya Modeli**: Kıtalar, kutup bölgeleri, atmosfer
- **Bulut Katmanı**: Dinamik bulut efektleri
- **Gerçek Yörüngeler**: Fiziksel olarak doğru eliptik yörüngeler
  - **Eğim Açıları (Inclination)**: Her uydu için farklı
  - **Eksantriklik**: Eliptik yörünge parametreleri
  - **RAAN**: Yörünge düzlemi rotasyonu
- **İnteraktif Kontroller**: Döndürme, zoom, kaydırma
- **Uydu Modelleri**: 3D uydu modelleri ve sinyal efektleri

### ⚙️ **Global Ayarlar**
- **Gerçek Zamanlı Mod**: 1 saniye güncelleme
- **Güncelleme Aralıkları**: 5s - 120s arası ayarlanabilir
- **Performans Presetleri**: 
  - ⚡ Süper Hızlı (1s)
  - 🚀 Gerçek Zamanlı (5s)  
  - ⚡ Normal (15s)
  - 🔋 Ekonomik (30s)
  - 🐌 Yavaş (60s)
  - 💤 Çok Yavaş (120s)
- **Animasyon Kontrolleri**: Görsel efektleri açma/kapama
- **Debug Modu**: Geliştirici bilgileri

---

## 🛠️ Teknoloji Stack'i

### **Frontend Framework**
- **React 18.2.0** - Modern komponent tabanlı UI
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Create React App** - Sıfır konfigürasyon setup

### **3D Graphics & Visualization**
- **Three.js r159** - 3D grafikleri ve WebGL
- **React Three Fiber** - React için Three.js wrapper
- **React Three Drei** - Yardımcı 3D komponentleri

### **Mapping & Geolocation**
- **Leaflet** - İnteraktif harita library'si
- **React Leaflet** - React için Leaflet entegrasyonu
- **OpenStreetMap** - Açık kaynak harita verileri

### **State Management & Data**
- **React Context API** - Global state yönetimi
- **LocalStorage** - Kullanıcı ayarları persistence
- **Custom Hooks** - Tekrar kullanılabilir state logic

### **External Services & APIs**
- **Where The ISS At API** - Gerçek zamanlı uydu pozisyonları
- **EmailJS** - Email bildirim servisi
- **Geolocation API** - GPS konum tespiti

### **Styling & UI**
- **CSS3** - Modern CSS özellikleri
- **Responsive Design** - Mobil uyumlu tasarım
- **Dark Space Theme** - Uzay temalı modern arayüz

---

## ⚡ Kurulum

### **Sistem Gereksinimleri**
- Node.js 16.0.0 veya üzeri
- npm 8.0.0 veya üzeri
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)

### **1. Projeyi İndirin**
```bash
git clone https://github.com/zubeyirtosun/satellite-tracker.git
cd satellite-tracker
```

### **2. Bağımlılıkları Yükleyin**
```bash
npm install
```

### **3. Email Bildirimleri (Opsiyonel)**
Email bildirimleri kullanmak istiyorsanız:

1. [EmailJS](https://www.emailjs.com/) hesabı oluşturun
2. Service, Template ve Public Key oluşturun
3. `src/services/emailService.ts` dosyasını düzenleyin:

```typescript
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';  
const EMAILJS_PUBLIC_KEY = 'your_public_key';
```

### **4. Uygulamayı Başlatın**
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde açılacaktır.

### **5. Production Build**
```bash
npm run build
```

---

## 📸 Ekran Görüntüleri

### 🌍 Ana Dashboard
<div align="center">
<img src="docs/images/dashboard.png" alt="Ana Dashboard" width="800">
<br><em>Gerçek zamanlı ISS takibi ve genel bakış</em>
</div>

### 🗺️ Harita Görünümü
<div align="center">
<img src="docs/images/map-view.png" alt="Harita Görünümü" width="800">
<br><em>Dünya haritası üzerinde çoklu uydu takibi</em>
</div>

### 🌐 3D Görselleştirme
<div align="center">
<img src="docs/images/3d-view.png" alt="3D Görselleştirme" width="800">
<br><em>İnteraktif 3D Dünya modeli ve gerçek yörüngeler</em>
</div>

### 📡 Frekans Planlayıcısı
<div align="center">
<img src="docs/images/frequency-planner.png" alt="Frekans Planlayıcısı" width="800">
<br><em>Amatör radyo uyduları ve frekans bilgileri</em>
</div>

---

## 🚀 Demo

🌐 **[Canlı Demo](https://zubeyirtosun.github.io/satellite-tracker/)**

Demo hesabında tüm özellikler mevcuttur:
- ✅ Gerçek zamanlı uydu takibi
- ✅ 3D görselleştirme
- ✅ Harita entegrasyonu
- ✅ Geçiş tahminleri
- ⚠️ Email bildirimleri (yapılandırma gerekli)

---

## 📚 Kullanım Kılavuzu

### **🛰️ Canlı ISS Takibi**
1. Ana sayfadan "Canlı ISS Takibi" sekmesine gidin
2. ISS'in gerçek zamanlı konumunu harita üzerinde görün
3. Orbital bilgileri ve mürettebat listesini inceleyin
4. Otomatik güncelleme 10 saniyede bir gerçekleşir

### **🔮 Geçiş Tahmini**
1. "Geçiş Tahmini" sekmesine gidin
2. Kıta seçin veya şehir listesinden seçim yapın
3. Manuel koordinat girişi veya GPS kullanın
4. ISS geçiş saatlerini ve görünürlük bilgilerini görün

### **📱 Bildirim Kurulumu**
1. "Bildirimler" sekmesine gidin
2. Push bildirimleri için izin verin
3. Email bildirimleri için EmailJS yapılandırın
4. Konum seçin ve uyarı zamanını ayarlayın

### **📡 Frekans Planlama**
1. "Frekanslar" sekmesine gidin
2. Uydu filtreleme (bant, modülasyon)
3. Takvim etkinlikleri oluşturun
4. .ics dosyası indirin

### **🌐 3D Görselleştirme**
1. "3D Görselleştirme" sekmesine gidin
2. Mouse ile Dünya'yı döndürün
3. Scroll ile zoom yapın
4. Uydu kategorilerini filtreleyin
5. Yörünge çizgilerini açın/kapatın

---

## 🔧 Geliştirme

### **Proje Yapısı**
```
satellite-tracker/
├── public/                 # Static dosyalar
├── src/
│   ├── components/         # React komponentleri
│   │   ├── ISSTracker.tsx
│   │   ├── SatellitePredictor.tsx
│   │   ├── MultiSatelliteTracker.tsx
│   │   ├── OrbitVisualization3D.tsx
│   │   ├── FrequencyPlanner.tsx
│   │   ├── NotificationManager.tsx
│   │   └── GlobalSettingsModal.tsx
│   ├── data/               # Uydu verileri
│   │   ├── satelliteData.ts
│   │   ├── globalCities.ts
│   │   └── amateurSatellites.ts
│   ├── services/           # API servisleri
│   │   ├── satelliteService.ts
│   │   └── emailService.ts
│   ├── contexts/           # React contexts
│   │   └── SettingsContext.tsx
│   ├── hooks/              # Custom hooks
│   └── utils/              # Yardımcı fonksiyonlar
├── docs/                   # Dökümantasyon
└── README.md
```

### **Yeni Özellik Ekleme**
1. `src/components/` klasöründe yeni komponent oluşturun
2. `src/data/` klasöründe gerekli verileri ekleyin
3. Ana `App.tsx` dosyasında routing'i güncelleyin
4. CSS stilleri ve responsive tasarım ekleyin

### **API Entegrasyonu**
- `src/services/satelliteService.ts` - Uydu API'leri
- `src/services/emailService.ts` - Email servisi
- Yeni API servisleri için benzer yapı kullanın

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak istiyorsanız:

1. **Fork** edin
2. **Feature branch** oluşturun (`git checkout -b feature/amazing-feature`)
3. **Commit** yapın (`git commit -m 'Add amazing feature'`)
4. **Push** edin (`git push origin feature/amazing-feature`)
5. **Pull Request** açın

### **Katkı Alanları**
- 🌍 Yeni uydu verileri ekleme
- 🎨 UI/UX iyileştirmeleri
- 🚀 Performans optimizasyonları
- 📱 Mobil uygulama desteği
- 🌐 Çoklu dil desteği
- 📊 Yeni görselleştirme türleri

---

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

---

## 🙏 Teşekkürler

- **[Where The ISS At API](http://wheretheiss.at/)** - ISS konum verileri
- **[EmailJS](https://www.emailjs.com/)** - Email bildirimi servisi
- **[Three.js](https://threejs.org/)** - 3D grafik engine
- **[Leaflet](https://leafletjs.com/)** - Harita library'si
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Açık kaynak harita verileri

---
## 📈 İstatistikler

![GitHub stars](https://img.shields.io/github/stars/zubeyirtosun/satellite-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/zubeyirtosun/satellite-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/zubeyirtosun/satellite-tracker)
![GitHub license](https://img.shields.io/github/license/zubeyirtosun/satellite-tracker)

---

<div align="center">

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

Made with ❤️ and ☕ by Turkish Developers

</div>
