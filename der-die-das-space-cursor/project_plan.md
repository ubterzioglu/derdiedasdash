# Der Die Das Space - Proje PlanÄ±

## ðŸŽ¯ PROJE AMACI
**Almanca kelime artikel Ã¶ÄŸrenme ve yarÄ±ÅŸma platformu!**

KullanÄ±cÄ±lar Almanca kelimelerin doÄŸru artikellerini (der/die/das) tahmin ederek:
- âœ… Artikel bilgilerini pekiÅŸtirir
- ðŸŽ® Oyun yoluyla eÄŸlenerek Ã¶ÄŸrenir
- ðŸ† DiÄŸer kullanÄ±cÄ±larla yarÄ±ÅŸÄ±r
- ðŸ“Š Ä°lerlemelerini takip eder

**Ã–NEMLÄ°:** Kelimeler HEP ALMANCA gÃ¶sterilir! Sadece UI (arayÃ¼z) Ã§ok dillidir (TR/DE/EN).

---

## ðŸŽ® Ã‡OK OYUNLU PLATFORM MÄ°MARÄ°SÄ°

**Der Die Das Space** tek bir oyun deÄŸil, birden fazla Almanca Ã¶ÄŸrenme oyununu barÄ±ndÄ±ran bir **platform** olacak!

### Planlanan Oyunlar:

#### ðŸŽ¯ Oyun 1: Artikel Dash (v1.0 - ÅžÄ°MDÄ°)
- **AmaÃ§:** Almanca kelimelerin doÄŸru artikelini bul (der/die/das)
- **Mekanik:** Kelime gÃ¶ster â†’ 3 seÃ§enek â†’ 5 saniye
- **Ã–rnek:** "Tisch" â†’ [der] [die] [das]

#### ðŸ”¤ Oyun 2: Word Salad (v2.0 - GELECEK)
- **AmaÃ§:** KarÄ±ÅŸÄ±k harfleri doÄŸru sÄ±raya koy ve kelimeyi bul
- **Mekanik:** KarÄ±ÅŸÄ±k harfler â†’ sÄ±rayla seÃ§ â†’ doÄŸru kelimeyi oluÅŸtur â†’ 15 saniye
- **Ã–rnek:** "CSIHT" â†’ KullanÄ±cÄ±: T-I-S-C-H â†’ "Tisch" âœ…
- **UI:** Harfler altta, seÃ§tikÃ§e Ã¼st kutuya yerleÅŸir, "GO" butonu, yanlÄ±ÅŸsa reset

#### ðŸ“ Oyun 3: Preposition Master (v3.0 - GELECEK)
- **AmaÃ§:** Preposition'lu cÃ¼mlelerde doÄŸru artikeli bul
- **Mekanik:** Preposition + kelime â†’ doÄŸru artikel formu â†’ 5 saniye
- **Ã–rnek:** "mit ... Tisch" â†’ [dem] [der] [den] â†’ DoÄŸru: "dem"

### Ortak Ã–zellikler (TÃ¼m Oyunlar):
- âœ… 10 soru = 1 set
- âœ… 5 zorluk seviyesi
- âœ… AynÄ± puanlama sistemi (base + hÄ±z bonusu + combo)
- âœ… Global + set-bazlÄ± leaderboard
- âœ… Her set 1 kere oynanabilir
- âœ… Demo mode
- âœ… 3 dil UI desteÄŸi

### ModÃ¼ler Mimari Gereksinimleri:
- **Oyun tipi seÃ§im ekranÄ±** (ana menÃ¼)
- **Oyun baÄŸÄ±msÄ±z core sistem** (auth, scoring, leaderboard)
- **Oyun-spesifik modÃ¼ller** (her oyun kendi mekaniklerini iÃ§erir)
- **Ortak veritabanÄ± yapÄ±sÄ±** (game_type field ile ayrÄ±m)

---

## Proje Ã–zeti
Almanca artikel Ã¶ÄŸrenme oyunu - KullanÄ±cÄ±lar kelimelere doÄŸru artikel (der/die/das) tahmin ederek puan kazanÄ±r.

---

## ðŸ¤– AI AGENT (Cursor/Claude Code) YAPACAKLAR

### 1. Supabase VeritabanÄ± YapÄ±sÄ±

#### 1.1 Tables OluÅŸturma

**NOT:** ModÃ¼ler yapÄ± iÃ§in tÃ¼m tablolar `game_type` field'Ä± iÃ§erecek!

- [ ] **users** tablosu
  - `id` (UUID, primary key)
  - `email` (string)
  - `display_name` (string)
  - `auth_provider` (string: 'google' veya 'supabase')
  - `created_at` (timestamp)
  - `last_login` (timestamp)

- [ ] **game_types** tablosu (YENÄ° - ModÃ¼ler yapÄ± iÃ§in)
  - `id` (int, primary key)
  - `game_code` (string: 'artikel_dash', 'word_salad', 'preposition_master')
  - `game_name_tr` (string)
  - `game_name_en` (string)
  - `game_name_de` (string)
  - `game_description_tr` (text)
  - `game_description_en` (text)
  - `game_description_de` (text)
  - `is_active` (boolean)
  - `release_version` (string: 'v1.0', 'v2.0', 'v3.0')
  - `timer_seconds` (int: 5 veya 15)

- [ ] **word_sets** tablosu
  - `id` (int, primary key)
  - `game_type_id` (foreign key -> game_types) **â† YENÄ°**
  - `set_number` (int)
  - `difficulty_level` (int: 1-5)
  - `is_demo` (boolean)
  - Unique constraint: (game_type_id, set_number)

- [ ] **questions** tablosu
  - `id` (int, primary key)
  - `set_id` (foreign key -> word_sets)
  - `question_data` (JSONB) **â† Esnek veri iÃ§in**
    - Artikel Dash: `{"word": "Tisch", "correct_article": "der"}`
    - Word Salad: `{"scrambled": "CSIHT", "correct_word": "Tisch", "correct_article": "der"}`
    - Preposition Master: `{"preposition": "mit", "word": "Tisch", "correct_form": "dem"}`
  - `order_in_set` (int: 1-10)
  
  **VEYA (Daha basit yaklaÅŸÄ±m):**
  - `word_german` (string) - Almanca kelime
  - `scrambled_word` (string, nullable) - Word Salad iÃ§in
  - `preposition` (string, nullable) - Preposition Master iÃ§in
  - `correct_article` (string) - der/die/das
  - `correct_form` (string, nullable) - dem/den/der gibi formlar
  - `order_in_set` (int: 1-10)

- [ ] **user_scores** tablosu
  - `id` (int, primary key)
  - `user_id` (foreign key -> users)
  - `set_id` (foreign key -> word_sets)
  - `game_type_id` (foreign key -> game_types) **â† YENÄ°**
  - `score` (int)
  - `correct_answers` (int)
  - `wrong_answers` (int)
  - `combo_count` (int) **â† YENÄ°: Max combo**
  - `speed_bonus` (int) **â† YENÄ°: Toplam hÄ±z bonusu**
  - `combo_bonus` (int) **â† YENÄ°: Toplam combo bonusu**
  - `average_response_time` (float)
  - `completed_at` (timestamp)

- [ ] **user_set_progress** tablosu
  - `user_id` (foreign key -> users)
  - `set_id` (foreign key -> word_sets)
  - `is_completed` (boolean)
  - Primary key: (user_id, set_id)

