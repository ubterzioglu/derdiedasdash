# 🚀 CURSOR BAŞLANGIÇ PROMPT'U (KOPYALA & YAPIŞTIR)

```
Der Die Das Space - Almanca Öğrenme Platformu - Frontend Geliştirme

PROJE ÖZETİ:
- Platform: 5 oyunlu Almanca öğrenme platformu
- Teknoloji: Vanilla HTML/CSS/JS (framework yok!)
- Backend: Supabase (auth + database)
- Hosting: Vercel
- Hedef: Mobile-first, premium gamification

ŞU DOSYALARI OKUDUN:
✅ AI_AGENT_BRIEF_v1_0.md (350+ sayfa - backend, database, scoring)
✅ FRONTEND_DESIGN_BRIEF_v1_2_1_FINAL.md (wireframes, components, CSS)
✅ QWEN_DATASET_GENERATION_PROMPT.md (dataset formatı)
✅ badge_system_admin_panel.md
✅ german_only_reminder.md
✅ multi_game_mechanics.md
✅ Logo: derdiedasspacelogo.png

GÖREVİN:
1. Proje yapısını oluştur (~55 dosya)
2. Tüm frontend kodlarını yaz (HTML/CSS/JS)
3. SQL scriptleri hazırla
4. Placeholder dataset ekle (ilk 2 set)

ADIM ADIM İLERLE:

ADIM 1: Proje Yapısını Göster
---
Önce bana şunu göster:
- Tam dosya yapısı (tree view)
- Hangi dosyaları oluşturacaksın?
- Tahmini satır sayıları
- Hangi sırayla ilerleyeceğiz?

Onayımı bekle, sonra başla!

KRİTİK KURALLAR:
---
🔴 MUTLAKA UYULACAKLAR:

1. MOBILE-FIRST RESPONSIVE
   - Önce mobile CSS (320px+)
   - Sonra tablet (768px+)
   - Son desktop (1024px+)
   
2. LOGO RENKLERİNİ KULLAN
   ```css
   --color-blue: #0099FF;    /* die */
   --color-green: #88CC00;   /* .space */
   --color-orange: #FF6633;  /* CTA */
   --color-yellow: #FFCC00;  /* das */
   --color-red: #FF4444;     /* der */
   ```

3. KEYBOARD INPUT YOK!
   - Oyunlarda SADECE tıklama/buton
   - Input field sadece auth'da (email/password)
   - Der Die Dash: 3 buton YAN YANA (mobilde de!)

4. ZORLUK BADGELERİ (5 seviye)
   - EASY: #88CC00 (yeşil)
   - MEDIUM: #0099FF (mavi)
   - HARD: #FF6633 (turuncu)
   - VERY HARD: #FF3366 (koyu pembe)
   - EXPERT: #9933FF (mor)

5. ÇOK DİLLİ UI (TR/EN/DE)
   - Kelimeler HEP ALMANCA
   - UI çok dilli (menü, buton vs.)
   - İlk açılışta dil seçim modal

DOSYA YAPISI (BEKLENTİ):
---
/der-die-das-space
├── index.html                    # Landing page
├── leaderboard.html              # Skor tablosu
├── profile.html                  # Kullanıcı profili
├── badges.html                   # Badge koleksiyonu
│
├── /games                        # Oyun sayfaları
│   ├── der-die-dash.html
│   ├── case-control.html
│   ├── word-salad.html
│   ├── translation-quest.html
│   └── five-letter-blitz.html
│
├── /css
│   ├── main.css                  # CSS variables + global
│   ├── components.css            # Button, card, modal vs.
│   ├── animations.css            # Smooth transitions
│   └── difficulty-badges.css     # 5 zorluk seviyesi
│
├── /js
│   ├── /core
│   │   ├── supabase.js          # Supabase client
│   │   ├── auth.js              # Login/register
│   │   ├── scoring.js           # Unified scoring
│   │   ├── timer.js             # Oyun timer'ı
│   │   ├── combo.js             # Combo sistemi
│   │   ├── i18n.js              # Çok dilli destek
│   │   └── referral.js          # WhatsApp referral
│   │
│   ├── /components
│   │   ├── game-card.js         # Oyun kartı
│   │   ├── set-card.js          # Set kartı
│   │   ├── user-card.js         # Leaderboard kartı
│   │   └── language-selector.js # Dil değiştirici
│   │
│   ├── /games
│   │   ├── der-die-dash.js
│   │   ├── case-control.js
│   │   ├── word-salad.js
│   │   ├── translation-quest.js
│   │   └── five-letter-blitz.js
│   │
│   └── app.js                   # Main app logic
│
├── /assets
│   ├── logo.png                 # derdiedasspacelogo.png
│   ├── logo-small.png           # Favicon için
│   └── favicon.ico
│
└── /sql                         # Supabase scriptleri
    ├── 01_schema.sql            # 11 tablo
    ├── 02_views.sql             # 2 view
    ├── 03_functions.sql         # 2 function
    └── 04_seed_data.sql         # 5 badge + demo set

TOPLAM: ~55 dosya, ~12,000 satır

PLACEHOLDER DATASET:
---
İlk 2 set için AI placeholder data üret:

Demo Set (10 kelime):
- Tisch (der)
- Auto (das)
- Tür (die)
- Buch (das)
- Stuhl (der)
- Lampe (die)
- Fenster (das)
- Baum (der)
- Blume (die)
- Kind (das)

Level 1 - Set 1 (10 kelime):
- Günlük kelimeler
- Her artikel dengeli

(Qwen dataset'i sonra eklenecek)

SUPABASE KEYS:
---
Kodda şu placeholder'ları kullan:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
```

