# ðŸŽ–ï¸ Badge Sistemi & Admin Panel - Der Die Das Space

## ðŸ“‹ Ä°Ã‡Ä°NDEKÄ°LER

1. [Badge Sistemi Genel BakÄ±ÅŸ](#badge-sistemi)
2. [Badge Tipleri ve Kriterleri](#badge-tipleri)
3. [Parametrik Badge YapÄ±sÄ±](#parametrik-yapÄ±)
4. [Badge Tetikleyicileri](#badge-tetikleyicileri)
5. [Admin Panel](#admin-panel)
6. [Database YapÄ±sÄ±](#database-yapÄ±sÄ±)
7. [API Endpoints](#api-endpoints)

---

## ðŸŽ–ï¸ BADGE SÄ°STEMÄ°

### Genel Konsept

Badge sistemi kullanÄ±cÄ±larÄ±n platform iÃ§indeki baÅŸarÄ±larÄ±nÄ± Ã¶dÃ¼llendiren, **modÃ¼ler** ve **parametrik** bir yapÄ±dÄ±r. Umut istediÄŸi zaman yeni badge ekleyebilir, kriterleri deÄŸiÅŸtirebilir.

### Badge Ã–zellikleri

- âœ… **Parametrik:** Her badge kendi kriterlerine sahip (JSONB formatÄ±nda)
- âœ… **ModÃ¼ler:** Yeni badge tipi eklemek kolay
- âœ… **Ã‡ok Dilli:** Badge isimleri ve aÃ§Ä±klamalarÄ± 3 dilde (TR/DE/EN)
- âœ… **Otomatik:** Kriterler karÅŸÄ±landÄ±ÄŸÄ±nda otomatik verilir
- âœ… **GÃ¶rsel:** Her badge'in ikonu ve rarity seviyesi var

---

## ðŸ† BADGE TÄ°PLERÄ°

### 1. ðŸ”¥ STREAK BADGES (GiriÅŸ Serileri)

**AmaÃ§:** KullanÄ±cÄ±larÄ± dÃ¼zenli giriÅŸ yapmaya teÅŸvik etmek

| Badge Kodu | Kriter | Rarity | Ä°kon |
|------------|--------|--------|------|
| `streak_3_days` | 3 gÃ¼n Ã¼st Ã¼ste giriÅŸ | Common | ðŸ”¥ |
| `streak_7_days` | 7 gÃ¼n Ã¼st Ã¼ste giriÅŸ | Rare | ðŸ”¥ðŸ”¥ |
| `streak_30_days` | 30 gÃ¼n Ã¼st Ã¼ste giriÅŸ | Epic | ðŸ”¥ðŸ”¥ðŸ”¥ |
| `streak_100_days` | 100 gÃ¼n Ã¼st Ã¼ste giriÅŸ | Legendary | ðŸ”¥ðŸ‘‘ |
| `streak_365_days` | 365 gÃ¼n Ã¼st Ã¼ste giriÅŸ | Legendary | ðŸ† |

**NasÄ±l Ã‡alÄ±ÅŸÄ±r:**
- Her login'de `user_login_streaks` tablosu gÃ¼ncellenir
- 24 saat geÃ§meden giriÅŸ yapÄ±lmazsa streak sÄ±fÄ±rlanÄ±r
- `current_streak` ve `longest_streak` takip edilir

**Criteria JSON:**
```json
{
  "type": "streak",
  "days": 7
}
```

---

### 2. ðŸŽ¯ ACHIEVEMENT BADGES (BaÅŸarÄ±lar)

**AmaÃ§:** Oyun iÃ§i milestone'larÄ± Ã¶dÃ¼llendirmek

| Badge Kodu | Kriter | Rarity | Ä°kon |
|------------|--------|--------|------|
| `first_game` | Ä°lk oyunu tamamladÄ± | Common | ðŸŽ® |
| `sets_completed_10` | 10 set tamamladÄ± | Common | â­ |
| `sets_completed_50` | 50 set tamamladÄ± | Rare | â­â­ |
| `sets_completed_100` | 100 set tamamladÄ± | Epic | â­â­â­ |
| `perfect_game` | 10/10 doÄŸru cevap | Rare | ðŸ’¯ |
| `speed_champion` | 10 soruda <2 saniye | Epic | âš¡ |
| `combo_master` | 5x combo yakaladÄ± | Rare | ðŸ”¥ðŸ’¥ |
| `all_level1_complete` | TÃ¼m Level 1 setleri tamamladÄ± | Rare | ðŸŽ–ï¸ |
| `all_level5_complete` | TÃ¼m Level 5 setleri tamamladÄ± | Legendary | ðŸ‘‘ |

**Criteria JSON Ã–rnekleri:**
```json
// 10 set tamamlama
{
  "type": "games_completed",
  "count": 10
}

// MÃ¼kemmel oyun
{
  "type": "perfect_score",
  "correct_answers": 10
}

// HÄ±z ÅŸampiyonu
{
  "type": "speed_average",
  "max_seconds": 2
}

// Combo ustasÄ±
{
  "type": "max_combo",
  "min_combo": 5
}
```

---

### 3. ðŸ… RANK BADGES (Leaderboard SÄ±ralamasÄ±)

**AmaÃ§:** Rekabeti artÄ±rmak ve top oyuncularÄ± Ã¶dÃ¼llendirmek

| Badge Kodu | Kriter | Rarity | Ä°kon |
|------------|--------|--------|------|
| `rank_top_100` | Ä°lk 100'e girdi | Common | ðŸ¥‰ |
| `rank_top_10` | Ä°lk 10'a girdi | Rare | ðŸ¥ˆ |
| `rank_top_5` | Ä°lk 5'e girdi | Epic | ðŸ¥‡ |
| `rank_top_3_bronze` | 3. oldu | Epic | ðŸ¥‰ |
| `rank_top_3_silver` | 2. oldu | Epic | ðŸ¥ˆ |
| `rank_top_3_gold` | 1. oldu | Legendary | ðŸ¥‡ |
| `champion` | #1 Åžampiyon | Legendary | ðŸ‘‘ |

**NasÄ±l Ã‡alÄ±ÅŸÄ±r:**
- Her skor kaydedildikten sonra leaderboard kontrol edilir
- Global veya oyun-spesifik sÄ±ralamalarda kontrol
- SÄ±ralama deÄŸiÅŸtikÃ§e badge gÃ¼ncellenebilir (opsiyonel)

**Criteria JSON:**
```json
{
  "type": "leaderboard_rank",
  "max_rank": 10,
  "game_type": "artikel_dash" // opsiyonel
}
```

---

### 4. ðŸŽ“ MILESTONE BADGES (Ã–zel BaÅŸarÄ±lar)

**AmaÃ§:** Ã–zel hedeflere ulaÅŸanlarÄ± Ã¶dÃ¼llendirmek

| Badge Kodu | Kriter | Rarity | Ä°kon |
|------------|--------|--------|------|
| `versatile_player` | Her oyun tipinde 1+ set | Rare | ðŸŽ¯ |
| `difficulty_hunter` | Her zorluk seviyesinde 1+ set | Rare | ðŸŽ–ï¸ |
| `early_adopter` | Ä°lk 100 kullanÄ±cÄ±dan | Legendary | ðŸŒŸ |
| `beta_tester` | Beta dÃ¶neminde katÄ±ldÄ± | Epic | ðŸ§ª |

**Criteria JSON:**
```json
// Ã‡ok yÃ¶nlÃ¼ oyuncu
{
  "type": "game_types_played",
  "min_types": 3
}

// Zorluk avcÄ±sÄ±
{
  "type": "difficulty_levels_played",
  "min_levels": 5
}
```

---

## âš™ï¸ PARAMETRÄ°K BADGE YAPISI

### Neden Parametrik?

Umut yeni badge eklerken **kod yazmaya gerek yok**! Admin panelden formda kriterlerini girer, sistem otomatik kontrol eder.

### Badge Criteria ÅžablonlarÄ±

Her badge tipi iÃ§in esnek JSON yapÄ±sÄ±:

#### Streak Badge
```json
{
  "type": "streak",
  "days": 30,
  "consecutive": true
}
```

#### Games Completed Badge
```json
{
  "type": "games_completed",
  "count": 50,
  "game_type": "artikel_dash" // opsiyonel
}
```

#### Perfect Score Badge
```json
{
  "type": "perfect_score",
  "correct_answers": 10,
  "difficulty_level": 5 // opsiyonel
}
```

#### Leaderboard Rank Badge
```json
{
  "type": "leaderboard_rank",
  "max_rank": 10,
  "game_type": "artikel_dash", // opsiyonel
  "scope": "global" // veya "monthly"
}
```

#### Speed Badge
```json
{
  "type": "speed_average",
  "max_seconds": 2,
  "min_questions": 10
}
```

#### Combo Badge
```json
{
  "type": "max_combo",
  "min_combo": 5
}
```

### Yeni Badge Tipi NasÄ±l Eklenir?

1. **Admin panelde yeni badge oluÅŸtur**
2. **Criteria JSON'Ä± tanÄ±mla**
3. **Backend'e yeni kriter checker ekle** (tek sefer kod)
4. **Otomatik Ã§alÄ±ÅŸÄ±r!**

Ã–rneÄŸin "Sabah KuÅŸu" badge'i eklemek:
```json
{
  "type": "early_bird",
  "login_time_before": "08:00",
  "consecutive_days": 7
}
```

Backend'de `checkEarlyBirdBadge()` fonksiyonu yazÄ±lÄ±r, sonra her login'de otomatik kontrol edilir.

---

## ðŸŽ¯ BADGE TETÄ°KLEYÄ°CÄ°LERÄ°

### Ne Zaman Badge Kontrol Edilir?

Badge kontrolÃ¼ **event-driven** yapÄ±da Ã§alÄ±ÅŸÄ±r:

| Event | Tetiklenen Kontrol |
|-------|-------------------|
| ðŸ” **Login** | Streak badge'leri |
| âœ… **Set Tamamlama** | Achievement, milestone badge'leri |
| ðŸ“Š **Skor Kaydetme** | Rank badge'leri |
| ðŸŽ® **MÃ¼kemmel Oyun** | Perfect score badge |
| âš¡ **HÄ±zlÄ± Oyun** | Speed badge |
| ðŸ”¥ **5x Combo** | Combo badge |

### Badge Award Flow

```
1. Event gerÃ§ekleÅŸir (Ã¶rn: Set tamamlandÄ±)
   â†“
2. checkAndAwardBadges(userId) Ã§aÄŸrÄ±lÄ±r
   â†“
3. Ä°lgili badge kriterleri kontrol edilir
   â†“
4. Kriter karÅŸÄ±landÄ±ysa:
   - Badge verilir (user_badges tablosuna kayÄ±t)
   - KullanÄ±cÄ±ya notification gÃ¶sterilir
   - Badge kazanma animasyonu oynatÄ±lÄ±r
   â†“
5. Multiple badge kazanÄ±ldÄ±ysa sÄ±rayla gÃ¶sterilir
```

---

## ðŸ–¥ï¸ ADMIN PANEL

### Genel BakÄ±ÅŸ

Admin panel Umut'un platformu yÃ¶netebileceÄŸi, **database'e girmeden** iÅŸlem yapabileceÄŸi arayÃ¼zdÃ¼r.

### Ana Ã–zellikler

#### 1ï¸âƒ£ Dashboard
- ðŸ“Š AnlÄ±k istatistikler
- ðŸ‘¥ KullanÄ±cÄ± sayÄ±sÄ±
- ðŸŽ® Toplam oynanma sayÄ±sÄ±
- ðŸŽ–ï¸ En Ã§ok kazanÄ±lan badge'ler
- ðŸ“ˆ Grafikler

#### 2ï¸âƒ£ Set YÃ¶netimi

**Liste GÃ¶rÃ¼nÃ¼mÃ¼:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Set YÃ¶netimi                        [+ Yeni Set Ekle]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Oyun Tipi    â”‚ Set # â”‚ Zorluk â”‚ Sorular â”‚ Demo â”‚ Actionsâ”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Artikel Dash â”‚   1   â”‚ Kolay  â”‚  10/10  â”‚  âœ“   â”‚ âœï¸ ðŸ—‘ï¸  â”‚
â”‚ Artikel Dash â”‚   2   â”‚ Kolay  â”‚  10/10  â”‚  âœ—   â”‚ âœï¸ ðŸ—‘ï¸  â”‚
â”‚ Word Salad   â”‚   1   â”‚ Kolay  â”‚  10/10  â”‚  âœ“   â”‚ âœï¸ ðŸ—‘ï¸  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Yeni Set Ekleme Formu:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Yeni Set Ekle                        â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Oyun Tipi: [Artikel Dash â–¼]         â”‚
â”‚ Set NumarasÄ±: [26]                   â”‚
â”‚ Zorluk Seviyesi: [â— â— â— â—‹ â—‹]        â”‚
â”‚ Demo Set mi? [ ] Evet                â”‚
â”‚                                      â”‚
â”‚ â”€â”€â”€ Soru Ekleme YÃ¶ntemi â”€â”€â”€         â”‚
â”‚ ( ) Manuel GiriÅŸ                     â”‚
â”‚ (â—) CSV Upload                       â”‚
â”‚                                      â”‚
â”‚ [CSV DosyasÄ± SeÃ§] [ðŸ“ Ã–nizle]       â”‚
â”‚                                      â”‚
â”‚ [Ä°ptal]  [Kaydet]                    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**CSV Format:**
```csv
word_german,correct_article,order_in_set
Tisch,der,1
TÃ¼r,die,2
Auto,das,3
```

#### 3ï¸âƒ£ Badge YÃ¶netimi

**Liste GÃ¶rÃ¼nÃ¼mÃ¼:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Badge YÃ¶netimi                     [+ Yeni Badge Ekle]   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Ä°kon â”‚ Badge AdÄ±     â”‚ Tip    â”‚ Rarity    â”‚ Aktifâ”‚ Edit â”‚
â”œâ”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”¤
â”‚ ðŸ”¥   â”‚ 7 Day Streak  â”‚ Streak â”‚ Rare      â”‚  âœ“   â”‚ âœï¸ ðŸ—‘ï¸â”‚
â”‚ â­   â”‚ 10 Sets Done  â”‚ Achiev â”‚ Common    â”‚  âœ“   â”‚ âœï¸ ðŸ—‘ï¸â”‚
â”‚ ðŸ¥‡   â”‚ Champion      â”‚ Rank   â”‚ Legendary â”‚  âœ“   â”‚ âœï¸ ðŸ—‘ï¸â”‚
â””â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”˜
```

**Yeni Badge Ekleme Formu:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Yeni Badge Ekle                               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Badge Kodu: [streak_14_days]                  â”‚
â”‚ Badge Tipi: [Streak â–¼]                        â”‚
â”‚                                               â”‚
â”‚ â”€â”€â”€ Ä°simler â”€â”€â”€                               â”‚
â”‚ TÃ¼rkÃ§e: [14 GÃ¼nlÃ¼k Seri]                      â”‚
â”‚ Ä°ngilizce: [14 Day Streak]                    â”‚
â”‚ Almanca: [14 Tage Serie]                      â”‚
â”‚                                               â”‚
â”‚ â”€â”€â”€ AÃ§Ä±klamalar â”€â”€â”€                           â”‚
â”‚ TÃ¼rkÃ§e: [2 hafta boyunca her gÃ¼n girdin!]    â”‚
â”‚ Ä°ngilizce: [Logged in every day for 2 weeks!]â”‚
â”‚ Almanca: [2 Wochen lang jeden Tag eingeloggt]â”‚
â”‚                                               â”‚
â”‚ â”€â”€â”€ GÃ¶rsel â”€â”€â”€                                â”‚
â”‚ Ä°kon: [ðŸ”¥] veya [ðŸ“ Upload]                   â”‚
â”‚ Rarity: [â—â—â—â—‹ Epic]                           â”‚
â”‚                                               â”‚
â”‚ â”€â”€â”€ Kriterler (Parametrik) â”€â”€â”€                â”‚
â”‚ Badge Tipi: Streak                            â”‚
â”‚ GÃ¼n SayÄ±sÄ±: [14]                              â”‚
â”‚ ArdÄ±ÅŸÄ±k mÄ±? [âœ“] Evet                          â”‚
â”‚                                               â”‚
â”‚ Aktif mi? [âœ“] Evet                            â”‚
â”‚                                               â”‚
â”‚ [Ä°ptal]  [Kaydet ve Test Et]  [Kaydet]       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Badge Kriter Builder:**

Admin panelde her badge tipi iÃ§in custom form:

```javascript
// Streak badge iÃ§in
if (badgeType === 'streak') {
  showFields([
    'days (number)',
    'consecutive (boolean)'
  ]);
}

// Achievement badge iÃ§in
if (badgeType === 'games_completed') {
  showFields([
    'count (number)',
    'game_type (optional dropdown)'
  ]);
}

// Rank badge iÃ§in
if (badgeType === 'leaderboard_rank') {
  showFields([
    'max_rank (number)',
    'game_type (optional)',
    'scope (global/monthly)'
  ]);
}
```

#### 4ï¸âƒ£ KullanÄ±cÄ± YÃ¶netimi

**Liste GÃ¶rÃ¼nÃ¼mÃ¼:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ KullanÄ±cÄ± YÃ¶netimi                     [ðŸ” Ara]         â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ ID  â”‚ Email          â”‚ Sets  â”‚ Badge â”‚ Streak â”‚ Actions â”‚
â”œâ”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ 001 â”‚ umut@test.com  â”‚  45   â”‚  12   â”‚  15d   â”‚ ðŸ‘ï¸ âœï¸   â”‚
â”‚ 002 â”‚ elif@test.com  â”‚  23   â”‚   7   â”‚   3d   â”‚ ðŸ‘ï¸ âœï¸   â”‚
â””â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**KullanÄ±cÄ± Detay GÃ¶rÃ¼nÃ¼mÃ¼:**
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ KullanÄ±cÄ±: umut@test.com               â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ Ãœyelik: 15 Ocak 2026                   â”‚
â”‚ Son GiriÅŸ: 2 saat Ã¶nce                 â”‚
â”‚ Current Streak: 15 gÃ¼n                 â”‚
â”‚ Longest Streak: 30 gÃ¼n                 â”‚
â”‚                                        â”‚
â”‚ â”€â”€â”€ Ä°statistikler â”€â”€â”€                  â”‚
â”‚ Toplam Oyun: 45                        â”‚
â”‚ Toplam Skor: 12,450                    â”‚
â”‚ Ortalama DoÄŸruluk: %87                 â”‚
â”‚                                        â”‚
â”‚ â”€â”€â”€ Badge'ler (12) â”€â”€â”€                 â”‚
â”‚ ðŸ”¥ 7 Day Streak                        â”‚
â”‚ â­ 10 Sets Completed                   â”‚
â”‚ ðŸ¥‡ Top 10                              â”‚
â”‚ [TÃ¼mÃ¼nÃ¼ GÃ¶r]                           â”‚
â”‚                                        â”‚
â”‚ â”€â”€â”€ Admin Ä°ÅŸlemler â”€â”€â”€                 â”‚
â”‚ [Badge Ver]  [Badge KaldÄ±r]           â”‚
â”‚ [SkorlarÄ± SÄ±fÄ±rla]  [HesabÄ± AskÄ±ya Al]â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### 5ï¸âƒ£ Analytics Dashboard

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Analytics Dashboard                 [ðŸ“… Son 30 GÃ¼n] â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                     â”‚
â”‚  ðŸ‘¥ Aktif KullanÄ±cÄ±lar               ðŸ“ˆ +15%       â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                 â”‚
â”‚  â”‚         [Ã‡izgi Grafik]        â”‚                 â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                 â”‚
â”‚                                                     â”‚
â”‚  ðŸŽ® GÃ¼nlÃ¼k Oynanma                   ðŸ“Š 234 oyun   â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                 â”‚
â”‚  â”‚         [Bar Chart]           â”‚                 â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                 â”‚
â”‚                                                     â”‚
â”‚  ðŸŽ–ï¸ En Ã‡ok KazanÄ±lan Badge'ler                     â”‚
â”‚  1. 7 Day Streak (45 kullanÄ±cÄ±)                    â”‚
â”‚  2. 10 Sets Done (38 kullanÄ±cÄ±)                    â”‚
â”‚  3. First Game (234 kullanÄ±cÄ±)                     â”‚
â”‚                                                     â”‚
â”‚  ðŸ“Š Zorluk Seviyesi DaÄŸÄ±lÄ±mÄ±                        â”‚
â”‚  [Pie Chart: Level 1-5 oranlarÄ±]                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ðŸ—„ï¸ DATABASE YAPISI

### Yeni Tablolar

#### `badges` Tablosu
```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_code VARCHAR(100) UNIQUE NOT NULL,
  badge_type VARCHAR(50) NOT NULL, -- 'streak', 'achievement', 'rank', 'milestone'
  badge_name_tr VARCHAR(200),
  badge_name_en VARCHAR(200),
  badge_name_de VARCHAR(200),
  badge_description_tr TEXT,
  badge_description_en TEXT,
  badge_description_de TEXT,
  icon_url VARCHAR(500),
  rarity VARCHAR(50) NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_badges` Tablosu
```sql
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, badge_id)
);
```

#### `user_login_streaks` Tablosu
```sql
CREATE TABLE user_login_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, login_date)
);
```

#### `admins` Tablosu
```sql
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

---

## ðŸ”Œ API ENDPOINTS

### Badge API

```
GET    /api/badges                    - TÃ¼m badge'leri listele
GET    /api/badges/:id                - Badge detaylarÄ±
POST   /api/badges                    - Yeni badge oluÅŸtur (admin)
PUT    /api/badges/:id                - Badge gÃ¼ncelle (admin)
DELETE /api/badges/:id                - Badge sil (admin)

GET    /api/users/:userId/badges      - KullanÄ±cÄ±nÄ±n badge'leri
POST   /api/users/:userId/check-badges - Badge kontrolÃ¼ ve otomatik ver
GET    /api/users/:userId/badge-progress/:badgeId - Badge iÃ§in ilerleme
```

### Admin API

```
POST   /api/admin/login               - Admin giriÅŸi
GET    /api/admin/stats               - Dashboard istatistikleri

GET    /api/admin/sets                - TÃ¼m setleri listele
POST   /api/admin/sets                - Yeni set oluÅŸtur
PUT    /api/admin/sets/:id            - Set gÃ¼ncelle
DELETE /api/admin/sets/:id            - Set sil
POST   /api/admin/sets/bulk-import    - CSV ile toplu import

GET    /api/admin/users               - TÃ¼m kullanÄ±cÄ±larÄ± listele
GET    /api/admin/users/:id           - KullanÄ±cÄ± detaylarÄ±
POST   /api/admin/users/:id/award-badge - Manuel badge ver
DELETE /api/admin/users/:id/badges/:badgeId - Badge kaldÄ±r
```

---

## ðŸŽ¯ Ã–RNEK KULLANIM SENARYOLARI

### Senaryo 1: Yeni Badge Ekleme

**Umut "30 GÃ¼nlÃ¼k Seri" badge'i eklemek istiyor:**

1. Admin panele giriÅŸ yap
2. Badge YÃ¶netimi â†’ Yeni Badge Ekle
3. Formu doldur:
   - Kod: `streak_30_days`
   - Tip: Streak
   - Ä°simler (3 dil)
   - Ä°kon: ðŸ”¥ðŸ”¥ðŸ”¥
   - Rarity: Epic
   - Kriter: `{"type": "streak", "days": 30}`
4. Kaydet
5. **Sistem otomatik olarak:**
   - Badge'i database'e ekler
   - Mevcut kullanÄ±cÄ±larÄ± kontrol eder
   - Kriteri karÅŸÄ±layanlarageÃ§miÅŸe dÃ¶nÃ¼k badge verir

### Senaryo 2: Yeni Set YÃ¼kleme (CSV ile)

**Umut Level 2 iÃ§in 5 yeni set eklemek istiyor:**

1. Excel'de 50 kelime hazÄ±rla (5 set x 10 kelime)
2. CSV formatÄ±nda kaydet
3. Admin Panel â†’ Set YÃ¶netimi â†’ Yeni Set
4. CSV yÃ¼kle
5. Ã–nizleme: 50 soru, 5 set gÃ¶rÃ¼nÃ¼yor
6. Kaydet
7. **AnÄ±nda oynanabilir hale gelir!**

### Senaryo 3: KullanÄ±cÄ± Badge'ini Kontrol Etme

**Elif bir set tamamladÄ±, badge kazanacak mÄ±?**

Backend Flow:
```javascript
// Set tamamlandÄ±ÄŸÄ±nda
async function onSetCompleted(userId, setId) {
  // 1. Skoru kaydet
  await saveScore(userId, setId, scoreData);
  
  // 2. Badge kontrolÃ¼
  const newBadges = await checkAndAwardBadges(userId);
  
  // 3. Yeni badge varsa gÃ¶ster
  if (newBadges.length > 0) {
    return {
      success: true,
      newBadges: newBadges // UI'da gÃ¶sterilecek
    };
  }
}

// Badge kontrol fonksiyonu
async function checkAndAwardBadges(userId) {
  const newBadges = [];
  
  // Streak badge kontrol
  const streakBadge = await checkStreakBadges(userId);
  if (streakBadge) newBadges.push(streakBadge);
  
  // Achievement badge kontrol
  const achievementBadge = await checkAchievementBadges(userId);
  if (achievementBadge) newBadges.push(achievementBadge);
  
  // Rank badge kontrol
  const rankBadge = await checkRankBadges(userId);
  if (rankBadge) newBadges.push(rankBadge);
  
  return newBadges;
}
```

---

## âœ… IMPLEMENTATION CHECKLIST

### Phase 1: Badge Sistemi Temel (v1.1)
- [ ] Database tablolarÄ± oluÅŸtur (badges, user_badges, user_login_streaks)
- [ ] Badge CRUD API'leri
- [ ] Login streak tracking
- [ ] Ä°lk 5 badge ekle (3 day streak, first game, 10 sets, top 10, perfect game)
- [ ] Badge kazanma UI (popup/modal)
- [ ] Badge koleksiyonu sayfasÄ±

### Phase 2: Admin Panel Temel (v1.2)
- [ ] Admin authentication
- [ ] Dashboard (temel istatistikler)
- [ ] Set yÃ¶netimi (liste, ekle, dÃ¼zenle, sil)
- [ ] Badge yÃ¶netimi (liste, ekle, dÃ¼zenle, sil)
- [ ] CSV upload for sets

### Phase 3: GeniÅŸletme (v1.3)
- [ ] Daha fazla badge tipi
- [ ] KullanÄ±cÄ± yÃ¶netimi (admin panel)
- [ ] Analytics dashboard
- [ ] Badge progress tracking
- [ ] Badge test modu (admin)

---

**TARÄ°H:** Ocak 2026
**VERSÄ°YON:** v1.0+ (Badge & Admin Ã¶zellikleri)
**AMAÃ‡:** ModÃ¼ler, parametrik badge sistemi ve kod yazmadan yÃ¶netim