- [ ] **badges** tablosu (YENÄ° - Parametrik Badge Sistemi)
  - `id` (int, primary key)
  - `badge_code` (string, unique) - Ã–rnek: 'streak_3_days', 'first_10_rank'
  - `badge_type` (enum: 'streak', 'achievement', 'rank', 'milestone')
  - `badge_name_tr` (string)
  - `badge_name_en` (string)
  - `badge_name_de` (string)
  - `badge_description_tr` (text)
  - `badge_description_en` (text)
  - `badge_description_de` (text)
  - `icon_url` (string) - Badge ikonu
  - `rarity` (enum: 'common', 'rare', 'epic', 'legendary')
  - `criteria` (JSONB) - Esnek kriter yapÄ±sÄ±:
    ```json
    {
      "type": "streak",
      "days": 3
    }
    // VEYA
    {
      "type": "games_completed",
      "count": 10
    }
    // VEYA
    {
      "type": "leaderboard_rank",
      "max_rank": 10
    }
    ```
  - `is_active` (boolean)
  - `created_at` (timestamp)

- [ ] **user_badges** tablosu (YENÄ° - KullanÄ±cÄ± Badge'leri)
  - `id` (int, primary key)
  - `user_id` (foreign key -> users)
  - `badge_id` (foreign key -> badges)
  - `earned_at` (timestamp)
  - `metadata` (JSONB) - Badge kazanÄ±ldÄ±ÄŸÄ±nda ekstra bilgi:
    ```json
    {
      "rank": 5,
      "date": "2026-01-15",
      "game_type": "artikel_dash"
    }
    ```
  - Unique constraint: (user_id, badge_id)

- [ ] **user_login_streaks** tablosu (YENÄ° - GiriÅŸ Takibi)
  - `id` (int, primary key)
  - `user_id` (foreign key -> users)
  - `login_date` (date)
  - `current_streak` (int) - Åžu anki seri
  - `longest_streak` (int) - En uzun seri
  - `last_updated` (timestamp)
  - Unique constraint: (user_id, login_date)

#### 1.2 SQL Queries/Functions
- [ ] View oluÅŸtur: Global leaderboard iÃ§in
- [ ] View oluÅŸtur: Set-bazlÄ± leaderboard iÃ§in
- [ ] Function: KullanÄ±cÄ±nÄ±n tamamladÄ±ÄŸÄ± setleri getir
- [ ] Function: Demo set datasÄ± getir
- [ ] **Badge Functions (YENÄ°):**
  - [ ] `check_and_award_badges(user_id)` - KullanÄ±cÄ±nÄ±n badge'lerini kontrol et ve otomatik ver
  - [ ] `update_login_streak(user_id)` - GiriÅŸ serisini gÃ¼ncelle
  - [ ] `check_streak_badges(user_id)` - Streak badge'leri kontrol et
  - [ ] `check_achievement_badges(user_id)` - Achievement badge'leri kontrol et
  - [ ] `check_rank_badges(user_id)` - Leaderboard sÄ±ralama badge'leri kontrol et
  - [ ] `get_user_badges(user_id)` - KullanÄ±cÄ±nÄ±n tÃ¼m badge'lerini getir
  - [ ] `get_badge_progress(user_id, badge_id)` - Badge iÃ§in ilerleme yÃ¼zdesi (opsiyonel)

### 2. Authentication Flow

#### 2.1 Login Sistemi
- [ ] Google OAuth entegrasyonu (Supabase auth kullanarak)
- [ ] Supabase Email/Password auth entegrasyonu
- [ ] Email confirmation'Ä± devre dÄ±ÅŸÄ± bÄ±rak (Supabase settings)
- [ ] Login modal/popup tasarÄ±mÄ± (minimal UI)
- [ ] Auto-login token yÃ¶netimi (localStorage)
- [ ] Logout fonksiyonu

#### 2.2 User Session Management
- [ ] Session check fonksiyonu
- [ ] Protected routes (oyun sayfasÄ± iÃ§in)
- [ ] Guest mode (demo oyun iÃ§in)

### 3. Oyun MantÄ±ÄŸÄ± (Core Gameplay)

#### 3.1 Game State Management
- [ ] Game state object yapÄ±sÄ±:
  ```javascript
  {
    currentSet: null,
    currentQuestion: 0,
    score: 0,
    timeRemaining: 5,
    answers: [],
    isDemo: false,
    difficulty: 1
  }
  ```

#### 3.2 Timer Sistemi
- [ ] 5 saniyelik countdown timer
- [ ] Timer gÃ¶rsel indicator
- [ ] Otomatik geÃ§iÅŸ (sÃ¼re bitince)
- [ ] Timer pause/resume (gerekirse)

#### 3.3 Scoring Algorithm
- [ ] Base puan sistemi (zorluk seviyesine gÃ¶re):
  - Level 1: 10 puan/doÄŸru
  - Level 2: 15 puan/doÄŸru
  - Level 3: 20 puan/doÄŸru
  - Level 4: 25 puan/doÄŸru
  - Level 5: 30 puan/doÄŸru
- [ ] HÄ±z bonusu hesaplama:
  - < 2 saniye: +10 puan
  - < 3 saniye: +5 puan
  - < 4 saniye: +2 puan
- [ ] **ðŸ”¥ COMBO SÄ°STEMÄ°:**
  - [ ] Ãœst Ã¼ste doÄŸru cevaplar iÃ§in combo bonusu
  - [ ] Combo baÅŸlangÄ±cÄ±: 3 Ã¼st Ã¼ste doÄŸru cevap
  - [ ] Combo bonusu: Her doÄŸru cevap iÃ§in +5 puan
  - [ ] Combo sÄ±fÄ±rlama: 1 yanlÄ±ÅŸ cevap veya 5 combo sonrasÄ±
  - [ ] Combo gÃ¶stergesi UI'da (Ã¶rnek: "ðŸ”¥ 3x COMBO!")
  - [ ] Combo animasyonu (ateÅŸ efekti veya benzeri)
- [ ] Toplam skor hesaplama fonksiyonu

#### 3.4 Question Flow
- [ ] Soru gÃ¶sterme fonksiyonu
- [ ] Cevap seÃ§imi handler (der/die/das butonlarÄ±)
- [ ] **DoÄŸru/yanlÄ±ÅŸ feedback animasyonlarÄ±:**
  - [ ] **DoÄŸru cevap animasyonu:** 
    - YeÅŸil renk efekti (logo yeÅŸili)
    - Confetti/particle patlama efekti
    - Checkmark icon animasyonu
    - Haptic feedback (mobilde)
    - Pozitif ses efekti (opsiyonel)
  - [ ] **YanlÄ±ÅŸ cevap animasyonu:**
    - KÄ±rmÄ±zÄ± renk efekti (logo kÄ±rmÄ±zÄ±sÄ±)
    - Shake/titreme animasyonu
    - X icon animasyonu
    - DoÄŸru cevabÄ± kÄ±sa sÃ¼re gÃ¶ster
    - Negatif ses efekti (opsiyonel)
- [ ] Sonraki soruya geÃ§iÅŸ (smooth transition)
- [ ] Set tamamlama kontrolÃ¼

### 4. UI Components (Minimal)

#### 4.0 Oyun SeÃ§im EkranÄ± (Ana MenÃ¼) **â† YENÄ°**
- [ ] Platform logosu (Der Die Das Space)
- [ ] "Bir Oyun SeÃ§" / "Choose a Game" baÅŸlÄ±ÄŸÄ±
- [ ] **Oyun KartlarÄ± (Grid layout):**
  - [ ] **Artikel Dash KartÄ±** (v1.0 - aktif)
    - Ä°kon/thumbnail
    - Oyun adÄ±
    - KÄ±sa aÃ§Ä±klama
    - "Oyna" butonu
    - "v1.0" badge
  - [ ] **Word Salad KartÄ±** (v2.0 - yakÄ±nda)
    - Ä°kon/thumbnail
    - Oyun adÄ±
    - KÄ±sa aÃ§Ä±klama
    - "YakÄ±nda" badge
    - Disabled state
  - [ ] **Preposition Master KartÄ±** (v3.0 - yakÄ±nda)
    - Ä°kon/thumbnail
    - Oyun adÄ±
    - KÄ±sa aÃ§Ä±klama
    - "YakÄ±nda" badge
    - Disabled state
- [ ] Global leaderboard butonu (tÃ¼m oyunlar)
- [ ] Profil/ayarlar butonu

#### 4.1 Ana Sayfa (Oyuna Ã–zel)
- [ ] Logo yerleÅŸtirme
- [ ] Dil seÃ§ici (TR/DE/EN flags veya dropdown)
- [ ] **Bilgilendirme KartÄ± (Collapsible):**
  - [ ] "NasÄ±l OynanÄ±r?" / "How to Play?" baÅŸlÄ±ÄŸÄ±
  - [ ] Oyun kurallarÄ± Ã¶zeti
  - [ ] Puanlama sistemi aÃ§Ä±klamasÄ± (base + hÄ±z bonusu)
  - [ ] Zorluk seviyeleri hakkÄ±nda bilgi
  - [ ] AÃ§Ä±lÄ±r/kapanÄ±r animasyon (smooth toggle)
  - [ ] Ä°lk ziyarette otomatik aÃ§Ä±k olabilir
- [ ] Login/Register butonlarÄ±
- [ ] "Demo Oyna" butonu (highlight/parlak)
- [ ] **Set listesi:**
  - [ ] Zorluk seviyelerine gÃ¶re gruplandÄ±rÄ±lmÄ±ÅŸ (Level 1-5)
  - [ ] Her setin Ã¼zerinde zorluk badge'i:
    - Level 1: "Kolay" / "Easy" (yeÅŸil)
    - Level 2: "Orta-Kolay" / "Medium-Easy" (aÃ§Ä±k mavi)
    - Level 3: "Orta" / "Medium" (mavi)
    - Level 4: "Zor" / "Hard" (turuncu)
    - Level 5: "Ã‡ok Zor" / "Very Hard" (kÄ±rmÄ±zÄ±)
  - [ ] Tamamlanan setler Ã¼zerinde "âœ“ TamamlandÄ±" iÅŸareti
  - [ ] Hover efektleri
  - [ ] Grid veya list layout (responsive)

#### 4.3 Oyun EkranÄ± (Artikel Dash)
- [ ] Kelime kartÄ± (bÃ¼yÃ¼k font, merkez)
- [ ] Timer gÃ¶stergesi (circular veya bar)
- [ ] 3 artikel butonu (der/die/das) - logo renklerinde
- [ ] **Combo gÃ¶stergesi** **â† YENÄ°**
  - [ ] Combo counter (Ã¶rnek: "ðŸ”¥ 3x COMBO!")
  - [ ] AteÅŸ/parlama animasyonu
  - [ ] Combo kÄ±rÄ±lÄ±nca fade-out
- [ ] Skor gÃ¶stergesi (Ã¼st kÃ¶ÅŸe)
  - [ ] Base skor
  - [ ] +HÄ±z bonusu (animasyonlu)
  - [ ] +Combo bonusu (animasyonlu)
- [ ] Progress indicator (3/10 gibi)
- [ ] Ã‡Ä±kÄ±ÅŸ/Geri butonu

#### 4.4 Scoreboard
- [ ] **Global leaderboard tablosu**
  - [ ] Oyun tipi filtresi (Artikel Dash / Word Salad / Preposition Master)
  - [ ] Zorluk seviyesi filtresi (Level 1-5)
  - [ ] TÃ¼m skorlar veya sadece en iyi skorlar toggle
- [ ] **Set-bazlÄ± leaderboard tablosu**
  - [ ] Oyuna Ã¶zel setler iÃ§in
- [ ] KullanÄ±cÄ±nÄ±n kendi skoru highlight
- [ ] Skor detaylarÄ± (combo bonusu, hÄ±z bonusu gÃ¶sterimi)

#### 4.4 Results Screen (Set Ã–zeti)
- [ ] **Set tamamlama ekranÄ± (modal veya full page):**
  - [ ] Kutlama animasyonu (eÄŸer yÃ¼ksek skor varsa)
  - [ ] Set baÅŸlÄ±ÄŸÄ± ve zorluk seviyesi badge'i
- [ ] **DetaylÄ± Ä°statistikler:**
  - [ ] Toplam skor gÃ¶sterimi (bÃ¼yÃ¼k, vurgulu)
  - [ ] DoÄŸru/yanlÄ±ÅŸ sayÄ±sÄ± (visual chart veya bar)
  - [ ] Ortalama cevaplama sÃ¼resi
  - [ ] En hÄ±zlÄ± cevap sÃ¼resi
  - [ ] **AlÄ±nan hÄ±z bonuslarÄ± toplamÄ±**
  - [ ] **Maksimum combo sayÄ±sÄ±** **â† YENÄ°**
  - [ ] **AlÄ±nan combo bonuslarÄ± toplamÄ±** **â† YENÄ°**
- [ ] **Soru BazlÄ± Ã–zet:**
  - [ ] Her sorunun Ã¶zeti (accordion veya scrollable list):
    - Kelime
    - KullanÄ±cÄ±nÄ±n cevabÄ±
    - DoÄŸru cevap
    - GeÃ§en sÃ¼re
    - KazanÄ±lan puan
  - [ ] YanlÄ±ÅŸ cevaplanan kelimeler highlight
- [ ] **Performans DeÄŸerlendirmesi:**
  - [ ] BaÅŸarÄ± yÃ¼zdesi (0-100%)
  - [ ] Performance badge (MÃ¼kemmel/Ä°yi/Orta/GeliÅŸtirilmeli)
  - [ ] KÄ±sa motivasyon mesajÄ±
- [ ] **Leaderboard Konumu:**
  - [ ] "Global sÄ±ralamada #X'siniz!" mesajÄ±
  - [ ] "Bu sette #Y'siniz!" mesajÄ±
- [ ] **Action ButonlarÄ±:**
  - [ ] "Scoreboard'a Bak" butonu
  - [ ] "Ana MenÃ¼ye DÃ¶n" butonu
  - [ ] "SonuÃ§larÄ± PaylaÅŸ" butonu (sosyal medya - opsiyonel)
- [ ] Smooth animations ve transitions
- [ ] **ðŸŽ–ï¸ Yeni Badge KazanÄ±ldÄ±ysa:**
  - [ ] Badge kazanma modal/popup gÃ¶ster
  - [ ] Badge animasyonu (parlama, confetti)
  - [ ] Badge detaylarÄ± (isim, aÃ§Ä±klama, rarity)
  - [ ] "Badge Koleksiyonuma Git" butonu

#### 4.6 Badge Sistemi UI **â† YENÄ°**
- [ ] **Badge Koleksiyonu SayfasÄ±:**
  - [ ] TÃ¼m badge'leri grid layout'ta gÃ¶ster
  - [ ] KazanÄ±lan badge'ler renkli, kazanÄ±lmayanlar gri (locked)
  - [ ] Her badge Ã¼zerine hover: Detaylar tooltip
  - [ ] Badge kategorileri (Streak, Achievement, Rank, Milestone)
  - [ ] Progress bar (kaÃ§/toplam badge)
  - [ ] Filtre seÃ§enekleri (category, rarity)
  
- [ ] **Badge Display (KullanÄ±cÄ± Profili/Leaderboard):**
  - [ ] KullanÄ±cÄ± adÄ±nÄ±n yanÄ±nda en iyi 3 badge gÃ¶ster
  - [ ] Hover: TÃ¼m badge'leri gÃ¶ster
  - [ ] Badge rarity renkleri:
    - Common: Gri/Beyaz
    - Rare: Mavi
    - Epic: Mor
    - Legendary: AltÄ±n

- [ ] **Badge Notifications:**
  - [ ] Yeni badge kazanÄ±ldÄ±ÄŸÄ±nda toast notification
  - [ ] Badge sayÄ±sÄ± profil iconunda (badge counter)
  - [ ] "Yeni Badge!" animasyonu

#### 4.7 Admin Panel UI **â† YENÄ°**
- [ ] **Login EkranÄ±:**
  - [ ] Admin email/password login (ayrÄ± admin tablosu)
  - [ ] Supabase RLS ile gÃ¼venlik
  
- [ ] **Dashboard (Ana Sayfa):**
  - [ ] Toplam kullanÄ±cÄ± sayÄ±sÄ±
  - [ ] Toplam set sayÄ±sÄ± (oyun tipine gÃ¶re)
  - [ ] Aktif oyun sayÄ±sÄ±
  - [ ] Son 7 gÃ¼nde kaydolan kullanÄ±cÄ±
  - [ ] Son 7 gÃ¼nde tamamlanan oyun sayÄ±sÄ±
  - [ ] Quick actions (Yeni Set Ekle, Yeni Badge Ekle)
  
- [ ] **Set YÃ¶netimi:**
  - [ ] **TÃ¼m setleri listele** (tablo formatÄ±)
    - Oyun tipi, set numarasÄ±, zorluk, demo/live status
    - Edit/Delete butonlarÄ±
    - "Yeni Set Ekle" butonu
  - [ ] **Yeni Set Ekleme Formu:**
    - Oyun tipi seÃ§ (dropdown)
    - Set numarasÄ± (otomatik veya manuel)
    - Zorluk seviyesi (1-5)
    - Demo set mi? (checkbox)
    - CSV/JSON upload (toplu kelime yÃ¼kleme)
    - Manuel soru ekleme (10 soru iÃ§in form)
  - [ ] **Set DÃ¼zenleme:**
    - Mevcut sorularÄ± gÃ¶rÃ¼ntÃ¼le ve dÃ¼zenle
    - Yeni soru ekle
    - Soru sÄ±ralamasÄ±nÄ± deÄŸiÅŸtir (drag-drop)
    - Set'i sil (confirmation ile)
  - [ ] **Bulk Import:**
    - CSV dosyasÄ± yÃ¼kle
    - Format validation
    - Preview gÃ¶ster
    - Toplu import et
    
- [ ] **Badge YÃ¶netimi:**
  - [ ] **TÃ¼m badge'leri listele**
    - Badge kodu, isim, tip, rarity, aktif/pasif
    - Edit/Delete butonlarÄ±
    - "Yeni Badge Ekle" butonu
  - [ ] **Yeni Badge Ekleme Formu:**
    - Badge kodu (unique identifier)
    - Badge tipi (Streak/Achievement/Rank/Milestone)
    - Ä°sim ve aÃ§Ä±klama (3 dilde)
    - Icon yÃ¼kleme
    - Rarity seÃ§imi (Common/Rare/Epic/Legendary)
    - **Kriter TanÄ±mlama (Parametrik):**
      - Streak badge: KaÃ§ gÃ¼n?
      - Achievement: KaÃ§ oyun tamamlansÄ±n?
      - Rank: Hangi sÄ±ralama aralÄ±ÄŸÄ±?
      - Milestone: Hangi milestone? (custom logic)
    - Aktif/Pasif toggle
  - [ ] **Badge DÃ¼zenleme:**
    - Kriterleri gÃ¼ncelle
    - Ä°simleri/aÃ§Ä±klamalarÄ± dÃ¼zenle
    - Icon'u deÄŸiÅŸtir
  - [ ] **Badge Test:**
    - Belirli kullanÄ±cÄ±ya test badge ver
    - Badge kriterlerini test et
    
- [ ] **KullanÄ±cÄ± YÃ¶netimi:**
  - [ ] TÃ¼m kullanÄ±cÄ±larÄ± listele
  - [ ] KullanÄ±cÄ± detaylarÄ±:
    - Skorlar
    - Tamamlanan setler
    - Badge'ler
    - Login streak
  - [ ] KullanÄ±cÄ± sil/suspend
  - [ ] Manuel badge ver/kaldÄ±r
  - [ ] KullanÄ±cÄ± skorunu dÃ¼zenle (gerekirse)
  
- [ ] **Oyun YÃ¶netimi:**
  - [ ] Yeni oyun tipi ekle
  - [ ] Oyun aÃ§Ä±klamalarÄ±nÄ± dÃ¼zenle
  - [ ] Oyunu aktif/pasif yap
  - [ ] Timer sÃ¼relerini ayarla
  
- [ ] **Analytics (Opsiyonel - Gelecek):**
  - [ ] GÃ¼nlÃ¼k/haftalÄ±k/aylÄ±k aktif kullanÄ±cÄ±
  - [ ] En Ã§ok oynanan setler
  - [ ] Ortalama tamamlama sÃ¼releri
  - [ ] Badge kazanma oranlarÄ±
  - [ ] Charts ve grafikler

### 5. Multi-language Support

**Ã–NEMLÄ° NOT:** Sadece arayÃ¼z (UI) Ã§ok dilli! Kelimeler hep Almanca!

#### 5.1 Language Files
- [ ] `tr.json` - TÃ¼rkÃ§e UI Ã§evirileri (butonlar, menÃ¼ler, mesajlar)
- [ ] `de.json` - Almanca UI Ã§evirileri (butonlar, menÃ¼ler, mesajlar)
- [ ] `en.json` - Ä°ngilizce UI Ã§evirileri (butonlar, menÃ¼ler, mesajlar)

**Ã‡evrilecek UI ElemanlarÄ±:**
- Butonlar (BaÅŸla, Ã‡Ä±kÄ±ÅŸ, Login, vs.)
- MenÃ¼ baÅŸlÄ±klarÄ±
- Bilgilendirme kartÄ± metinleri
- Set Ã¶zeti etiketleri
- Performans mesajlarÄ±
- Hata mesajlarÄ±
- Zorluk seviyesi label'larÄ±

**Ã‡evrilmeyen Ä°Ã§erik:**
- âŒ Kelimeler (hep Almanca: der Tisch, die TÃ¼r, das Auto)
- âŒ Artikeller (der/die/das hep aynÄ±)

#### 5.2 Language Switcher
- [ ] Dil deÄŸiÅŸtirme fonksiyonu
- [ ] localStorage'da dil tercihi saklama
- [ ] Sayfa yenilenmeden dil deÄŸiÅŸimi

### 6. Data Management

#### 6.1 API Functions
- [ ] `fetchDemoSet()` - Demo set verisi Ã§ek
- [ ] `fetchSetsByDifficulty(level)` - Zorluk seviyesine gÃ¶re setleri getir
- [ ] `fetchQuestions(setId)` - Set sorularÄ±nÄ± getir
- [ ] `saveScore(userId, setId, scoreData)` - Skoru kaydet
- [ ] `checkSetCompleted(userId, setId)` - Set tamamlanmÄ±ÅŸ mÄ± kontrol et
- [ ] `getGlobalLeaderboard(limit)` - Global skor tablosu
- [ ] `getSetLeaderboard(setId, limit)` - Set skoru tablosu
- [ ] **Badge API Functions (YENÄ°):**
  - [ ] `getUserBadges(userId)` - KullanÄ±cÄ±nÄ±n badge'lerini getir
  - [ ] `checkAndAwardBadges(userId)` - Badge kontrolÃ¼ ve otomatik verme
  - [ ] `getAllBadges()` - TÃ¼m badge'leri getir (koleksiyon sayfasÄ± iÃ§in)
  - [ ] `updateLoginStreak(userId)` - Login streak gÃ¼ncelle
  - [ ] `getBadgeProgress(userId, badgeId)` - Badge iÃ§in ilerleme yÃ¼zdesi
- [ ] **Admin API Functions (YENÄ°):**
  - [ ] `adminLogin(email, password)` - Admin giriÅŸi
  - [ ] `createSet(setData)` - Yeni set oluÅŸtur
  - [ ] `updateSet(setId, setData)` - Set'i gÃ¼ncelle
  - [ ] `deleteSet(setId)` - Set'i sil
  - [ ] `bulkImportQuestions(csvData)` - CSV'den toplu soru import
  - [ ] `createBadge(badgeData)` - Yeni badge oluÅŸtur
  - [ ] `updateBadge(badgeId, badgeData)` - Badge gÃ¼ncelle
  - [ ] `deleteBadge(badgeId)` - Badge sil
  - [ ] `manualAwardBadge(userId, badgeId)` - Manuel badge ver
  - [ ] `getAdminStats()` - Dashboard istatistikleri
  - [ ] `getAllUsers()` - TÃ¼m kullanÄ±cÄ±larÄ± listele
  - [ ] `getUserDetails(userId)` - KullanÄ±cÄ± detaylarÄ±

#### 6.2 Local Storage Management
- [ ] Session token saklama
- [ ] Dil tercihi saklama
- [ ] Demo oynamÄ±ÅŸ mÄ± flag (opsiyonel)

### 7. Styling (Color Palette)

#### 7.1 CSS Variables Setup
- [ ] Logodaki renkleri CSS variable olarak tanÄ±mla:
  ```css
  --color-red: #FF0000;
  --color-yellow: #FFD700;
  --color-blue: #0080FF;
  --color-green: #00FF00;
  --color-dark: #1a1a1a;
  --color-light: #ffffff;
  ```

#### 7.2 Component Styling
- [ ] Minimal, clean button styles
- [ ] Card styles (kelime kartÄ± iÃ§in)
- [ ] Table styles (leaderboard iÃ§in)
- [ ] Modal styles (login iÃ§in)
- [ ] Badge styles (zorluk seviyeleri iÃ§in)
- [ ] Responsive design (mobile-first)

#### 7.3 Animations & Transitions
- [ ] **DoÄŸru cevap animasyonlarÄ±:**
  - [ ] Confetti/particle effect (CSS veya lightweight library)
  - [ ] Scale-up + fade animation
  - [ ] Success checkmark animation
  - [ ] Green glow effect
- [ ] **YanlÄ±ÅŸ cevap animasyonlarÄ±:**
  - [ ] Shake animation (keyframes)
  - [ ] Red flash effect
  - [ ] X mark animation
  - [ ] Fade-in correct answer reveal
- [ ] **Transition animasyonlarÄ±:**
  - [ ] Page transitions (fade/slide)
  - [ ] Card flip effects
  - [ ] Smooth scroll
  - [ ] Button hover states
- [ ] **Loading animasyonlarÄ±:**
  - [ ] Spinner (logo renklerinde)
  - [ ] Skeleton screens
- [ ] **Collapsible card animations:**
  - [ ] Smooth expand/collapse
  - [ ] Rotate arrow icon
- [ ] **Badge animasyonlarÄ±:** **â† YENÄ°**
  - [ ] Badge kazanma popup animasyonu
  - [ ] Badge shine/glow effect
  - [ ] Confetti for legendary badges
  - [ ] Fade-in for badge unlock
- [ ] Performance optimization (CSS transform/opacity kullan)

### 8. Game Logic Constraints

#### 8.1 Badge Trigger Logic **â† YENÄ°**
- [ ] **Login streak tracking:**
  - [ ] Her login'de `user_login_streaks` gÃ¼ncelle
  - [ ] Streak kÄ±rÄ±ldÄ±ÄŸÄ±nda sÄ±fÄ±rla (24 saat geÃ§tiyse)
  - [ ] Streak badge'lerini kontrol et (3 gÃ¼n, 7 gÃ¼n, 30 gÃ¼n, vs.)
- [ ] **Achievement tracking:**
  - [ ] Set tamamlandÄ±ÄŸÄ±nda toplam tamamlanan set sayÄ±sÄ±nÄ± say
  - [ ] Achievement badge'lerini kontrol et (10 set, 50 set, 100 set)
  - [ ] Oyun tipi bazÄ±nda da tracking (Artikel Dash'te 25 set, vs.)
- [ ] **Rank tracking:**
  - [ ] Skor kaydedildikten sonra leaderboard sÄ±ralamasÄ±nÄ± kontrol et
  - [ ] Ä°lk 10'a girdiyse rank badge ver
  - [ ] Ä°lk 3'e girdiyse Ã¶zel badge ver
  - [ ] #1 olduysa "Champion" badge ver
- [ ] **Badge award flow:**
  - [ ] Her kritik aksiyon sonrasÄ± `checkAndAwardBadges(userId)` Ã§aÄŸÄ±r
  - [ ] Yeni badge kazanÄ±ldÄ±ysa UI'da gÃ¶ster
  - [ ] Multiple badge kazanÄ±ldÄ±ysa hepsini sÄ±rayla gÃ¶ster
  - [ ] Badge notification history (son 24 saattekiler)

#### 8.2 Set Completion Rules
- [ ] KullanÄ±cÄ± tamamlanan seti tekrar oynayamasÄ±n
- [ ] Demo set sÄ±nÄ±rsÄ±z oynanabilsin
- [ ] Login olduktan sonra demo skoru kaydetme seÃ§eneÄŸi

#### 8.3 Demo Mode
- [ ] Demo set Ã¶zel identifier ile iÅŸaretle
- [ ] Demo modda skor kaydetme
- [ ] Demo'dan sonra kayÄ±t teÅŸviki

#### 8.4 Admin Access Control **â† YENÄ°**
- [ ] Admin kullanÄ±cÄ±larÄ± iÃ§in ayrÄ± tablo (`admins`)
- [ ] Admin RLS policies (sadece adminler admin panel'e eriÅŸebilir)
- [ ] Role-based access (super-admin vs moderator - opsiyonel)
- [ ] Admin action logging (kim ne deÄŸiÅŸtirdi)

### 9. Error Handling & Edge Cases

- [ ] Network error handling (Supabase baÄŸlantÄ± hatalarÄ±)
- [ ] Session expire handling
- [ ] Duplicate email registration handling
- [ ] Empty set/question handling
- [ ] Browser back button handling (oyun sÄ±rasÄ±nda)
- [ ] **Admin panel error handling:** **â† YENÄ°**
  - [ ] Invalid CSV format
  - [ ] Duplicate set/badge codes
  - [ ] Unauthorized access attempts
  - [ ] File upload errors

### 10. Testing & Validation

- [ ] Demo mode testi
- [ ] Login flow testi (her iki yÃ¶ntem)
- [ ] Skor kaydetme testi
- [ ] Timer accuracy testi
- [ ] Leaderboard doÄŸruluk testi
- [ ] Multi-language testi
- [ ] **Badge sistem testleri:** **â† YENÄ°**
  - [ ] Streak badge otomatik veriliyor mu?
  - [ ] Achievement badge doÄŸru tetikleniyor mu?
  - [ ] Rank badge leaderboard'a gÃ¶re Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Badge progress tracking doÄŸru mu?
  - [ ] Badge koleksiyonu sayfasÄ± doÄŸru gÃ¶rÃ¼nÃ¼yor mu?
- [ ] **Admin panel testleri:** **â† YENÄ°**
  - [ ] Admin login gÃ¼venli mi?
  - [ ] Set CRUD operasyonlarÄ± Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] CSV import doÄŸru Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Badge CRUD operasyonlarÄ± Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] KullanÄ±cÄ± yÃ¶netimi Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Dashboard istatistikleri doÄŸru mu?

---

## ðŸ‘¤ UMUT'UN YAPACAKLARI

### 1. Supabase Kurulum & KonfigÃ¼rasyon

#### 1.1 Supabase Project Setup
- [ ] Supabase dashboard'da yeni proje oluÅŸtur (eÄŸer yoksa)
- [ ] Project URL ve API keys'i kopyala
- [ ] Environment variables ayarla:
  ```
  SUPABASE_URL=your_project_url
  SUPABASE_ANON_KEY=your_anon_key
  ```

#### 1.2 Authentication Settings
- [ ] Supabase dashboard â†’ Authentication â†’ Settings
- [ ] Google OAuth provider'Ä± etkinleÅŸtir
- [ ] Google Cloud Console'da OAuth credentials oluÅŸtur
- [ ] Callback URL'leri ayarla
- [ ] Email confirmation'Ä± devre dÄ±ÅŸÄ± bÄ±rak:
  - Settings â†’ Auth â†’ Email â†’ "Enable email confirmations" â†’ OFF

#### 1.3 Database Policies (RLS)
- [ ] Tables iÃ§in Row Level Security (RLS) politikalarÄ± ayarla:
  - `users`: KullanÄ±cÄ± kendi bilgilerini okuyabilir
  - `word_sets`: Herkes okuyabilir
  - `questions`: Herkes okuyabilir
  - `user_scores`: KullanÄ±cÄ± kendi skorlarÄ±nÄ± okuyabilir, herkes leaderboard'u gÃ¶rebilir
  - `user_set_progress`: KullanÄ±cÄ± sadece kendi ilerlemesini gÃ¶rebilir

### 2. Ä°Ã§erik OluÅŸturma

#### 2.1 Demo Set HazÄ±rlama
- [ ] 1 demo set iÃ§in 10 Almanca kelime seÃ§ (kolay seviye)
- [ ] **Sadece Almanca kelimeler + doÄŸru artikelleri (der/die/das)**
- [ ] Excel/CSV formatÄ±nda hazÄ±rla
- [ ] Supabase'e manuel olarak veya script ile import et

**Demo Set Ã–rnek Format:**
```csv
word_german, correct_article
Tisch, der
TÃ¼r, die
Auto, das
Buch, das
Stuhl, der
...
```

#### 2.2 Kelime Seti HazÄ±rlama (Zorluk Seviyelerine GÃ¶re)

**Ã–NEMLÄ°: Sadece Almanca kelimeler + artikelleri! Ã‡eviri yok!**

- [ ] **Level 1** (Kolay): 5 set x 10 kelime = 50 kelime
  - GÃ¼nlÃ¼k yaÅŸam kelimeleri (der Tisch, die TÃ¼r, das Auto)
  - **Format:** Kelime (Almanca) + DoÄŸru artikel (der/die/das)
  
- [ ] **Level 2** (Orta-Kolay): 5 set x 10 kelime = 50 kelime
  - Biraz daha spesifik kelimeler
  
- [ ] **Level 3** (Orta): 5 set x 10 kelime = 50 kelime
  - Orta seviye kelimeler
  
- [ ] **Level 4** (Orta-Zor): 5 set x 10 kelime = 50 kelime
  - Teknik veya daha az bilinen kelimeler
  
- [ ] **Level 5** (Zor): 5 set x 10 kelime = 50 kelime
  - Ä°leri seviye, nadiren kullanÄ±lan kelimeler

**Toplam: 250 kelime (25 set x 10 kelime)**

**Excel/CSV Format Ã–rneÄŸi:**
```
set_number, difficulty_level, word_german, correct_article, order_in_set
1, 1, Tisch, der, 1
1, 1, TÃ¼r, die, 2
1, 1, Auto, das, 3
...
```

#### 2.3 UI Ã‡evirileri (Sadece ArayÃ¼z)

**Ã–NEMLÄ°:** Kelimeler Ã§evrilmeyecek! Sadece UI elemanlarÄ± 3 dilde olacak.

- [ ] **Ana UI ElemanlarÄ± (3 dil: TR/DE/EN):**
  - [ ] Buton metinleri (BaÅŸla, Ã‡Ä±k, GiriÅŸ Yap, Kaydol, etc.)
  - [ ] MenÃ¼ baÅŸlÄ±klarÄ± (Anasayfa, Skorlar, Ayarlar, etc.)
  - [ ] Navigasyon elementleri
  
- [ ] **"NasÄ±l OynanÄ±r?" Bilgi KartÄ± (3 dil):**
  - [ ] Kart baÅŸlÄ±ÄŸÄ±
  - [ ] Oyun kurallarÄ± aÃ§Ä±klamasÄ±
  - [ ] Puanlama sistemi aÃ§Ä±klamasÄ±
  - [ ] Zorluk seviyeleri aÃ§Ä±klamasÄ±
  
- [ ] **Zorluk Seviyesi Badge'leri (3 dil):**
  - [ ] Level 1: "Kolay" / "Easy" / "Einfach"
  - [ ] Level 2: "Orta-Kolay" / "Medium-Easy" / "Mittel-Einfach"
  - [ ] Level 3: "Orta" / "Medium" / "Mittel"
  - [ ] Level 4: "Zor" / "Hard" / "Schwer"
  - [ ] Level 5: "Ã‡ok Zor" / "Very Hard" / "Sehr Schwer"
  
- [ ] **Performans MesajlarÄ± (3 dil):**
  - [ ] "MÃ¼kemmel!" / "Perfect!" / "Perfekt!"
  - [ ] "Harika!" / "Great!" / "GroÃŸartig!"
  - [ ] "Ä°yi!" / "Good!" / "Gut!"
  - [ ] "GeliÅŸtirebilirsin!" / "Keep Practicing!" / "Weiter Ã¼ben!"
  
- [ ] **Set Ã–zeti Etiketleri (3 dil):**
  - [ ] "Toplam Skor" / "Total Score" / "Gesamtpunktzahl"
  - [ ] "DoÄŸru Cevaplar" / "Correct Answers" / "Richtige Antworten"
  - [ ] "YanlÄ±ÅŸ Cevaplar" / "Wrong Answers" / "Falsche Antworten"
  - [ ] "Ortalama SÃ¼re" / "Average Time" / "Durchschnittliche Zeit"
  - [ ] "En HÄ±zlÄ± Cevap" / "Fastest Answer" / "Schnellste Antwort"
  - [ ] "HÄ±z Bonusu" / "Speed Bonus" / "Geschwindigkeitsbonus"
  - [ ] "BaÅŸarÄ± OranÄ±" / "Success Rate" / "Erfolgsquote"
  
- [ ] **Motivasyon MesajlarÄ± (3 dil, her performans seviyesi iÃ§in):**
  - [ ] MÃ¼kemmel performans mesajlarÄ±
  - [ ] Ä°yi performans mesajlarÄ±
  - [ ] Orta performans mesajlarÄ±
  - [ ] TeÅŸvik edici mesajlar

- [ ] **JSON formatÄ±nda dÃ¼zenle ve agent'a ilet**

**Kelimeler Ä°Ã‡Ä°N Ã§eviri YAPILMAYACAK - Hep Almanca gÃ¶sterilecek!**

#### 2.4 Badge Ä°Ã§erikleri HazÄ±rlama **â† YENÄ°**

**Ä°lk badge'leri Umut belirleyecek, sonra admin panelden eklenebilir olacak.**

- [ ] **Streak Badge'leri tasarla:**
  - [ ] 3 GÃ¼nlÃ¼k Seri (3 dil: isim + aÃ§Ä±klama)
  - [ ] 7 GÃ¼nlÃ¼k Seri
  - [ ] 30 GÃ¼nlÃ¼k Seri
  - [ ] 100 GÃ¼nlÃ¼k Seri
  - [ ] 365 GÃ¼nlÃ¼k Seri (YÄ±lÄ±n UstasÄ±!)
  
- [ ] **Achievement Badge'leri tasarla:**
  - [ ] Ä°lk Oyun (HoÅŸ geldin!)
  - [ ] 10 Set TamamladÄ±
  - [ ] 50 Set TamamladÄ±
  - [ ] 100 Set TamamladÄ±
  - [ ] MÃ¼kemmel Oyun (10/10 doÄŸru)
  - [ ] HÄ±z Åžampiyonu (10 soruda da <2s)
  - [ ] Combo UstasÄ± (5x combo yakaladÄ±)
  
- [ ] **Rank Badge'leri tasarla:**
  - [ ] Ä°lk 10'a Girdi (Herhangi oyunda)
  - [ ] Ä°lk 5'e Girdi
  - [ ] Ä°lk 3'e Girdi (Bronz/GÃ¼mÃ¼ÅŸ/AltÄ±n)
  - [ ] #1 Oldu (Åžampiyon!)
  
- [ ] **Milestone Badge'leri tasarla:**
  - [ ] TÃ¼m Level 1 setleri tamamladÄ±
  - [ ] TÃ¼m Level 5 setleri tamamladÄ± (Zorluk AvcÄ±sÄ±!)
  - [ ] Her oyun tipinde en az 1 set tamamladÄ± (Ã‡ok YÃ¶nlÃ¼)
  
- [ ] **Her badge iÃ§in hazÄ±rla:**
  - [ ] Unique kod (Ã¶rnek: `streak_7_days`)
  - [ ] Ä°sim (3 dil)
  - [ ] AÃ§Ä±klama (3 dil)
  - [ ] Rarity (Common/Rare/Epic/Legendary)
  - [ ] Icon tasarÄ±mÄ± veya emoji seÃ§imi
  
**Ã–rnek Badge Åžablonu:**
```json
{
  "badge_code": "streak_7_days",
  "badge_type": "streak",
  "rarity": "rare",
  "names": {
    "tr": "7 GÃ¼nlÃ¼k Seri",
    "en": "7 Day Streak",
    "de": "7 Tage Serie"
  },
  "descriptions": {
    "tr": "7 gÃ¼n Ã¼st Ã¼ste giriÅŸ yaptÄ±n! HarikasÄ±n!",
    "en": "Logged in for 7 consecutive days! Amazing!",
    "de": "7 Tage in Folge eingeloggt! Fantastisch!"
  },
  "criteria": {
    "type": "streak",
    "days": 7
  },
  "icon": "ðŸ”¥"
}
```

### 3. Vercel Deployment

#### 3.1 Vercel Setup
- [ ] GitHub repository oluÅŸtur
- [ ] Vercel hesabÄ±na baÄŸla
- [ ] Environment variables ekle (Supabase keys)
- [ ] Domain ayarlarÄ± (derdiedas.space)
- [ ] SSL sertifikasÄ± kontrolÃ¼

#### 3.2 Deployment Pipeline
- [ ] GitHub'a push â†’ otomatik deploy ayarla
- [ ] Production ve preview environment ayarla

### 4. Test & Quality Assurance

#### 4.1 Fonksiyonel Testler
- [ ] Demo mode'u test et (kayÄ±tsÄ±z oynama)
- [ ] Google login test et
- [ ] Supabase auth (email/password) test et
- [ ] Kelime seti oynama flow'unu test et
- [ ] Timer doÄŸruluÄŸunu test et
- [ ] **AnimasyonlarÄ± test et:**
  - [ ] DoÄŸru cevap animasyonu sorunsuz Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] YanlÄ±ÅŸ cevap animasyonu ve shake effect Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Set Ã¶zeti animasyonlarÄ± smooth mu?
  - [ ] Bilgi kartÄ± aÃ§Ä±lÄ±r/kapanÄ±r dÃ¼zgÃ¼n Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Mobile'da animasyonlar performanslÄ± mÄ±?
