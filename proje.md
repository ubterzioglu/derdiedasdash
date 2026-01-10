# Der Die Das Dash - Proje Özeti

**Son Güncelleme:** 10 Ocak 2026

## 📋 Proje Genel Bakış

**Der Die Das Dash**, Almanca artikel öğrenmek için hız temelli bir quiz oyunu. Kullanıcılar 10 race'de toplam 100 kelime ile der/die/das artikel'larını zamanla yarışarak öğreniyorlar.

## 🏗️ Teknik Stack

- **Frontend Framework:** React 18.2.0
- **Build Tool:** Vite 5.1.4
- **Styling:** Tailwind CSS 3.4.3
- **Icons:** Lucide React
- **Backend (Seçildi):** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **State Management:** React Hooks (useState, useEffect, useRef)

## 📁 Proje Yapısı

```
derdiedasdash/
├── public/
│   └── logo.png              # Ana logo (doğru yerde)
├── src/
│   ├── app.jsx               # Ana uygulama component'i
│   ├── main.jsx              # React entry point
│   ├── index.css             # Tailwind CSS importları
│   └── dataset.json          # Yeni difficulty-based dataset (kullanılmıyor, entegre edilmeli)
├── docs/
│   ├── DATASET-INFO.md       # Dataset dokümantasyonu (5 difficulty level)
│   └── LOGO-SETUP.md         # Logo kurulum talimatları
├── index.html                # HTML entry point
├── package.json              # Dependencies
├── vite.config.js            # Vite yapılandırması
├── tailwind.config.js        # Tailwind yapılandırması
├── postcss.config.js         # PostCSS yapılandırması
├── vercel.json               # Vercel build yapılandırması
└── .gitignore                # Git ignore kuralları
```

## ✅ Tamamlanan İşler

### 1. Proje Yapısı ve Build Sistemi
- ✅ Vite + React proje yapısı kuruldu
- ✅ `src/app.jsx` ana sayfa olarak çalışıyor
- ✅ `src/main.jsx` React'i mount ediyor
- ✅ Tailwind CSS entegrasyonu
- ✅ Vercel build sorunları çözüldü (permission denied fix)

### 2. Veri Yönetimi
- ✅ `localStorage` ile kullanıcı verileri saklama
- ✅ Storage key: `der-die-das-dash-user`
- ✅ Kullanıcı skorları, race sonuçları kaydediliyor
- ✅ Zaman ölçümü `Date.now()` ile kesin hesaplanıyor

### 3. UI/UX
- ✅ Logo `public/logo.png` konumunda ve görünüyor
- ✅ 4 ekran: Welcome, Game, Race Results, Global Stats
- ✅ Responsive tasarım
- ✅ Animasyonlar ve feedback mekanizmaları
- ✅ Progress bar, timer, score gösterimi

### 4. Oyun Mekanizması
- ✅ 10 Race × 10 Soru = 100 kelime
- ✅ Her soru için 5 saniye süre
- ✅ Hız bonusu sistemi (0-500 puan)
- ✅ Doğru cevap: 500 base + speed bonus
- ✅ Kesin zaman ölçümü (`Date.now()` kullanılıyor)

