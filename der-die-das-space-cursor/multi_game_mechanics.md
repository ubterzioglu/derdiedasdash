# 🎮 Der Die Das Space - Çoklu Oyun Mekaniği

## 🏗️ Platform Mimarisi

**Der Die Das Space** tek bir oyun değil, üç farklı Almanca öğrenme oyununu barındıran modüler bir platformdur.

---

## 🎯 OYUN 1: Artikel Dash (v1.0 - ŞİMDİLİK)

### 📋 Oyun Mekaniği
**Amaç:** Almanca kelimenin doğru artikelini bul (der, die, das)

### ⚙️ Oynanış
1. Ekranda Almanca kelime gösterilir (örnek: "Tisch")
2. Altta 3 seçenek: [der] [die] [das]
3. Kullanıcı 5 saniye içinde seçim yapar
4. Doğru/yanlış feedback + animasyon
5. Sonraki soruya geçiş
6. 10 soru = 1 set tamamlanır

### 🎯 Puanlama
- **Base Puan:** Zorluk seviyesine göre (10-30 puan)
- **Hız Bonusu:** 
  - < 2 saniye: +10 puan
  - < 3 saniye: +5 puan
  - < 4 saniye: +2 puan
- **🔥 Combo Bonusu:**
  - 3 üst üste doğru: Combo başlar → +5 puan/doğru
  - 5 combo sonrası sıfırlanır
  - 1 yanlış cevap → combo resetlenir

### 📊 Örnek Hesaplama
```
Soru 1: Tisch (der) - Doğru (2.1s) = 10 + 5 = 15 puan
Soru 2: Tür (die) - Doğru (1.8s) = 10 + 10 = 20 puan
Soru 3: Auto (das) - Doğru (1.5s) = 10 + 10 + 5 (combo) = 25 puan 🔥
Soru 4: Buch (das) - Doğru (2.5s) = 10 + 5 + 5 (combo) = 20 puan 🔥
Soru 5: Stuhl (der) - Yanlış = 0 puan ❌ (combo resetlendi)
...
Toplam: 80 puan
```

---

## 🔤 OYUN 2: Word Salad (v2.0 - GELECEK)

### 📋 Oyun Mekaniği
**Amaç:** Karışık harfleri doğru sıraya koyarak Almanca kelimeyi bul