- [ ] Skor hesaplamasÄ±nÄ± manuel kontrol et
- [ ] Leaderboard'u kontrol et (global & set-based)
- [ ] Bir set 2. kez oynanamadÄ±ÄŸÄ±nÄ± doÄŸrula
- [ ] Dil deÄŸiÅŸtirmeyi test et
- [ ] **Set Ã¶zeti ekranÄ±nÄ± test et:**
  - [ ] TÃ¼m istatistikler doÄŸru gÃ¶rÃ¼nÃ¼yor mu?
  - [ ] Soru bazlÄ± Ã¶zet doÄŸru Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Performance badge'leri doÄŸru atanÄ±yor mu?
- [ ] **Badge sistemini test et:** **â† YENÄ°**
  - [ ] Streak badge'leri otomatik veriliyor mu?
  - [ ] Set tamamladÄ±ktan sonra achievement badge geliyor mu?
  - [ ] Leaderboard'a gÃ¶re rank badge'leri doÄŸru mu?
  - [ ] Badge koleksiyonu sayfasÄ± dÃ¼zgÃ¼n gÃ¶rÃ¼nÃ¼yor mu?
  - [ ] Badge kazanma animasyonlarÄ± Ã§alÄ±ÅŸÄ±yor mu?
- [ ] **Admin paneli test et:** **â† YENÄ°**
  - [ ] Admin login Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Yeni set ekleyebiliyor musun?
  - [ ] CSV upload doÄŸru Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Badge oluÅŸturma ve dÃ¼zenleme Ã§alÄ±ÅŸÄ±yor mu?
  - [ ] Dashboard istatistikleri doÄŸru mu?

