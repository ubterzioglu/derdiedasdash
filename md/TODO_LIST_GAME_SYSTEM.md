# 🎯 DER DIE DAS SPACE - GAME SYSTEM TODO LIST

**Tarih**: 2026-01-13  
**Durum**: İnşaat Aşamasında

---

## ✅ TAMAMLANAN İŞLER

### 1. ✅ Ana Sayfa Oyun Butonları
- [x] Oyun kartları accordion yapısına dönüştürüldü
- [x] Her oyun kartı kendi difficulty seçim sayfasına yönlendiriyor
- [x] Tüm 5 oyun için difficulty sayfaları oluşturuldu

### 2. ✅ Zorluk Seçim Sayfaları
- [x] `der-die-dash-difficulty.html`
- [x] `case-control-difficulty.html`
- [x] `word-salad-difficulty.html`
- [x] `translation-quest-difficulty.html`
- [x] `five-letter-blitz-difficulty.html`
- [x] JavaScript: `js/games/difficulty-selection.js`

### 3. ✅ Set Seçim Sayfaları
- [x] `der-die-dash-sets.html`
- [x] `case-control-sets.html`
- [x] `word-salad-sets.html`
- [x] `translation-quest-sets.html`
- [x] `five-letter-blitz-sets.html`
- [x] JavaScript: `js/games/sets-selection.js`
- [x] Database'den zorluk seviyesine göre set filtreleme çalışıyor

### 4. ✅ SQL Seed Data Yapısı
- [x] `supabase/seed_data.sql` dosyası oluşturuldu
- [x] 5 game_type tanımlandı
- [x] Her oyun için 11 set (1 demo + 10 normal) yapısı hazır
- [x] Demo setler için örnek sorular eklendi

### 5. ✅ HTML Layout Standardizasyonu
- [x] Tüm oyun HTML'leri der-die-dash layout'una göre standardize edildi
- [x] Hamburger menu script'i tek dosyaya taşındı (`js/components/hamburger-menu.js`)
- [x] Tüm sayfalarda aynı header, progress bar, timer, combo yapısı

---

## 🔄 YAPILACAK İŞLER

### 1. 🔴 YÜKSEK ÖNCELİK - SQL Seed Data Tamamlama

#### 1.1 Der Die Dash Soruları
- [ ] Level 1 Set 1 (Set ID: 2) - 10 soru
- [ ] Level 1 Set 2 (Set ID: 3) - 10 soru
- [ ] Level 2 Set 1 (Set ID: 4) - 10 soru
- [ ] Level 2 Set 2 (Set ID: 5) - 10 soru
- [ ] Level 3 Set 1 (Set ID: 6) - 10 soru
- [ ] Level 3 Set 2 (Set ID: 7) - 10 soru
- [ ] Level 4 Set 1 (Set ID: 8) - 10 soru
- [ ] Level 4 Set 2 (Set ID: 9) - 10 soru
- [ ] Level 5 Set 1 (Set ID: 10) - 10 soru
- [ ] Level 5 Set 2 (Set ID: 11) - 10 soru

**Format**: `{"word": "Tisch", "correct_article": "der"}`

#### 1.2 Case Control Soruları
- [ ] Level 1 Set 1 (Set ID: 102) - 10 soru
- [ ] Level 1 Set 2 (Set ID: 103) - 10 soru
- [ ] Level 2-5 Setler (Set ID: 104-111) - 80 soru

**Format**: `{"preposition": "mit", "word": "Tisch", "correct_form": "dem", "options": ["dem", "der", "den"]}`

#### 1.3 Word Salad Soruları
- [ ] Level 1 Set 1 (Set ID: 202) - 10 soru
- [ ] Level 1 Set 2 (Set ID: 203) - 10 soru
- [ ] Level 2-5 Setler (Set ID: 204-211) - 80 soru

**Format**: `{"correct_order": ["Ich", "gehe", ...], "scrambled": ["gehe", "Ich", ...]}`  
**ÖNEMLİ**: Her cümle tam olarak 10 kelime olmalı!

#### 1.4 Translation Quest Soruları
- [ ] Level 1 Set 1 (Set ID: 302) - 10 soru
- [ ] Level 1 Set 2 (Set ID: 303) - 10 soru
- [ ] Level 2-5 Setler (Set ID: 304-311) - 80 soru

**Format**: `{"german_word": "Hund", "translation_tr": "köpek", "translation_en": "dog", "wrong_options_tr": [...], "wrong_options_en": [...]}`

#### 1.5 Five Letter Blitz Soruları
- [ ] Level 1 Set 1 (Set ID: 402) - 10 soru
- [ ] Level 1 Set 2 (Set ID: 403) - 10 soru
- [ ] Level 2-5 Setler (Set ID: 404-411) - 80 soru

**Format**: `{"word": "TISCH", "scrambled": ["C", "I", "S", "H", "T"], "article": "der"}`  
**ÖNEMLİ**: Tüm kelimeler tam olarak 5 harf olmalı!

**TOPLAM**: 100 set × 10 soru = **1000 soru** (Demo setler hariç)