İŞLEYİŞ ADIMI:
---
1. Dosya yapısını göster → Onayla
2. CSS dosyaları (main, components, animations)
3. index.html (landing page)
4. der-die-dash.html (oyun sayfası)
5. JS core (supabase, auth, scoring, timer, combo, i18n)
6. JS components (game-card, set-card, user-card)
7. JS games (der-die-dash, case-control, word-salad)
8. Diğer HTML sayfaları (leaderboard, profile, badges)
9. SQL scripts (schema, views, functions, seed data)

Her adımda:
- Dosyayı oluştur
- Bana göster
- Onayımı bekle
- Devam et

HAZIR MISIN?
```

---

## 📋 KULLANIM TALİMATI

1. **Cursor'u aç** (Empty folder: `der-die-das-space`)
2. **13 dosyayı yükle** (drag & drop)
3. **Cmd/Ctrl + L** (AI chat aç)
4. **Yukarıdaki prompt'u kopyala-yapıştır**
5. **AI'nın dosya yapısını göstermesini bekle**
6. **Onayla ve başlat!**

---

## ⚠️ MUHTEMEL SORUNLAR VE ÇÖZÜMLER

### Sorun 1: AI çok hızlı gidiyor
**Söyle:** "Dur! Önce CSS'i bitir, bana göster."

### Sorun 2: Renk paleti yanlış
**Söyle:** "Logo renklerini kullan: #0099FF, #88CC00, #FF6633, #FFCC00, #FF4444"

### Sorun 3: Keyboard input var
**Söyle:** "Oyunlarda keyboard kaldır, sadece buton tıklama!"

### Sorun 4: Der Die Dash butonları dikey
**Söyle:** "Der Die Dash'te 3 buton mobilde de YAN YANA olacak!"

### Sorun 5: CSS variables eksik
**Söyle:** "FRONTEND_DESIGN_BRIEF'teki tüm CSS variables'ları ekle"

---

## ✅ BİTİŞ KONTROLLİSTİ

- [ ] 55+ dosya oluşturuldu
- [ ] index.html browser'da açılıyor
- [ ] Logo görünüyor
- [ ] CSS yükleniyor
- [ ] Console'da hata yok
- [ ] Mobile responsive (375px test)
- [ ] Tablet responsive (768px test)
- [ ] Desktop responsive (1024px test)
- [ ] Butonlar tıklanabilir
- [ ] Animasyonlar smooth
- [ ] Renk paleti doğru

---

**BAŞARILAR!** 🚀

Bu prompt ile 4-5 saat içinde production-ready frontend hazır olacak!
