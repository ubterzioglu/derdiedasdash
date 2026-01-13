# 🎯 DER DIE DAS SPACE - CLAUDE HANDOFF SUMMARY
**Son Güncelleme:** 2026-01-13  
**Proje Durumu:** Aktif Geliştirme

---

## 📋 PROJE GENEL BAKIŞ

**Der Die Das Space**, Almanca artikel öğrenme oyunu platformu. Kullanıcılar 5 farklı oyun modunda kelimelere doğru artikel (der/die/das) tahmin ederek puan kazanır.

### 5 Oyun Modu:
1. **Der Die Dash** - Artikel tahmin oyunu (ana oyun)
2. **Case Control** - Preposition + artikel form tahmin
3. **Word Salad** - Kelime karıştırma ve cümle oluşturma
4. **Translation Quest** - Çeviri tahmin oyunu
5. **Five Letter Blitz** - 5 harfli kelime tahmin

---

## 🗄️ DATABASE YAPISI

### Önemli Tablolar:

#### `word_sets`
- `id` (SERIAL PRIMARY KEY)
- `game_type_id` (INT, FK -> game_types)
- `set_number` (INT, 1'den başlar)
- `difficulty_level` (SMALLINT, 1-5 arası)
- **NOT:** `is_demo` sütunu kaldırıldı! Artık demo set yok.

#### `questions`
- `id` (SERIAL PRIMARY KEY)
- `set_id` (INT, FK -> word_sets)
- `question_data` (JSONB, oyun tipine göre değişir)
- `order_in_set` (SMALLINT, 1-10 arası)
- **ÖNEMLİ:** Her sette TAM 10 soru olmalı!

#### `game_types`
- `id` (SERIAL PRIMARY KEY)
- `game_code` (VARCHAR, 'der_die_dash', 'case_control', vb.)
- `timer_seconds` (INT)
- `base_score` (INT)

#### `user_game_sets`
- Kullanıcı skorları ve istatistikleri
- `set_score`, `normalized_score`, `correct_answers`, `wrong_answers`, `max_combo`, vb.

### Database Kuralları:
- ✅ Her sette **tam 10 soru** olmalı
- ✅ `order_in_set` değerleri **1-10 arası** ve **sıralı** olmalı
- ✅ Set numaraları **1'den başlar** (0 değil)
- ✅ `is_demo` sütunu **artık yok** (tüm SQL sorgularından kaldırıldı)

---

## 📁 ÖNEMLİ DOSYA YAPISI

### HTML Dosyaları:
```
games/
  ├── der-die-dash.html (Ana oyun ekranı)
  ├── der-die-dash-difficulty.html (Zorluk seviyesi seçimi)
  ├── der-die-dash-sets.html (Set seçimi)
  ├── case-control.html, case-control-difficulty.html, case-control-sets.html
  ├── word-salad.html, word-salad-difficulty.html, word-salad-sets.html
  ├── translation-quest.html, translation-quest-difficulty.html, translation-quest-sets.html
  └── five-letter-blitz.html, five-letter-blitz-difficulty.html, five-letter-blitz-sets.html
```

### JavaScript Dosyaları:
```
js/
  ├── games/
  │   ├── der-die-dash.js (Ana oyun logic)
  │   ├── sets-selection.js (Set seçim ekranı - TÜM OYUNLAR İÇİN ORTAK)
  │   ├── difficulty-selection.js (Zorluk seviyesi seçimi - TÜM OYUNLAR İÇİN ORTAK)
  │   ├── case-control.js, word-salad.js, translation-quest.js, five-letter-blitz.js
  │   └── set-selection.js (Eski, artık sets-selection.js kullanılıyor)
  ├── core/
  │   ├── supabase.js (Supabase client)
  │   ├── auth.js (Authentication)
  │   ├── scoring.js (Puanlama sistemi)
  │   ├── timer.js (Zamanlayıcı)
  │   ├── combo.js (Combo sistemi)
  │   ├── animations.js (Animasyonlar - confetti, wrong, timeout)
  │   └── i18n.js (Çoklu dil desteği)
  └── components/
      ├── game-card.js, set-card.js, user-card.js
      ├── hamburger-menu.js, language-selector.js
```

### CSS Dosyaları:
```
css/
  ├── main.css (Genel stiller, CSS variables)
  ├── components.css (Butonlar, kartlar, UI bileşenleri)
  ├── pages.css (Sayfa özel stilleri, difficulty cards, set cards)
  ├── animations.css (Animasyon keyframes)
  ├── landing.css, responsive.css, difficulty-badges.css
```

---

## 🎨 SON YAPILAN DEĞİŞİKLİKLER

### 1. **Der Die Dash Oyun Ekranı Güncellemeleri**
- ✅ Kelime kartı (`word-frame`) yüksekliği yarıya düşürüldü (3rem → 1.5rem padding)
- ✅ Timer ve combo göstergesi kelime kartının içine alındı
  - Timer: Sola yaslı (`.timer-in-card`)
  - Combo: Sağa yaslı (`.combo-in-card`)
- ✅ Font stilleri diğer metinlerle uyumlu hale getirildi

**Dosya:** `games/der-die-dash.html`, `css/components.css`

### 2. **Animasyon Sistemi Güncellemesi**
- ✅ Konfeti **sadece doğru cevaplarda** patlıyor
- ✅ Yanlış cevaplar için `createWrongAnimation()` (kırmızı flash/shake)
- ✅ Süre bitince `createTimeoutAnimation()` (timeout pulse)
- ✅ Tüm oyunlarda uygulandı

**Dosyalar:** `js/core/animations.js`, `css/animations.css`, tüm `js/games/*.js` dosyaları

### 3. **Set Seçim Ekranı Güncellemeleri**
- ✅ "Level X - [Difficulty]" kartı zorluk seviyesine göre renk değiştiriyor:
  - Level 1 (Kolay): Yeşil
  - Level 2 (Orta-Kolay): Mavi
  - Level 3 (Orta): Turuncu
  - Level 4 (Zor): Kırmızı
  - Level 5 (Çok Zor): Mor
- ✅ "Zorluk Seviyesi" butonu ayrı bir kart oldu (sarı, siyah font)
- ✅ Her iki kart da "Menüyü Aç" butonu genişliğinde (max-width: 365px)

**Dosyalar:** `games/*-sets.html`, `js/games/sets-selection.js`, `css/pages.css`

### 4. **Zorluk Seviyesi Seçim Ekranı**
- ✅ Kartlar kompakt hale getirildi (min-height: 60px)
- ✅ "Level X - [Difficulty]" tek satırda gösteriliyor
- ✅ Kart genişliği "Menüyü Aç" butonuyla aynı (max-width: 365px)
- ✅ Renkli kenarlıklar eklendi

**Dosyalar:** `games/*-difficulty.html`, `js/games/difficulty-selection.js`, `css/pages.css`

### 5. **Oyun Sonu Ekranı (Results Screen)**
- ✅ İstatistikler 2x2 grid'de ayrı kartlarda:
  - Doğru Cevaplar
  - Yanlış Cevaplar
  - Ortalama Süre
  - Max Combo
- ✅ Butonlar alt alta, geniş ve yeşil:
  - "Skor Tablosunu Gör" (üstte)
  - "Ana Sayfa" (altta)

**Dosyalar:** Tüm `js/games/*.js` dosyalarındaki `showResults()` fonksiyonu, `css/components.css`

### 6. **Buton Hover/Click Efektleri**
- ✅ Tüm butonlarda `text-decoration: none` eklendi (hover/click'te underline yok)
- ✅ Diğer efektler (transform, shadow) korundu

**Dosyalar:** `css/components.css`, `css/main.css`

### 7. **Database ve Set Yönetimi**
- ✅ `is_demo` sütunu tüm SQL sorgularından kaldırıldı
- ✅ Set numaraları 1'den başlıyor (0 değil)
- ✅ Her sette maksimum 10 soru limiti eklendi (JavaScript'te)
- ✅ 10'dan fazla soru varsa console'da uyarı gösteriliyor

**Dosyalar:** `js/games/der-die-dash.js` (ve diğer oyun dosyaları), `supabase/*.sql`

---

## 🔧 ÖNEMLİ KOD YAPILARI

### Set Yükleme (Der Die Dash örneği):
```javascript
async function loadSetById(setId) {
  const setIdInt = parseInt(setId, 10);
  if (isNaN(setIdInt)) {
    // Hata yönetimi
  }
  
  // Set bilgilerini çek
  const { data: set, error } = await supabase
    .from('word_sets')
    .select('*')
    .eq('id', setIdInt)
    .single();
  
  // Soruları çek (MAX 10 soru!)
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('set_id', setIdInt)
    .order('order_in_set', { ascending: true })
    .limit(10); // Limit eklendi!
  
  // 10'dan fazla soru varsa uyarı
  if (questions && questions.length > 10) {
    console.warn(`Set ${setId} has more than 10 questions!`);
  }
}
```

### Animasyon Kullanımı:
```javascript
import { createConfetti, createWrongAnimation, createTimeoutAnimation } from '../core/animations.js';

// Doğru cevap
if (isCorrect) {
  createConfetti(element); // Sadece doğru cevaplarda!
  animateCorrect(element);
}

// Yanlış cevap
if (!isCorrect && !isTimeout) {
  createWrongAnimation(element);
  animateWrong(element);
}

// Süre bitti
if (isTimeout) {
  createTimeoutAnimation(element);
  // Timeout animasyonu
}
```

### Set Seçim Ekranı (sets-selection.js):
```javascript
// Zorluk seviyesine göre renk belirleme
function getDifficultyColor(level) {
  const colors = {
    1: 'var(--color-green)',    // Kolay
    2: 'var(--color-blue)',      // Orta-Kolay
    3: 'var(--color-orange)',    // Orta
    4: 'var(--color-red)',       // Zor
    5: 'var(--color-purple)'     // Çok Zor
  };
  return colors[level] || 'var(--color-gray)';
}

// Difficulty header card'a renk uygula
elements.difficultyHeaderCard.style.background = getDifficultyColor(selectedDifficulty);
```

---

## ⚠️ BİLİNMESİ GEREKENLER

### 1. **Set Yapısı**
- Her sette **tam 10 soru** olmalı
- `order_in_set` değerleri **1-10 arası** ve **sıralı** olmalı
- Eğer database'de 10'dan fazla soru varsa, JavaScript sadece ilk 10'unu yükler

### 2. **Demo Set Yok**
- `is_demo` sütunu kaldırıldı
- Demo set yok, bunun yerine ilk Level 1 seti yükleniyor

### 3. **Set Numaraları**
- Set numaraları **1'den başlar** (0 değil)
- Database'de `COALESCE(MAX(set_number), 0) + 1` kullanılıyor

### 4. **Oyun Dosya Yolları**
- Set seçim ekranından oyuna geçiş: `window.location.href = currentGame.route`
- Route'lar `registry.js`'de tanımlı (örn: `games/der-die-dash.html`)

### 5. **CSS Variables**
- Renkler: `--color-green`, `--color-blue`, `--color-orange`, `--color-red`, `--color-purple`, `--color-yellow`
- Spacing: `--space-xs`, `--space-sm`, `--space-md`, `--space-lg`, `--space-xl`, `--space-2xl`
- Border radius: `--border-radius`, `--border-radius-lg`

---

## 🐛 BİLİNEN SORUNLAR / DİKKAT EDİLMESİ GEREKENLER

### 1. **Set 1'de 30 Soru Sorunu**
- **Durum:** Level 1 Set 1'de 30 soru var (10 olmalı)
- **Çözüm:** Database'den fazla soruları silmek gerekiyor
- **SQL:** `supabase/check_set_1_questions.sql` dosyasında DELETE sorgusu var (yorum satırı)

### 2. **Path Yapısı**
- Bazı dosyalarda `games/` prefix'i var, bazılarında yok
- `sets-selection.js`'de `currentGame.route` kullanılıyor (registry.js'den geliyor)

### 3. **i18n (Çoklu Dil)**
- Tüm metinler `t('key')` ile çevriliyor
- Dil dosyaları: `js/core/i18n.js` içinde

---

## 📝 YAPILACAKLAR (OPSIYONEL)

- [ ] Diğer oyunlarda da timer/combo kart içine alınabilir (Der Die Dash'ta yapıldı)
- [ ] Database'deki fazla soruları temizleme scripti
- [ ] Set numaralarının 1'den başladığını doğrulama (database kontrolü)

---

## 🔗 ÖNEMLİ DOSYALAR

### SQL Dosyaları:
- `supabase/schema.sql` - Database şeması
- `supabase/check_set_1_questions.sql` - Set 1 kontrol sorguları
- `supabase/example_set_1_structure.md` - Set 1 örnek yapısı
- `supabase/example_set_1_visual.sql` - Set 1 görsel örnekleri
- `supabase/SET_EKLEME_SORULARI.md` - Tüm oyunlar için set ekleme SQL'leri

### Dokümantasyon:
- `der-die-das-space-cursor/AI_AGENT_BRIEF_v1_0.md` - Proje brief
- `der-die-das-space-cursor/FRONTEND_DESIGN_BRIEF_v1_2_1_FINAL.md` - UI/UX tasarım brief
- `md/PROJECT_STATUS.md` - Proje durumu
- `md/DATABASE_SCHEMA_ANALYSIS.md` - Database analizi

---

## 🎯 SON KULLANICI İSTEKLERİ

1. ✅ "Der Die Dash oyun ekranında kelime kartı küçültüldü, timer/combo kart içine alındı"
2. ✅ "Konfeti sadece doğru cevaplarda patlıyor, yanlış ve timeout için farklı animasyonlar"
3. ✅ "Set seçim ekranında zorluk seviyesi kartı renkli, 'Zorluk Seviyesi' butonu sarı kart"
4. ✅ "Butonlarda hover/click'te underline yok"
5. ✅ "Level 1 Set 1'de 30 soru var, 10 olmalı" → JavaScript'te limit eklendi, database temizliği bekleniyor

---

## 💡 HIZLI BAŞLANGIÇ

### Yeni bir özellik eklerken:
1. İlgili oyun dosyasını bul (`js/games/[game-name].js`)
2. CSS değişiklikleri için `css/components.css` veya `css/pages.css`
3. Animasyonlar için `js/core/animations.js` ve `css/animations.css`
4. Database değişiklikleri için `supabase/` klasöründeki SQL dosyaları

### Set eklerken:
1. `supabase/SET_EKLEME_SORULARI.md` dosyasındaki SQL sorgularını kullan
2. Her sette **tam 10 soru** olduğundan emin ol
3. `order_in_set` değerlerinin 1-10 arası ve sıralı olduğunu kontrol et

### Hata ayıklarken:
1. Browser console'u kontrol et (JavaScript hataları)
2. Supabase dashboard'u kontrol et (database sorguları)
3. Network tab'ı kontrol et (API istekleri)

---

**Not:** Bu özet, son yapılan değişiklikleri ve mevcut proje durumunu yansıtır. Yeni değişiklikler yapıldıkça bu dosya güncellenmelidir.