---

### 2. 🟡 ORTA ÖNCELİK - Database Bağlantısı

#### 2.1 Supabase'e Seed Data Yükleme
- [ ] `supabase/seed_data.sql` dosyasını Supabase SQL Editor'de çalıştır
- [ ] `game_types` tablosunu kontrol et (5 kayıt olmalı)
- [ ] `word_sets` tablosunu kontrol et (55 kayıt olmalı: 11 set × 5 oyun)
- [ ] `questions` tablosunu kontrol et (demo setler için 50 soru olmalı)

#### 2.2 RLS Policy Kontrolü
- [ ] `user_game_set_questions` tablosu için INSERT policy eklendi mi? (DATABASE_SCHEMA_ANALYSIS.md'ye göre eksik)
- [ ] `user_login_streaks` tablosu için overly permissive policy kaldırıldı mı?
- [ ] Tüm tablolar için SELECT/INSERT policy'leri test edildi mi?

---

### 3. 🟢 DÜŞÜK ÖNCELİK - Test ve İyileştirmeler

#### 3.1 Akış Testi
- [ ] Ana sayfa → Oyun kartı tıkla → Difficulty seçimi görünüyor mu?
- [ ] Difficulty seç → Set listesi görünüyor mu? (Database'den filtrelenmiş)
- [ ] Set seç → Oyun başlıyor mu? (setId parametresi ile)
- [ ] Oyun bitince skor kaydediliyor mu?

#### 3.2 UI/UX İyileştirmeleri
- [ ] Set kartlarında tamamlanan setler için ✓ işareti görünüyor mu?
- [ ] Geri butonu doğru sayfaya yönlendiriyor mu?
- [ ] Loading state'ler düzgün çalışıyor mu?
- [ ] Responsive tasarım mobilde test edildi mi?

#### 3.3 Error Handling
- [ ] Database bağlantı hatası durumunda fallback çalışıyor mu?
- [ ] Set bulunamadığında kullanıcıya mesaj gösteriliyor mu?
- [ ] Authentication hatası durumunda guest mode çalışıyor mu?

---

## 📋 DETAYLI SQL SEED DATA YAPISI

### Game Types (5 kayıt)
```sql
ID | Game Code              | Timer | Base Score
1  | der_die_dash           | 5s    | 20
2  | case_control           | 5s    | 25
3  | word_salad             | 20s   | 30
4  | translation_quest      | 8s    | 22
5  | five_letter_blitz      | 10s   | 25
```

### Word Sets (55 kayıt)
```
Der Die Dash:      Set ID 1-11   (1 demo + 10 normal)
Case Control:      Set ID 101-111 (1 demo + 10 normal)
Word Salad:        Set ID 201-211 (1 demo + 10 normal)
Translation Quest: Set ID 301-311 (1 demo + 10 normal)
Five Letter Blitz: Set ID 401-411 (1 demo + 10 normal)
```

### Questions (550 kayıt - demo setler için 50, normal setler için 500)
```
Der Die Dash:      Question ID 1-110
Case Control:      Question ID 1001-1110
Word Salad:        Question ID 2001-2110
Translation Quest: Question ID 3001-3110
Five Letter Blitz: Question ID 4001-4110
```

---

## 🎯 AKIŞ DİYAGRAMI

```
Ana Sayfa (index.html)
    ↓
[Oyun Kartı Tıkla]
    ↓
Difficulty Seçim Sayfası ({game}-difficulty.html)
    ↓
[Zorluk Seviyesi Seç (1-5)]
    ↓
Set Seçim Sayfası ({game}-sets.html?level=X)
    ↓
[Database'den Filtrelenmiş Setler Göster]
    ↓
[Set Kartı Tıkla]
    ↓
Oyun Sayfası ({game}.html?setId=Y)
    ↓
[10 Soru Oyna]
    ↓
[Skor Kaydet]
```

---

## 📝 NOTLAR

1. **Database Schema**: `md/DATABASE_SCHEMA_ANALYSIS.md` dosyasını inceleyin
2. **Question Formats**: Her oyun için farklı JSONB formatı kullanılıyor
3. **Set Numbering**: Demo setler `set_number = 0`, normal setler `set_number = 1-10`
4. **Difficulty Levels**: 1 (Kolay) → 5 (Çok Zor)
5. **Questions Per Set**: Her set tam olarak 10 soru içermeli

---

## 🚀 HIZLI BAŞLANGIÇ

1. **SQL Seed Data Hazırla**:
   ```bash
   # supabase/seed_data.sql dosyasını aç
   # Her set için 10 soru ekle
   # Formatları DATABASE_SCHEMA_ANALYSIS.md'den kontrol et
   ```

2. **Supabase'e Yükle**:
   ```sql
   -- Supabase SQL Editor'de çalıştır
   \i supabase/seed_data.sql
   ```

3. **Test Et**:
   - Ana sayfadan bir oyun seç
   - Difficulty seç
   - Set listesini kontrol et
   - Bir set oyna

---

**Son Güncelleme**: 2026-01-13  
**Hazırlayan**: AI Assistant
