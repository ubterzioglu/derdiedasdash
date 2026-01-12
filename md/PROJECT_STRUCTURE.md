# 🚀 DER DIE DAS SPACE - PROJE YAPISI

## 📁 Dosya Yapısı (55+ Dosya)

```
derdiedasspace/
├── index.html                          # Landing page (oyun seçim)
├── leaderboard.html                    # Global leaderboard
├── profile.html                        # Kullanıcı profili
├── badges.html                         # Badge koleksiyonu
│
├── /games                              # Oyun sayfaları
│   ├── der-die-dash.html
│   ├── case-control.html
│   ├── word-salad.html
│   ├── translation-quest.html
│   └── five-letter-blitz.html
│
├── /admin                              # Admin panel
│   ├── index.html                      # Admin login
│   ├── dashboard.html                  # Dashboard
│   ├── sets.html                       # Set yönetimi
│   ├── badges.html                     # Badge yönetimi
│   └── games.html                      # Oyun yönetimi
│
├── /css                                # Stil dosyaları
│   ├── main.css                        # CSS variables + global styles
│   ├── components.css                  # Button, card, modal, etc.
│   ├── animations.css                  # Animasyon keyframes
│   └── difficulty-badges.css           # Zorluk badge stilleri
│
├── /js                                 # JavaScript dosyaları
│   ├── /core                           # Core sistemler
│   │   ├── supabase.js                 # Supabase client
│   │   ├── auth.js                     # Authentication
│   │   ├── scoring.js                  # Unified scoring system
│   │   ├── timer.js                    # Timer component
│   │   ├── combo.js                    # Combo system
│   │   ├── i18n.js                     # Çok dilli destek (TR/EN)
│   │   └── referral.js                 # WhatsApp referral
│   │
│   ├── /components                     # UI Components
│   │   ├── game-card.js                # Oyun kartı component
│   │   ├── set-card.js                 # Set kartı component
│   │   ├── user-card.js                # Leaderboard kartı
│   │   └── language-selector.js        # Dil değiştirici
│   │
│   ├── /games                          # Oyun logic dosyaları
│   │   ├── der-die-dash.js
│   │   ├── case-control.js
│   │   ├── word-salad.js
│   │   ├── translation-quest.js
│   │   └── five-letter-blitz.js
│   │
│   ├── /admin                          # Admin panel JS
│   │   ├── auth.js                     # Admin auth
│   │   ├── dashboard.js
│   │   ├── sets.js
│   │   ├── badges.js
│   │   └── games.js
│   │
│   ├── registry.js                     # Game registry
│   ├── leaderboard.js                  # Leaderboard logic
│   └── app.js                          # Main app orchestrator
│
├── /assets                             # Asset dosyaları
│   ├── /images
│   │   ├── logo.png                    # Ana logo (derdiedasspacelogo.png)
│   │   ├── logo-small.png              # Küçük logo
│   │   └── favicon.ico                 # Favicon
│   └── /sounds                         # (v2.0 için, şimdilik boş)
│
└── /sql                                # Supabase SQL scriptleri
    ├── 01_schema.sql                   # 11 tablo
    ├── 02_views.sql                    # 2 view
    ├── 03_functions.sql                # 2 function
    └── 04_seed_data.sql                # 5 badge + demo set

```

## 📊 Tahmini Satır Sayıları

| Kategori | Dosya Sayısı | Satır Sayısı |
|----------|-------------|--------------|
| HTML | 14 | ~3,500 |
| CSS | 4 | ~2,500 |
| JS Core | 7 | ~2,000 |
| JS Components | 4 | ~800 |
| JS Games | 5 | ~2,000 |
| JS Admin | 5 | ~1,200 |
| JS Utils | 3 | ~500 |
| SQL | 4 | ~1,500 |
| **TOPLAM** | **46** | **~14,000** |

## 🎯 Oluşturulma Sırası

### Phase 1: Temel Yapı (30 dk)
1. ✅ Klasör yapısını oluştur
2. ✅ CSS dosyalarını yaz (main.css, components.css, animations.css)
3. ✅ index.html'i oluştur

### Phase 2: Core Sistemler (1 saat)
1. ✅ supabase.js
2. ✅ auth.js
3. ✅ scoring.js
4. ✅ timer.js
5. ✅ combo.js
6. ✅ i18n.js

### Phase 3: Oyun Sayfaları (1.5 saat)
1. ✅ der-die-dash.html + der-die-dash.js
2. ✅ Diğer 4 oyun sayfası
3. ✅ Set özeti ekranı

### Phase 4: Diğer Sayfalar (1 saat)
1. ✅ leaderboard.html
2. ✅ profile.html
3. ✅ badges.html

### Phase 5: SQL Scripts (30 dk)
1. ✅ schema.sql
2. ✅ views.sql
3. ✅ functions.sql
4. ✅ seed_data.sql

### Phase 6: Admin Panel (1 saat)
1. ✅ Admin HTML sayfaları
2. ✅ Admin JS dosyaları

### Phase 7: Polish (30 dk)
1. ✅ Asset dosyaları
2. ✅ Placeholder dataset
3. ✅ Son kontroller

## ✅ Hazır mısın?

Onayladığın anda başlayacağım!