### ⚙️ Oynanış
1. Ekranda karışık harfler gösterilir (örnek: "C S I H T")
2. Kullanıcı harfleri sırayla tıklayarak kelimeyi oluşturur
3. Seçilen harfler üst kutuya yerleşir: [T][I][S][C][H]
4. **"GO" butonu** ile cevabı onaylar
5. **Yanlışsa:** Shake animasyonu + "RESET" butonu → tekrar dene
6. **Doğruysa:** Confetti + sonraki soruya geç
7. Süre: **15 saniye** (Artikel Dash'ten daha uzun!)
8. 10 soru = 1 set

### 🎯 Puanlama
- **Base Puan:** Zorluk seviyesine göre (10-30 puan)
- **Hız Bonusu:**
  - < 5 saniye: +15 puan
  - < 8 saniye: +10 puan
  - < 12 saniye: +5 puan
- **🔥 Combo Bonusu:** (Artikel Dash ile aynı)
  - 3 üst üste doğru: +5 puan/doğru
  - 5 combo sonrası resetlenme

### 🎨 UI Örneği
```
┌──────────────────────────────┐
│   Soru 3/10         ⏱ 12s   │
│                              │
│   [T][I][S][C][H]            │ ← Kullanıcı oluşturuyor
│   ─────────────────          │
│                              │
│   [C] [S] [I] [H] [T]        │ ← Karışık harfler (tıklanabilir)
│                              │
│   [RESET]  [GO ➜]            │
└──────────────────────────────┘
```

### 📊 Soru Formatı (Database)
```json
{
  "scrambled": "CSIHT",
  "correct_word": "Tisch",
  "correct_article": "der"
}
```

---

## 📍 OYUN 3: Preposition Master (v3.0 - GELECEK)

### 📋 Oyun Mekaniği
**Amaç:** Preposition'lu cümlelerde doğru artikel formunu bul

### ⚙️ Oynanış
1. Ekranda preposition + kelime gösterilir
   - Örnek: "mit ... Tisch"
2. 3 seçenek gösterilir: [dem] [der] [den]
3. Kullanıcı doğru formu seçer
4. Doğru cevap: "mit dem Tisch" ✅
5. Süre: **5 saniye**
6. 10 soru = 1 set

### 🎯 Puanlama
- **Base Puan:** Zorluk seviyesine göre (15-35 puan) ← Daha zor!
- **Hız Bonusu:**
  - < 2 saniye: +15 puan
  - < 3 saniye: +10 puan
  - < 4 saniye: +5 puan
- **🔥 Combo Bonusu:** (Diğerleri ile aynı)

### 📚 Örnek Sorular
```
mit ... Tisch  → [dem] [der] [den]  ✅ dem
von ... Frau   → [der] [die] [den]  ✅ der
zu  ... Schule → [der] [die] [dem]  ✅ der
für ... Kind   → [das] [dem] [den]  ✅ das
```

### 🎨 UI Örneği
```
┌──────────────────────────────┐
│   Soru 5/10         ⏱ 4s    │
│                              │
│      mit ... Tisch           │
│                              │
│   [dem]  [der]  [den]        │
│                              │
└──────────────────────────────┘
```

### 📊 Soru Formatı (Database)
```json
{
  "preposition": "mit",
  "word": "Tisch",
  "correct_form": "dem",
  "options": ["dem", "der", "den"]
}
```

---

## 🔧 ORTAK ÖZELLİKLER (Tüm Oyunlar)

### ✅ Her Oyunda Aynı Olan Şeyler:

| Özellik | Değer |
|---------|-------|
| Soru sayısı / set | 10 |
| Zorluk seviyeleri | 1-5 (Kolay → Çok Zor) |
| Combo sistemi | ✅ (3 başla, 5'te sıfırla) |
| Hız bonusu | ✅ |
| Demo mode | ✅ (1 set ücretsiz) |
| Set tekrarı | ❌ (Her set 1 kere) |
| Multi-language UI | ✅ (TR/DE/EN) |
| Leaderboard | ✅ (Global + Set bazlı) |

### ⏱️ Oyuna Göre Farklı Olanlar:

| Özellik | Artikel Dash | Word Salad | Preposition Master |
|---------|--------------|------------|-------------------|
| Süre | 5 saniye | **15 saniye** | 5 saniye |
| Base puan | 10-30 | 10-30 | **15-35** |
| Zorluk | Orta | Kolay-Orta | **Zor** |

---

## 🗄️ VERİTABANI YAPILANDIRMASI

### Modüler Yaklaşım

#### game_types tablosu
```sql
id | game_code            | game_name_en         | timer_seconds | is_active
---+----------------------+----------------------+---------------+-----------
1  | artikel_dash         | Artikel Dash         | 5             | true
2  | word_salad           | Word Salad           | 15            | false
3  | preposition_master   | Preposition Master   | 5             | false
```

#### word_sets tablosu
```sql
id | game_type_id | set_number | difficulty_level | is_demo
---+--------------+------------+------------------+---------
1  | 1            | 1          | 1                | true
2  | 1            | 2          | 1                | false
3  | 1            | 3          | 1                | false
...
26 | 2            | 1          | 1                | true    ← Word Salad demo
27 | 2            | 2          | 1                | false
```

#### questions tablosu (Esnek yaklaşım)
```sql
id | set_id | question_data (JSONB)                           | order_in_set
---+--------+-------------------------------------------------+-------------
1  | 1      | {"word": "Tisch", "correct_article": "der"}     | 1
2  | 1      | {"word": "Tür", "correct_article": "die"}       | 2
...
101| 26     | {"scrambled":"CSIHT","correct_word":"Tisch"}    | 1
```

---

## 🎨 KULLANICI AKIŞI

### İlk Giriş (Platform Level)
```
1. Landing Page (Logo + Dil seçimi)
   ↓
2. Oyun Seçim Ekranı
   - [Artikel Dash] ← Aktif
   - [Word Salad] ← Yakında
   - [Preposition Master] ← Yakında
   ↓
3. Artikel Dash'e tıkla
   ↓
4. Oyun Ana Sayfası
   - Demo Oyna
   - Login/Register
   - Set listesi
```

### Oyun Akışı (Her Oyun İçin)
```
1. Set seç → Oyun başlar
2. 10 soru arka arkaya
3. Her soru: Timer → Cevap → Feedback → Next
4. Set tamamlandı → Özet ekranı
5. Leaderboard'a bak veya Ana menüye dön
```

---

## 📅 GELİŞTİRME ROADMAP

### Phase 1: v1.0 - Artikel Dash (4 hafta)
- ✅ Temel platform altyapısı
- ✅ Auth sistemi
- ✅ Artikel Dash oyunu
- ✅ Combo sistemi
- ✅ Leaderboard
- ✅ 250 kelime hazırlama

### Phase 2: v2.0 - Word Salad (+3 hafta)
- ✅ Word Salad mekaniği
- ✅ 250 yeni kelime (scrambled versiyonlarıyla)
- ✅ 15 saniyelik timer sistemi
- ✅ Reset/GO buton mekaniği
- ✅ Oyun seçim ekranı

### Phase 3: v3.0 - Preposition Master (+3 hafta)
- ✅ Preposition mekaniği
- ✅ 250 preposition kombinasyonu
- ✅ Zorluk artışı (daha yüksek base puan)
- ✅ Tam platform entegrasyonu

---

## 🎯 MODÜLERLİK PRENSİPLERİ

### ✅ Ortak Modüller (Shared)
```
/shared
  /auth        - Login, Register, Session
  /scoring     - Puan hesaplama, combo sistemi
  /leaderboard - Global ve set-bazlı skorlar
  /timer       - Countdown timer component
  /animations  - Doğru/yanlış feedback
  /ui          - Buttons, Cards, Badges
```

### 🎮 Oyuna Özel Modüller (Games)
```
/games
  /artikel-dash
    /components
      - ArtikelButtons.jsx
      - WordCard.jsx
    /logic
      - gameLogic.js
      
  /word-salad
    /components
      - LetterPicker.jsx
      - WordBuilder.jsx
      - ResetButton.jsx
    /logic
      - scrambleLogic.js
      
  /preposition-master
    /components
      - PrepositionCard.jsx
      - FormSelector.jsx
    /logic
      - caseLogic.js
```

### 🏗️ Platform Seviyesi
```
/platform
  /game-selection  - Oyun seçim ekranı
  /profile         - Kullanıcı profili (tüm oyunların istatistikleri)
  /settings        - Platform ayarları
  /global-leaderboard - Tüm oyunları kapsayan liderlik tablosu
```

---

## 🚀 TEKNİK GEREKSINIMLER

### Backend (Supabase)
- ✅ Modüler tablo yapısı (game_type_id ile ayrım)
- ✅ Esnek soru formatı (JSONB)
- ✅ Oyuna özel views ve functions
- ✅ RLS policies (game type bazında)

### Frontend (HTML/CSS/JS)
- ✅ Modüler component yapısı
- ✅ Oyun factory pattern (her oyun kendi class'ı)
- ✅ Ortak scoring engine
- ✅ Router sistemi (oyunlar arası geçiş)

### Deployment
- ✅ Vercel (tüm oyunlar tek domain)
- ✅ Feature flags (yeni oyunları kontrollü açma)
- ✅ Version management

---

## 💡 GELECEK FIKIRLER (v4.0+)

### Potansiyel Yeni Oyunlar:
- 🎯 **Plural Master**: Tekil kelimenin çoğul halini bul
- 🎯 **Verb Conjugation**: Fiil çekimleri oyunu
- 🎯 **Sentence Builder**: Doğru cümle yapısı oluşturma
- 🎯 **Speed Round**: Hızlı ateş modu (30 soru 1 dakika)

### Platform Özellikleri:
- 🏆 Cross-game achievements
- 📊 Detaylı analytics dashboard
- 👥 Multiplayer mode (1v1 battles)
- 🎓 Learning path (oyunları sırayla aç)
- 📱 Mobile app (React Native)

---

**TARİH:** Ocak 2026
**VERSİYON:** v1.0 (Artikel Dash)
**HEDEF:** Modüler, genişletilebilir Almanca öğrenme platformu