### 5. Veritabanı Hazırlığı
- ✅ Supabase seçildi ve package.json'a eklendi (`@supabase/supabase-js: ^2.39.0`)
- ✅ Supabase credentials alındı:
  - Project ID: `zacsokxnytyfisagshlb`
  - URL: `https://zacsokxnytyfisagshlb.supabase.co`
  - Anon Key: `sb_publishable_mO_JRuqL3La2r9sE9-jOmw_hFDJ01p6`
  - Service Key: (mevcut, güvenlik için .env'de saklanmalı)

## 🔄 Devam Eden / Yapılacaklar

### 1. Backend Entegrasyonu (ÖNCELİK)
- ⏳ Environment variables dosyası oluşturulmalı (`.env.local`)
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- ⏳ Supabase client utility dosyası oluştur (`src/lib/supabase.js`)
- ⏳ Database schema tasarla:
  ```sql
  - users (id, username, created_at, total_races, total_score)
  - race_results (id, user_id, race_number, score, answers, timestamp)
  - leaderboard_view (aggregated data)
  ```
- ⏳ API fonksiyonları:
  - `saveRaceResult(userId, raceData)`
  - `getGlobalLeaderboard()`
  - `getRaceLeaderboard(raceNumber)`
  - `getUserStats(userId)`
- ⏳ `app.jsx`'i backend'e bağla (localStorage yerine Supabase)

### 2. Dataset Güncelleme
- ⏳ `src/app.jsx`'teki WORDS_DATABASE güncellenmeli
- ⏳ Yeni difficulty-based dataset entegre edilmeli (`docs/DATASET-INFO.md`)
- ⏳ 5 difficulty level desteği:
  - 🟢 Level 1: Very Easy (Race 1-2)
  - 🔵 Level 2: Easy (Race 3-4)
  - 🟡 Level 3: Medium (Race 5-6)
  - 🟠 Level 4: Hard (Race 7-8)
  - 🔴 Level 5: Expert (Race 9-10)

### 3. Özellikler
- ⏳ Gerçek Global Leaderboard (şu an sadece local)
- ⏳ Real-time leaderboard güncellemeleri
- ⏳ Kullanıcı authentication (isteğe bağlı)
- ⏳ Difficulty badge'leri race seçim ekranında

## 🔧 Teknik Detaylar

### Storage Yapısı (Şu An localStorage)
```json
{
  "username": "Kullanıcı Adı",
  "races": {
    "race1": {
      "score": 8500,
      "answers": [
        {
          "word": "Tisch",
          "correct": "der",
          "selected": "der",
          "isCorrect": true,
          "timeTaken": 1.234,
          "points": 876,
          "timestamp": "2024-01-15T10:30:45.123Z"
        }
      ],
      "date": "2024-01-15T10:30:45.123Z"
    }
  },
  "totalRaces": 3,
  "totalScore": 25000
}
```

### Zaman Ölçümü
- `Date.now()` ile kesin ölçüm
- `questionStartTimeRef` ile başlangıç zamanı kaydediliyor
- Milisaniye hassasiyetinde hesaplama

### Scoring Sistemi
- Doğru cevap: 500 base + speed bonus
- Speed bonus: `(5 - timeTaken) * 100` (max 500)
- Maksimum soru puanı: 1000
- Yanlış/timeout: 0 puan

## 🐛 Bilinen Sorunlar

1. **Terminal Komutları:** Windows PowerShell'de bazı komutlar takılabiliyor
2. **Environment Variables:** `.env.local` dosyası oluşturulamadı (terminal sorunu)
3. **Dataset:** Eski WORDS_DATABASE kullanılıyor, yeni difficulty-based versiyon entegre edilmeli

## 📝 Notlar

- Logo `public/logo.png` konumunda ve çalışıyor
- `src/mnt/` klasörü temizlendi
- Gereksiz dosyalar (`der-die-das-space.jsx`) silindi
- Markdown dosyaları `docs/` klasörüne taşındı
- Component ismi düzeltildi: `DerDieDasSpace` → `DerDiedasDash`

## 🚀 Sonraki Adımlar

1. **Environment Variables:** Manuel olarak `.env.local` dosyası oluştur
2. **Supabase Setup:** Database schema oluştur ve client kur
3. **Backend Entegrasyonu:** API fonksiyonlarını implement et
4. **Dataset Update:** Yeni difficulty-based dataset'i entegre et
5. **Testing:** Backend entegrasyonunu test et
6. **Deploy:** Vercel'de environment variables ekle ve deploy et

## 🔗 Önemli Linkler

- Supabase Project: `https://zacsokxnytyfisagshlb.supabase.co`
- Vercel Dashboard: (proje deploy edildikten sonra)
- Dataset Dokümantasyonu: `docs/DATASET-INFO.md`

---

**Not:** Bu dosya yeni chat başlatırken referans olarak kullanılabilir. Güncellemeler buraya eklenmelidir.