#### 4.2 Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

#### 4.3 Responsive Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 5. Ä°Ã§erik & Asset HazÄ±rlama

#### 5.1 GÃ¶rsel Materyaller
- [ ] Logo'yu farklÄ± boyutlarda dÄ±ÅŸa aktar (favicon, header, etc.)
- [ ] Favicon oluÅŸtur (.ico, .png)
- [ ] Open Graph image hazÄ±rla (sosyal medya paylaÅŸÄ±mlarÄ± iÃ§in)

#### 5.2 Metin Ä°Ã§erikleri
- [ ] Landing page metni (eÄŸer olacaksa)
- [ ] Oyun kurallarÄ±/yÃ¶nergeler
- [ ] HakkÄ±nda sayfasÄ± iÃ§eriÄŸi
- [ ] Privacy Policy (gerekirse)
- [ ] Terms of Service (gerekirse)

### 6. Analytics & Monitoring (Opsiyonel - Sonra)

- [ ] Google Analytics kurulumu
- [ ] Supabase log monitoring
- [ ] Error tracking (Sentry gibi)
- [ ] User behavior analytics

### 7. Marketing & Launch (Sonraki AÅŸama)

- [ ] Sosyal medya hesaplarÄ± oluÅŸtur
- [ ] Launch duyurusu hazÄ±rla
- [ ] Ä°lk kullanÄ±cÄ± grubunu belirle (beta tester)
- [ ] Feedback toplama mekanizmasÄ±

---

## ðŸ“‹ Ã–NCELIK SIRASI

### Phase 1: Temel AltyapÄ± (Ä°lk Hafta)
1. AI Agent: Supabase tablo yapÄ±sÄ±nÄ± oluÅŸtur
2. Umut: Supabase'i konfigÃ¼re et, Google OAuth ayarla
3. AI Agent: Authentication flow'u kur
4. Umut: Demo set iÃ§in 10 kelime hazÄ±rla

### Phase 2: Core Gameplay (Ä°kinci Hafta)
1. AI Agent: Oyun mantÄ±ÄŸÄ±nÄ± kur (timer, scoring, question flow)
2. **AI Agent: AnimasyonlarÄ± ekle (doÄŸru/yanlÄ±ÅŸ feedback)**
3. AI Agent: Minimal UI components oluÅŸtur
4. **AI Agent: Set Ã¶zeti ekranÄ±nÄ± oluÅŸtur**
5. Umut: Ä°lk 2 zorluk seviyesi iÃ§in kelimeler hazÄ±rla (100 kelime)
6. Umut: UI/UX testleri yap

### Phase 3: Feature Complete (ÃœÃ§Ã¼ncÃ¼ Hafta)
1. AI Agent: Multi-language support ekle
2. AI Agent: Leaderboard sistemi
3. **AI Agent: Bilgi kartÄ± (collapsible) ekle**
4. **AI Agent: Zorluk badge'lerini ekle**
5. Umut: Kalan 3 zorluk seviyesi iÃ§in kelimeler hazÄ±rla (150 kelime)
6. Umut: TÃ¼m Ã§evirileri tamamla (motivasyon mesajlarÄ± dahil)

### Phase 4: Polish & Deploy (DÃ¶rdÃ¼ncÃ¼ Hafta)
1. AI Agent: Edge cases ve error handling
2. Umut: KapsamlÄ± test sÃ¼reci
3. AI Agent: Performance optimizations
4. Umut: Vercel deployment ve domain ayarlarÄ±

---

## ðŸŽ¯ SUCCESS CRITERIA

### v1.0 (Artikel Dash):
- [ ] KullanÄ±cÄ± kaydolmadan demo oynayabiliyor
- [ ] Google ve Supabase auth Ã§alÄ±ÅŸÄ±yor (confirmation yok)
- [ ] 5 zorluk seviyesi, toplamda 25 set (250 kelime) hazÄ±r
- [ ] Timer doÄŸru Ã§alÄ±ÅŸÄ±yor (5 saniye)
- [ ] Skor sistemi doÄŸru hesaplÄ±yor (zorluk + hÄ±z bonusu)
- [ ] **ðŸ”¥ Combo sistemi Ã§alÄ±ÅŸÄ±yor (3 baÅŸla, 5'te sÄ±fÄ±rla)**
- [ ] **DoÄŸru/yanlÄ±ÅŸ animasyonlar Ã§alÄ±ÅŸÄ±yor (confetti, shake)**
- [ ] **Set Ã¶zeti ekranÄ± detaylÄ± istatistikler gÃ¶steriyor (combo bonusu dahil)**
- [ ] **Bilgi kartÄ± (NasÄ±l OynanÄ±r?) aÃ§Ä±lÄ±p kapanÄ±yor**
- [ ] **Zorluk badge'leri setlerin Ã¼zerinde gÃ¶rÃ¼nÃ¼yor**
- [ ] KullanÄ±cÄ± aynÄ± seti 2. kez oynayamÄ±yor
- [ ] Global ve set-bazlÄ± leaderboard Ã§alÄ±ÅŸÄ±yor
- [ ] 3 dil desteÄŸi Ã§alÄ±ÅŸÄ±yor (TR, DE, EN)
- [ ] Mobile responsive
- [ ] **Animasyonlar mobile'da performanslÄ± Ã§alÄ±ÅŸÄ±yor**
- [ ] Vercel'de yayÄ±nda

### ModÃ¼ler Mimari (Gelecek iÃ§in):
- [ ] **Database game_type_id ile modÃ¼ler**
- [ ] **Oyun seÃ§im ekranÄ± hazÄ±r (Word Salad ve Preposition Master "YakÄ±nda")**
- [ ] **Code yapÄ±sÄ± modÃ¼ler (yeni oyun eklemek kolay)**
- [ ] **Shared components ayrÄ± (auth, scoring, leaderboard, timer)**

---

## ðŸ“ž NEXT STEPS

### Umut iÃ§in Immediate Actions:
1. Supabase projesi oluÅŸtur ve credentials'Ä± hazÄ±rla
2. Demo set iÃ§in 10 kelime seÃ§ ve hazÄ±rla
3. Google Cloud Console'da OAuth credentials oluÅŸtur

### Agent iÃ§in Immediate Actions:
1. Supabase tablo yapÄ±sÄ±nÄ± SQL olarak oluÅŸtur
2. Basic authentication flow'u kur
3. Minimal homepage layout oluÅŸtur

---

**Son GÃ¼ncelleme:** {{ CURRENT_DATE }}
**Proje BaÅŸlangÄ±Ã§ Hedefi:** 4 hafta
**Minimum Viable Product (MVP):** Phase 3 sonunda hazÄ±r olmalÄ±
