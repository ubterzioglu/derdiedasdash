# ðŸŽ® DER DIE DAS SPACE - AI AGENT DEVELOPMENT BRIEF v1.0

## ðŸ“‹ Ä°Ã‡Ä°NDEKÄ°LER

1. [Proje Ã–zeti](#proje-Ã¶zeti)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Proje Felsefesi](#proje-felsefesi)
4. [5 Oyun DetaylÄ± Åžartname](#5-oyun-detaylÄ±-ÅŸartname)
5. [Unified Scoring System](#unified-scoring-system)
6. [Database Schema](#database-schema)
7. [Dosya YapÄ±sÄ±](#dosya-yapÄ±sÄ±)
8. [Authentication System](#authentication-system)
9. [Admin Panel](#admin-panel)
10. [UI/UX Guidelines](#uiux-guidelines)
11. [Dil Sistemi](#dil-sistemi)
12. [Leaderboard System](#leaderboard-system)
13. [Badge System](#badge-system)
14. [Demo Mode](#demo-mode)
15. [Animasyonlar](#animasyonlar)
16. [Code Style Guide](#code-style-guide)
17. [Testing Checklist](#testing-checklist)
18. [Deployment](#deployment)

---

## ðŸŽ¯ PROJE Ã–ZETÄ°

### Platform Konsepti
**Der Die Das Space**, Almanca Ã¶ÄŸrenenler iÃ§in **5 farklÄ± oyun tÃ¼rÃ¼** iÃ§eren modÃ¼ler bir Ã¶ÄŸrenme platformudur.

### Temel Ã–zellikler
- âœ… 5 farklÄ± oyun mekaniÄŸi
- âœ… Unified puanlama sistemi
- âœ… Global + oyun-spesifik leaderboard
- âœ… Parametrik badge sistemi
- âœ… Admin panel (API key auth)
- âœ… 2 dil desteÄŸi (TR/EN)
- âœ… Demo mode (kayÄ±tsÄ±z oyun)
- âœ… ModÃ¼ler mimari (yeni oyun eklemek kolay)

### Platform Ä°smi
**DER DIE DAS SPACE**

### 5 Oyun
1. **Der Die Dash** - Artikel tahmin (der/die/das)
2. **Case Control** - Preposition + doÄŸru form
3. **Word Salad** - Kelimelerden cÃ¼mle kur
4. **Translation Quest** - Almanca â†’ TR/EN Ã§eviri
5. **5-Letter Blitz** - 5 harfi sÄ±rala

---

## ðŸ› ï¸ TEKNOLOJÄ° STACK

### Frontend
```
- HTML5
- CSS3 (Vanilla - framework yok)
- JavaScript (Vanilla - framework yok)
- Responsive design (mobile-first)
```

### Backend
```
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth + Email/Password)
- Supabase Functions (backend logic)
- Row Level Security (RLS)
```

### Hosting
```
- Vercel (frontend)
- GitHub (version control)
```

### Assets
```
- Logo: /assets/logo.png (derdiedasspacelogo.png)
- Sounds: /assets/sounds/ (v1.0'da yok)
```

---

## ðŸ—ï¸ PROJE FELSEFESÄ°

### ModÃ¼ler Mimari Zorunlu!

**Neden modÃ¼ler?**
- Yeni oyun eklemek **15 dakika** almalÄ±
- Her oyun baÄŸÄ±msÄ±z modÃ¼l
- Ortak core sistemler (auth, scoring, timer)
- Database schema esnek (JSONB)

### TasarÄ±m Prensipleri

1. **DRY (Don't Repeat Yourself)**
   - Ortak kod â†’ core modules
   - Oyun-spesifik â†’ game modules

2. **Plug-and-Play Oyunlar**
   - Yeni oyun = yeni klasÃ¶r + config
   - Game registry sistemi
   - Otomatik entegrasyon

3. **Esnek Database**
   - JSONB iÃ§in farklÄ± oyun formatlarÄ±
   - Geriye dÃ¶nÃ¼k uyumluluk

4. **Performans**
   - Minimal JS (vanilla)
   - Optimize edilmiÅŸ queries
   - Lazy loading (gerekirse)

---

## ðŸŽ® 5 OYUN DETAYLI ÅžARTNAME

### OYUN 1: DER DIE DASH

#### Konsept
Almanca kelimeye doÄŸru artikeli (der/die/das) tahmin etme.

#### Mekanik
```
1. Ekranda Almanca kelime: "Tisch"
2. 3 buton: [der] [die] [das]
3. KullanÄ±cÄ± 5 saniye iÃ§inde seÃ§er
4. Feedback (âœ… veya âŒ)
5. Sonraki soru
6. 10 soru = 1 set
```

#### Timer
- **5 saniye** / soru

#### Zorluk Seviyeleri
```
Level 1: GÃ¼nlÃ¼k basit kelimeler (der Tisch, das Auto, die TÃ¼r)
Level 2: Orta kelimeler
Level 3: Orta-ileri kelimeler
Level 4: Teknik/nadir kelimeler
Level 5: Ã‡ok zor kelimeler
```

#### Puanlama
```
Base: 20 puan (sabit)
Level multipliers: 1.0, 1.1, 1.25, 1.45, 1.7
Speed bonus: oransal (timeUsed/maxTime)
Combo bonus: 3+ doÄŸru
Wrong penalty: -5
```

#### Database Format
```json
{
  "word": "Tisch",
  "correct_article": "der"
}
```

#### UI Ã–zellikleri
- Kelime kartÄ± (bÃ¼yÃ¼k, merkez)
- 3 buton (logo renklerinde: kÄ±rmÄ±zÄ±/mavi/sarÄ±)
- Timer gÃ¶stergesi (circular veya bar)
- Skor gÃ¶stergesi (Ã¼st kÃ¶ÅŸe)
- Combo gÃ¶stergesi (varsa)

---

### OYUN 2: CASE CONTROL

#### Konsept
Preposition sonrasÄ± doÄŸru artikel formunu bulma (Dativ/Akkusativ).

#### Mekanik
```
1. Ekranda: "mit ... Tisch"
2. 3 seÃ§enek: [dem] [der] [den]
3. KullanÄ±cÄ± 5 saniye iÃ§inde seÃ§er
4. DoÄŸru cevap: "mit dem Tisch" (Dativ)
5. Feedback
6. Sonraki soru
```

#### Ã–rnekler
```
mit ... Tisch â†’ dem (Dativ)
fÃ¼r ... Kind â†’ das (Akkusativ)
von ... Frau â†’ der (Genitiv)
zu ... Schule â†’ der (Dativ)
```

#### Timer
- **5 saniye** / soru

#### Zorluk Seviyeleri
```
Level 1: Basit prepositions (mit, fÃ¼r, ohne)
Level 2: KarÄ±ÅŸÄ±k prepositions
Level 3: Orta zorluk
Level 4: WechselprÃ¤positionen (in, an, auf)
Level 5: KarmaÅŸÄ±k kombinasyonlar
```

#### Puanlama
```
Base: 25 puan (daha zor!)
Level multipliers: 1.0, 1.1, 1.25, 1.45, 1.7
Speed bonus: oransal
Combo bonus: 3+ doÄŸru
Wrong penalty: -7
```

#### Database Format
```json
{
  "preposition": "mit",
  "word": "Tisch",
  "correct_form": "dem",
  "options": ["dem", "der", "den"]
}
```

#### UI Ã–zellikleri
- Preposition + kelime kartÄ±
- 3 seÃ§enek butonu
- Gramer ipucu (opsiyonel - hover)
- Timer
- Skor

---

### OYUN 3: WORD SALAD

#### Konsept
KarÄ±ÅŸÄ±k Almanca kelimelerden doÄŸru cÃ¼mle kurmak.

#### Mekanik
```
1. KarÄ±ÅŸÄ±k kelimeler: [Schule] [gehe] [die] [in] [Ich]
2. KullanÄ±cÄ± sÄ±ralar (drag-drop veya click)
3. Ãœstte cÃ¼mle oluÅŸur: [Ich][gehe][in][die][Schule]
4. "GO" butonu ile kontrol
5. âœ… DoÄŸru â†’ Sonraki
6. âŒ YanlÄ±ÅŸ â†’ Shake + "RESET" (kelimeler eski yerine)
7. 20 saniye sÃ¼re
```

#### CÃ¼mle Ã–zellikleri
```
TÃ¼m leveller: 10 kelimelik cÃ¼mleler

Level 1: Basit present tense
Level 2: Simple past
Level 3: Perfekt baÅŸlangÄ±Ã§
Level 4: Perfekt + separable verbs
Level 5: KarmaÅŸÄ±k yapÄ±lar
```

#### Timer
- **20 saniye** / soru (en uzun!)

#### Puanlama
```
Base: 30 puan (en zor!)
Level multipliers: 1.0, 1.1, 1.25, 1.45, 1.7
Speed bonus: oransal
Combo bonus: 3+ doÄŸru
Wrong penalty: -10
```

#### Database Format
```json
{
  "correct_sentence": "Ich gehe in die Schule",
  "scrambled_words": ["Schule", "gehe", "die", "in", "Ich"],
  "word_count": 10
}
```

#### UI Ã–zellikleri
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ [Ich][gehe][in]...   â”‚  â† Ãœst kutu (oluÅŸan cÃ¼mle)
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

[Schule] [gehe] [die]     â† Alt (karÄ±ÅŸÄ±k kelimeler)
[in] [Ich] ...

Kelime sayÄ±sÄ±: 3/10       â† Progress
[RESET]  [GO]             â† Butonlar
```

**Ã–nemli:**
- Drag & drop VEYA click-to-add
- SeÃ§ilen kelime Ã¼ste gider, alttakiler kaybolur
- RESET: TÃ¼m seÃ§imleri iptal
- GO: CevabÄ± kontrol et
- SÃ¼re prominent gÃ¶sterilmeli (uzun olduÄŸu iÃ§in)

---

### OYUN 4: TRANSLATION QUEST

#### Konsept
Almanca kelimeyi TÃ¼rkÃ§e veya Ä°ngilizce'ye Ã§evirmek.

**Ã–NEMLÄ°:** UI diline gÃ¶re ÅŸÄ±klar deÄŸiÅŸir!

#### Mekanik
```
1. Almanca kelime: "Tisch" (+ der/die/das bilgisi)
2. 4 ÅŸÄ±k gÃ¶sterilir

UI TÃ¼rkÃ§e ise:
A) Masa     â† DoÄŸru
B) KapÄ±
C) Araba
D) Kitap

UI Ä°ngilizce ise:
A) Table    â† DoÄŸru
B) Door
C) Car
D) Book

3. KullanÄ±cÄ± 8 saniye iÃ§inde seÃ§er
4. Feedback
5. Sonraki soru
```

#### Timer
- **8 saniye** / soru

#### Zorluk Seviyeleri
```
Level 1: Basit kelimeler + Ã§ok farklÄ± yanlÄ±ÅŸ ÅŸÄ±klar
Level 2-3: Orta kelimeler + benzer kategori yanlÄ±ÅŸ ÅŸÄ±klar
Level 4-5: Zor kelimeler + Ã§ok benzer anlamlÄ± yanlÄ±ÅŸ ÅŸÄ±klar

Ã–rnek:
Level 1: Tisch â†’ [Masa, Araba, Kitap, Kalem] (Ã§ok farklÄ±)
Level 5: Stuhl â†’ [Sandalye, Koltuk, Bank, Tabure] (hepsi oturma!)
```

#### Puanlama
```
Base: 22 puan
Level multipliers: 1.0, 1.1, 1.25, 1.45, 1.7
Speed bonus: oransal
Combo bonus: 3+ doÄŸru
Wrong penalty: -5
```

#### Database Format
```json
{
  "word": "Tisch",
  "article": "der",
  "translation_tr": "Masa",
  "translation_en": "Table",
  "wrong_options_tr": ["KapÄ±", "Araba", "Kitap"],
  "wrong_options_en": ["Door", "Car", "Book"]
}
```

#### UI Ã–zellikleri
- Almanca kelime + artikel (Ã¼stte)
- 4 ÅŸÄ±k (A/B/C/D veya 1/2/3/4)
- **Ã–NEMLÄ°:** ÅžÄ±klar UI diline gÃ¶re deÄŸiÅŸir!
- Timer
- Skor

#### Frontend Logic
```javascript
function renderTranslationQuestion(questionData, userLanguage) {
  const correctAnswer = userLanguage === 'tr' 
    ? questionData.translation_tr 
    : questionData.translation_en;
    
  const wrongOptions = userLanguage === 'tr'
    ? questionData.wrong_options_tr
    : questionData.wrong_options_en;
    
  const allOptions = shuffle([correctAnswer, ...wrongOptions]);
  return allOptions;
}
```

---

### OYUN 5: 5-LETTER BLITZ

#### Konsept
Sadece 5 harfli Almanca kelimelerin harflerini sÄ±raya dizmek.

#### Mekanik
```
1. KarÄ±ÅŸÄ±k 5 harf: [C] [I] [S] [H] [T]
2. KullanÄ±cÄ± harflere tÄ±klar
3. SeÃ§ilen harfler Ã¼st kutuya: [T][I][S][C][H]
4. "OK" butonuna bas
5. âœ… DoÄŸru â†’ Sonraki
6. âŒ YanlÄ±ÅŸ â†’ Shake + harfler eski yerine (tekrar dene)
7. 10 saniye sÃ¼re
```

#### KÄ±sÄ±tlama
**SADECE 5 harfli kelimeler!**

#### Timer
- **10 saniye** / soru

#### Zorluk Seviyeleri
```
Level 1: Basit 5 harfli (Tisch, Stuhl, Buch)
Level 2-3: Orta kelimeler
Level 4-5: Nadir 5 harfli kelimeler
```

#### Puanlama
```
Base: 25 puan
Level multipliers: 1.0, 1.1, 1.25, 1.45, 1.7
Speed bonus: oransal
Combo bonus: 3+ doÄŸru
Wrong penalty: -7
```

#### Database Format
```json
{
  "word": "TISCH",
  "scrambled": ["C", "I", "S", "H", "T"],
  "article": "der"
}
```

#### UI Ã–zellikleri
```
[T][I][S][C][H]           â† Ãœst kutu (seÃ§ilen harfler)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

[C] [I] [S] [H] [T]       â† Alt (karÄ±ÅŸÄ±k, tÄ±klanabilir)

Harf sayÄ±sÄ±: 5/5
[RESET]  [OK]             â† Butonlar
```

**Ã–nemli:**
- Harfler click-to-add (drag-drop opsiyonel)
- SeÃ§ilen harf Ã¼ste gider, alttakiler disabled
- RESET: Harfleri eski yerine
- OK: Kontrol et

---

## ðŸŽ¯ UNIFIED SCORING SYSTEM

### Temel Prensipler

1. Her soru iÃ§in skor hesaplanÄ±r
2. Oyun farkÄ± base score ile dengelenir
3. Zorluk, sÃ¼re ve combo evrensel Ã§arpanlarla uygulanÄ±r
4. Set skoru = tÃ¼m soru skorlarÄ±nÄ±n toplamÄ±
5. Global leaderboard = normalize edilmiÅŸ skor

---

### 1. BASE SCORE (Oyuna GÃ¶re)

| Oyun | Base Score |
|------|-----------|
| Der Die Dash | 20 |
| Case Control | 25 |
| Word Salad | 30 |
| Translation Quest | 22 |
| 5-Letter Blitz | 25 |

---

### 2. DIFFICULTY MULTIPLIER

| Level | Ã‡arpan |
|-------|--------|
| Level 1 | Ã—1.0 |
| Level 2 | Ã—1.1 |
| Level 3 | Ã—1.25 |
| Level 4 | Ã—1.45 |
| Level 5 | Ã—1.7 |

---

### 3. SPEED BONUS (Oransal)

```javascript
speedRatio = timeUsed / maxTime

speedRatio â‰¤ 0.30 â†’ +10 puan
speedRatio â‰¤ 0.50 â†’ +6 puan
speedRatio â‰¤ 0.70 â†’ +3 puan
speedRatio â‰¤ 0.90 â†’ +1 puan
speedRatio > 0.90 â†’ +0 puan
```

**Ã–rnek:**
```
Der Die Dash (maxTime=5s):
- 1.5s kullandÄ± â†’ ratio=0.30 â†’ +10 bonus
- 2.5s kullandÄ± â†’ ratio=0.50 â†’ +6 bonus

Word Salad (maxTime=20s):
- 6s kullandÄ± â†’ ratio=0.30 â†’ +10 bonus (adil!)
- 10s kullandÄ± â†’ ratio=0.50 â†’ +6 bonus
```

---

### 4. COMBO SYSTEM

```
3 doÄŸru Ã¼st Ã¼ste â†’ Combo baÅŸlar
Combo aktifken her doÄŸru: +5 puan
5 doÄŸru Ã¼st Ã¼ste â†’ +8 puan (son soru)
5'ten sonra â†’ Combo reset (0'dan baÅŸla)
YanlÄ±ÅŸ cevap â†’ Combo reset
```

**Ã–rnek AkÄ±ÅŸ:**
```
Q1: âœ… doÄŸru â†’ streak=1, combo=0
Q2: âœ… doÄŸru â†’ streak=2, combo=0
Q3: âœ… doÄŸru â†’ streak=3, combo=+5 â¬…ï¸ BaÅŸladÄ±!
Q4: âœ… doÄŸru â†’ streak=4, combo=+5
Q5: âœ… doÄŸru â†’ streak=5, combo=+8 â¬…ï¸ Peak!
Q6: âœ… doÄŸru â†’ streak=1, combo=0 â¬…ï¸ Reset
Q7: âŒ yanlÄ±ÅŸ â†’ streak=0, combo=0
```

---

### 5. WRONG ANSWER PENALTY

| Oyun | Ceza |
|------|------|
| Der Die Dash | -5 |
| Translation Quest | -5 |
| Case Control | -7 |
| 5-Letter Blitz | -7 |
| Word Salad | -10 |

**Not:** Skor asla 0 altÄ±na dÃ¼ÅŸmez!

---

### 6. QUESTION SCORE FORMÃœLÃœ

```javascript
// DoÄŸru cevap
QuestionScore = (BaseScore Ã— DifficultyMultiplier) 
                + SpeedBonus 
                + ComboBonus

// YanlÄ±ÅŸ cevap
QuestionScore = 0 - WrongPenalty
```

---

### 7. SET SCORE

```javascript
SetScore = Î£ QuestionScore (10 soru)
```

**AyrÄ±ca kaydedilen metrikler:**
- Correct answers
- Wrong answers
- Max combo reached
- Average response time
- Accuracy percentage

---

### 8. NORMALIZED SCORE (Global Leaderboard)

```javascript
NormalizedScore = (SetScore / MaxPossibleSetScore) Ã— 1000
```

**MaxPossibleSetScore** (Perfect game):
```javascript
MaxPossibleSetScore(game, level) = 
  10 Ã— (BaseScore Ã— DifficultyMultiplier)
  + 100  // Perfect speed (10 soru Ã— +10)
  + 36   // Perfect combo (5'te reset ile max)
```

---

### MaxPossibleSetScore Tablosu

#### Der Die Dash (Base=20)
- L1: 336, L2: 356, L3: 386, L4: 426, L5: 476

#### Case Control (Base=25)
- L1: 386, L2: 411, L3: 448, L4: 498, L5: 561

#### Word Salad (Base=30)
- L1: 436, L2: 466, L3: 511, L4: 571, L5: 646

#### Translation Quest (Base=22)
- L1: 356, L2: 378, L3: 411, L4: 455, L5: 510

#### 5-Letter Blitz (Base=25)
- L1: 386, L2: 411, L3: 448, L4: 498, L5: 561

---

### 9. TIMEOUT & ABANDON

**Timeout (sÃ¼re dolarsa):**
- YanlÄ±ÅŸ cevap gibi say
- Penalty uygula (-5, -7, -10)
- Combo sÄ±fÄ±rla

**Oyunu bÄ±rakma:**
- Set "ABANDONED" olarak iÅŸaretle
- Leaderboard'a yazma
- Telemetry iÃ§in opsiyonel kaydet

---

### 10. v1.0 BONUS Ã–ZELLÄ°KLER

**Perfect Set Bonus:**
```
EÄŸer 10/10 doÄŸru â†’ Set skoruna +50 bonus
```

**No-Mistake Badge:**
```
10/10 doÄŸru yapana rozet ver (puana dokunma)
```

---

### JavaScript Implementation

```javascript
// scoring.js

const BASE_SCORES = {
  der_die_dash: 20,
  case_control: 25,
  word_salad: 30,
  translation_quest: 22,
  five_letter_blitz: 25
};

const DIFFICULTY_MULTIPLIERS = {
  1: 1.0,
  2: 1.1,
  3: 1.25,
  4: 1.45,
  5: 1.7
};

const PENALTIES = {
  der_die_dash: -5,
  case_control: -7,
  word_salad: -10,
  translation_quest: -5,
  five_letter_blitz: -7
};

function calculateSpeedBonus(timeUsed, maxTime) {
  const ratio = timeUsed / maxTime;
  if (ratio <= 0.30) return 10;
  if (ratio <= 0.50) return 6;
  if (ratio <= 0.70) return 3;
  if (ratio <= 0.90) return 1;
  return 0;
}

function calculateComboBonus(streak) {
  if (streak < 3) return 0;
  if (streak < 5) return 5;
  if (streak === 5) return 8;
  return 0; // Reset after 5
}

function calculateQuestionScore(params) {
  const {
    gameKey,
    level,
    isCorrect,
    timeUsed,
    maxTime,
    comboStreak
  } = params;

  if (!isCorrect) {
    return PENALTIES[gameKey];
  }

  const baseScore = BASE_SCORES[gameKey];
  const multiplier = DIFFICULTY_MULTIPLIERS[level];
  const adjustedBase = baseScore * multiplier;
  
  const speedBonus = calculateSpeedBonus(timeUsed, maxTime);
  const comboBonus = calculateComboBonus(comboStreak);

  return adjustedBase + speedBonus + comboBonus;
}

function maxPossibleSetScore(gameKey, level) {
  const base = BASE_SCORES[gameKey];
  const mult = DIFFICULTY_MULTIPLIERS[level];
  const perfectSpeed = 100; // 10 Ã— +10
  const perfectCombo = 36;  // 5'te reset max
  
  return (10 * base * mult) + perfectSpeed + perfectCombo;
}

function normalizedScore(setScore, gameKey, level) {
  const max = maxPossibleSetScore(gameKey, level);
  return Math.round((setScore / max) * 1000);
}

function calculateSetScore(questions) {
  let totalScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let maxCombo = 0;
  let currentStreak = 0;
  let totalTime = 0;

  questions.forEach(q => {
    if (q.isCorrect) {
      currentStreak++;
      correctCount++;
      maxCombo = Math.max(maxCombo, currentStreak);
      totalTime += q.timeUsed;
    } else {
      currentStreak = 0;
      wrongCount++;
    }

    // Reset combo after 5
    if (currentStreak === 5) {
      currentStreak = 0;
    }

    const score = calculateQuestionScore({
      ...q,
      comboStreak: currentStreak
    });

    totalScore += Math.max(0, score); // Never go below 0
  });

  // Perfect set bonus
  if (correctCount === 10) {
    totalScore += 50;
  }

  return {
    setScore: totalScore,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    maxCombo: maxCombo,
    avgResponseTime: totalTime / correctCount,
    accuracyPercentage: (correctCount / 10) * 100
  };
}
```

---

## ðŸ—„ï¸ DATABASE SCHEMA

### Tablolar

#### 1. users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  auth_provider VARCHAR(50) NOT NULL, -- 'google' or 'supabase'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

#### 2. game_types
```sql
CREATE TABLE game_types (
  id SERIAL PRIMARY KEY,
  game_code VARCHAR(50) UNIQUE NOT NULL,
  game_name_tr VARCHAR(100) NOT NULL,
  game_name_en VARCHAR(100) NOT NULL,
  game_description_tr TEXT,
  game_description_en TEXT,
  is_active BOOLEAN DEFAULT true,
  requires_translation BOOLEAN DEFAULT false,
  timer_seconds INT NOT NULL,
  base_score INT NOT NULL,
  release_version VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO game_types (game_code, game_name_tr, game_name_en, timer_seconds, base_score, requires_translation) VALUES
  ('der_die_dash', 'Der Die Dash', 'Der Die Dash', 5, 20, false),
  ('case_control', 'Case Control', 'Case Control', 5, 25, false),
  ('word_salad', 'Word Salad', 'Word Salad', 20, 30, false),
  ('translation_quest', 'Translation Quest', 'Translation Quest', 8, 22, true),
  ('five_letter_blitz', '5-Letter Blitz', '5-Letter Blitz', 10, 25, false);
```

#### 3. word_sets
```sql
CREATE TABLE word_sets (
  id SERIAL PRIMARY KEY,
  game_type_id INT NOT NULL REFERENCES game_types(id),
  set_number INT NOT NULL,
  difficulty_level SMALLINT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_type_id, set_number)
);
```

#### 4. questions
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  set_id INT NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
  question_data JSONB NOT NULL,
  order_in_set SMALLINT NOT NULL CHECK (order_in_set BETWEEN 1 AND 10)
);

-- Indexes
CREATE INDEX idx_questions_set_id ON questions(set_id);
```

**Question Data Formats:**

```sql
-- Der Die Dash
{"word": "Tisch", "correct_article": "der"}

-- Case Control
{"preposition": "mit", "word": "Tisch", "correct_form": "dem", "options": ["dem", "der", "den"]}

-- Word Salad
{"correct_sentence": "Ich gehe in die Schule", "scrambled_words": ["Schule", "gehe", "die", "in", "Ich"], "word_count": 10}

-- Translation Quest
{"word": "Tisch", "article": "der", "translation_tr": "Masa", "translation_en": "Table", "wrong_options_tr": ["KapÄ±", "Araba", "Kitap"], "wrong_options_en": ["Door", "Car", "Book"]}

-- 5-Letter Blitz
{"word": "TISCH", "scrambled": ["C", "I", "S", "H", "T"], "article": "der"}
```

#### 5. user_game_sets
```sql
CREATE TABLE user_game_sets (
  id BIGSERIAL PRIMARY KEY,
  set_uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_id INT NOT NULL REFERENCES word_sets(id),
  game_type_id INT NOT NULL REFERENCES game_types(id),
  level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 5),

  -- Scores
  set_score INT NOT NULL,
  normalized_score INT NOT NULL CHECK (normalized_score BETWEEN 0 AND 1000),
  
  -- Breakdown
  base_total INT NOT NULL,
  speed_bonus_total INT NOT NULL,
  combo_bonus_total INT NOT NULL,
  penalty_total INT NOT NULL,
  
  -- Metrics
  correct_answers SMALLINT NOT NULL,
  wrong_answers SMALLINT NOT NULL,
  max_combo SMALLINT NOT NULL,
  avg_response_time REAL NOT NULL,
  accuracy_percentage REAL NOT NULL,
  
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, set_id)
);

-- Indexes for leaderboards
CREATE INDEX idx_sets_game_lb 
  ON user_game_sets (game_type_id, normalized_score DESC, completed_at DESC);

CREATE INDEX idx_sets_global_lb 
  ON user_game_sets (normalized_score DESC, completed_at DESC);

CREATE INDEX idx_sets_user 
  ON user_game_sets (user_id, completed_at DESC);
```

#### 6. user_game_set_questions (Optional but recommended)
```sql
CREATE TABLE user_game_set_questions (
  id BIGSERIAL PRIMARY KEY,
  set_uuid UUID NOT NULL REFERENCES user_game_sets(set_uuid) ON DELETE CASCADE,
  question_no SMALLINT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_used_ms INT,
  speed_bonus INT NOT NULL,
  combo_bonus INT NOT NULL,
  penalty INT NOT NULL,
  base_points INT NOT NULL,
  difficulty_multiplier REAL NOT NULL,
  question_score INT NOT NULL,
  question_payload JSONB,
  
  UNIQUE(set_uuid, question_no)
);

CREATE INDEX idx_set_questions 
  ON user_game_set_questions(set_uuid);
```

#### 7. user_set_progress
```sql
CREATE TABLE user_set_progress (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  set_id INT NOT NULL REFERENCES word_sets(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, set_id)
);
```

#### 8. badges
```sql
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  badge_code VARCHAR(100) UNIQUE NOT NULL,
  badge_type VARCHAR(50) NOT NULL CHECK (badge_type IN ('streak', 'achievement', 'rank', 'milestone')),
  badge_name_tr VARCHAR(200) NOT NULL,
  badge_name_en VARCHAR(200) NOT NULL,
  badge_description_tr TEXT,
  badge_description_en TEXT,
  icon_url VARCHAR(500),
  rarity VARCHAR(50) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  criteria JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data (initial badges)
INSERT INTO badges (badge_code, badge_type, badge_name_tr, badge_name_en, rarity, criteria) VALUES
  ('first_game', 'achievement', 'Ä°lk Oyun', 'First Game', 'common', '{"type": "games_completed", "count": 1}'),
  ('streak_3_days', 'streak', '3 GÃ¼nlÃ¼k Seri', '3 Day Streak', 'common', '{"type": "streak", "days": 3}'),
  ('streak_7_days', 'streak', '7 GÃ¼nlÃ¼k Seri', '7 Day Streak', 'rare', '{"type": "streak", "days": 7}'),
  ('perfect_game', 'achievement', 'MÃ¼kemmel Oyun', 'Perfect Game', 'rare', '{"type": "perfect_score", "correct_answers": 10}'),
  ('sets_10', 'achievement', '10 Set TamamladÄ±', '10 Sets Completed', 'common', '{"type": "games_completed", "count": 10}');
```

#### 9. user_badges
```sql
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges 
  ON user_badges(user_id, earned_at DESC);
```

#### 10. user_login_streaks
```sql
CREATE TABLE user_login_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  current_streak INT DEFAULT 1,
  longest_streak INT DEFAULT 1,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, login_date)
);

CREATE INDEX idx_streaks_user 
  ON user_login_streaks(user_id, login_date DESC);
```

#### 11. admin_keys
```sql
CREATE TABLE admin_keys (
  id SERIAL PRIMARY KEY,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  key_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used TIMESTAMPTZ
);

-- Seed data (ilk admin key)
-- Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
INSERT INTO admin_keys (api_key, key_name, is_active) VALUES
  ('YOUR_GENERATED_KEY_HERE', 'Master Admin Key', true);
```

---

### Views

#### Global Leaderboard View
```sql
CREATE VIEW v_global_leaderboard AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.email,
  ugs.normalized_score,
  ugs.set_score,
  gt.game_name_en as game,
  ugs.level,
  ugs.completed_at,
  ROW_NUMBER() OVER (ORDER BY ugs.normalized_score DESC, ugs.completed_at ASC) as rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.normalized_score DESC, ugs.completed_at ASC;
```

#### Game-Specific Leaderboard View
```sql
CREATE VIEW v_game_leaderboard AS
SELECT 
  u.id as user_id,
  u.display_name,
  u.email,
  ugs.game_type_id,
  gt.game_name_en as game,
  ugs.level,
  ugs.set_score,
  ugs.normalized_score,
  ugs.completed_at,
  ROW_NUMBER() OVER (
    PARTITION BY ugs.game_type_id, ugs.level 
    ORDER BY ugs.set_score DESC, ugs.completed_at ASC
  ) as rank
FROM user_game_sets ugs
JOIN users u ON ugs.user_id = u.id
JOIN game_types gt ON ugs.game_type_id = gt.id
ORDER BY ugs.game_type_id, ugs.level, ugs.set_score DESC;
```

---

### Functions

#### Update Login Streak
```sql
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id UUID)
RETURNS TABLE(current_streak INT, longest_streak INT) AS $$
DECLARE
  v_last_login DATE;
  v_current_streak INT;
  v_longest_streak INT;
BEGIN
  -- Get last login
  SELECT login_date, user_login_streaks.current_streak, user_login_streaks.longest_streak
  INTO v_last_login, v_current_streak, v_longest_streak
  FROM user_login_streaks
  WHERE user_id = p_user_id
  ORDER BY login_date DESC
  LIMIT 1;

  -- If no previous login
  IF v_last_login IS NULL THEN
    INSERT INTO user_login_streaks (user_id, login_date, current_streak, longest_streak)
    VALUES (p_user_id, CURRENT_DATE, 1, 1);
    RETURN QUERY SELECT 1, 1;
    RETURN;
  END IF;

  -- If already logged in today
  IF v_last_login = CURRENT_DATE THEN
    RETURN QUERY SELECT v_current_streak, v_longest_streak;
    RETURN;
  END IF;

  -- If consecutive day
  IF v_last_login = CURRENT_DATE - 1 THEN
    v_current_streak := v_current_streak + 1;
    v_longest_streak := GREATEST(v_current_streak, v_longest_streak);
  ELSE
    -- Streak broken
    v_current_streak := 1;
  END IF;

  -- Insert new record
  INSERT INTO user_login_streaks (user_id, login_date, current_streak, longest_streak)
  VALUES (p_user_id, CURRENT_DATE, v_current_streak, v_longest_streak);

  RETURN QUERY SELECT v_current_streak, v_longest_streak;
END;
$$ LANGUAGE plpgsql;
```

#### Check and Award Badges
```sql
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id INT, badge_code VARCHAR) AS $$
DECLARE
  v_badge RECORD;
  v_criteria JSONB;
  v_earned BOOLEAN;
BEGIN
  -- Loop through active badges
  FOR v_badge IN 
    SELECT b.id, b.badge_code, b.badge_type, b.criteria
    FROM badges b
    WHERE b.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = p_user_id AND ub.badge_id = b.id
    )
  LOOP
    v_criteria := v_badge.criteria;
    v_earned := false;

    -- Check criteria based on type
    IF v_badge.badge_type = 'achievement' THEN
      -- Games completed check
      IF v_criteria->>'type' = 'games_completed' THEN
        SELECT COUNT(*) >= (v_criteria->>'count')::INT INTO v_earned
        FROM user_game_sets
        WHERE user_id = p_user_id;
      END IF;

      -- Perfect score check
      IF v_criteria->>'type' = 'perfect_score' THEN
        SELECT EXISTS (
          SELECT 1 FROM user_game_sets
          WHERE user_id = p_user_id 
          AND correct_answers = (v_criteria->>'correct_answers')::INT
        ) INTO v_earned;
      END IF;
    END IF;

    IF v_badge.badge_type = 'streak' THEN
      SELECT COALESCE(MAX(current_streak), 0) >= (v_criteria->>'days')::INT INTO v_earned
      FROM user_login_streaks
      WHERE user_id = p_user_id;
    END IF;

    -- Award badge if earned
    IF v_earned THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT DO NOTHING;
      
      RETURN QUERY SELECT v_badge.id, v_badge.badge_code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## ðŸ“ DOSYA YAPISI

```
/
â”œâ”€â”€ index.html                    # Landing / Game selection
â”œâ”€â”€ leaderboard.html              # Global leaderboard
â”œâ”€â”€ profile.html                  # User profile
â”œâ”€â”€ badges.html                   # Badge collection
â”‚
â”œâ”€â”€ /games
â”‚   â”œâ”€â”€ der-die-dash.html
â”‚   â”œâ”€â”€ case-control.html
â”‚   â”œâ”€â”€ word-salad.html
â”‚   â”œâ”€â”€ translation-quest.html
â”‚   â””â”€â”€ five-letter-blitz.html
â”‚
â”œâ”€â”€ /admin
â”‚   â”œâ”€â”€ index.html                # Admin login
â”‚   â”œâ”€â”€ dashboard.html            # Stats dashboard
â”‚   â”œâ”€â”€ sets.html                 # Set management
â”‚   â”œâ”€â”€ badges.html               # Badge management
â”‚   â””â”€â”€ games.html                # Game type management
â”‚
â”œâ”€â”€ /css
â”‚   â”œâ”€â”€ main.css                  # Global styles + variables
â”‚   â”œâ”€â”€ games.css                 # Game-specific styles
â”‚   â”œâ”€â”€ admin.css                 # Admin panel styles
â”‚   â””â”€â”€ animations.css            # Animation keyframes
â”‚
â”œâ”€â”€ /js
â”‚   â”œâ”€â”€ /core
â”‚   â”‚   â”œâ”€â”€ supabase.js          # Supabase client
â”‚   â”‚   â”œâ”€â”€ auth.js              # Authentication
â”‚   â”‚   â”œâ”€â”€ scoring.js           # Scoring engine
â”‚   â”‚   â”œâ”€â”€ timer.js             # Timer component
â”‚   â”‚   â”œâ”€â”€ combo.js             # Combo system
â”‚   â”‚   â”œâ”€â”€ animations.js        # Animation helpers
â”‚   â”‚   â””â”€â”€ i18n.js              # Language system
â”‚   â”‚
â”‚   â”œâ”€â”€ /games
â”‚   â”‚   â”œâ”€â”€ der-die-dash.js
â”‚   â”‚   â”œâ”€â”€ case-control.js
â”‚   â”‚   â”œâ”€â”€ word-salad.js
â”‚   â”‚   â”œâ”€â”€ translation-quest.js
â”‚   â”‚   â””â”€â”€ five-letter-blitz.js
â”‚   â”‚
â”‚   â”œâ”€â”€ /admin
â”‚   â”‚   â”œâ”€â”€ auth.js              # Admin auth
â”‚   â”‚   â”œâ”€â”€ dashboard.js
â”‚   â”‚   â”œâ”€â”€ sets.js
â”‚   â”‚   â”œâ”€â”€ badges.js
â”‚   â”‚   â””â”€â”€ games.js
â”‚   â”‚
â”‚   â”œâ”€â”€ registry.js               # Game registry
â”‚   â”œâ”€â”€ leaderboard.js           # Leaderboard logic
â”‚   â””â”€â”€ app.js                   # Main app orchestrator
â”‚
â”œâ”€â”€ /assets
â”‚   â”œâ”€â”€ /images
â”‚   â”‚   â”œâ”€â”€ logo.png             # Main logo
â”‚   â”‚   â”œâ”€â”€ logo-small.png       # Small version
â”‚   â”‚   â””â”€â”€ favicon.ico
â”‚   â””â”€â”€ /sounds                  # (v2.0)
â”‚
â”œâ”€â”€ /sql
â”‚   â”œâ”€â”€ 01_schema.sql            # All tables
â”‚   â”œâ”€â”€ 02_views.sql             # Leaderboard views
â”‚   â”œâ”€â”€ 03_functions.sql         # Stored procedures
â”‚   â””â”€â”€ 04_seed_data.sql         # Initial data
â”‚
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ vercel.json
â”œâ”€â”€ package.json                 # (if needed)
â””â”€â”€ README.md
```

---

## ðŸ” AUTHENTICATION SYSTEM

### Supabase Auth

#### Methods
1. **Google OAuth** âœ…
2. **Email/Password** âœ…

#### Configuration
- Email confirmation: **DISABLED**
- Session duration: 7 days
- Auto-refresh: Enabled

#### Guest Mode
- Demo oyun oynanabilir
- Skor kaydedilmez
- Login teÅŸviki gÃ¶sterilir

---

### Frontend Auth Flow

```javascript
// auth.js

import { supabase } from './supabase.js';

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  
  if (error) throw error;
  return data;
}

export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Update last_login
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', data.user.id);
  
  // Update login streak
  await supabase.rpc('update_login_streak', { p_user_id: data.user.id });
  
  return data;
}

export async function signUpWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
  
  if (error) throw error;
  
  // Create user record
  await supabase
    .from('users')
    .insert({
      id: data.user.id,
      email: email,
      display_name: displayName,
      auth_provider: 'supabase'
    });
  
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
```

---

### Protected Routes

```javascript
// Route protection
async function requireAuth() {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    // Store intended destination
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = '/index.html?showLogin=true';
  }
}

// Call on game pages
document.addEventListener('DOMContentLoaded', async () => {
  await requireAuth();
  // ... rest of game logic
});
```

---

## ðŸ›¡ï¸ ADMIN PANEL

### Authentication

**Simple API Key Auth:**

```javascript
// admin/auth.js

const ADMIN_KEY_STORAGE = 'admin_api_key';

export async function adminLogin(apiKey) {
  // Verify key with Supabase
  const { data, error } = await supabase
    .from('admin_keys')
    .select('*')
    .eq('api_key', apiKey)
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    throw new Error('Invalid API key');
  }
  
  // Update last used
  await supabase
    .from('admin_keys')
    .update({ last_used: new Date().toISOString() })
    .eq('api_key', apiKey);
  
  // Store in sessionStorage (not localStorage for security)
  sessionStorage.setItem(ADMIN_KEY_STORAGE, apiKey);
  
  return true;
}

export function isAdminAuthenticated() {
  return !!sessionStorage.getItem(ADMIN_KEY_STORAGE);
}

export function adminLogout() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE);
  window.location.href = '/admin/index.html';
}

export function getAdminKey() {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE);
}
```

---

### Admin Panel Pages

#### 1. Dashboard
```
- Total users
- Total games played (per game type)
- Recent activity
- Top players
- Badge distribution chart
```

#### 2. Set Management
```
Features:
- List all sets (filterable by game type & level)
- Create new set (manual or CSV upload)
- Edit existing set
- Delete set
- Preview questions
- Mark as demo
```

**CSV Format:**
```csv
game_type,level,set_number,question_data
der_die_dash,1,1,"{""word"":""Tisch"",""correct_article"":""der""}"
der_die_dash,1,1,"{""word"":""TÃ¼r"",""correct_article"":""die""}"
```

#### 3. Badge Management
```
Features:
- List all badges
- Create new badge (with criteria builder)
- Edit badge
- Activate/deactivate badge
- Manual award to user
- Badge statistics (how many users earned)
```

#### 4. Game Type Management
```
Features:
- View all game types
- Edit timer/base score
- Activate/deactivate game
- View total sets per game
```

---

### Admin UI Example

```html
<!-- admin/sets.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Set Management - Admin</title>
  <link rel="stylesheet" href="/css/admin.css">
</head>
<body>
  <div class="admin-container">
    <aside class="admin-sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <a href="dashboard.html">Dashboard</a>
        <a href="sets.html" class="active">Sets</a>
        <a href="badges.html">Badges</a>
        <a href="games.html">Games</a>
        <button onclick="adminLogout()">Logout</button>
      </nav>
    </aside>
    
    <main class="admin-content">
      <header>
        <h1>Set Management</h1>
        <button onclick="showCreateSetModal()">+ New Set</button>
      </header>
      
      <div class="filters">
        <select id="gameFilter">
          <option value="">All Games</option>
          <option value="der_die_dash">Der Die Dash</option>
          <option value="case_control">Case Control</option>
          <!-- ... -->
        </select>
        
        <select id="levelFilter">
          <option value="">All Levels</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <!-- ... -->
        </select>
      </div>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game</th>
            <th>Set #</th>
            <th>Level</th>
            <th>Questions</th>
            <th>Demo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="setsTableBody">
          <!-- Dynamically populated -->
        </tbody>
      </table>
    </main>
  </div>
  
  <script type="module" src="/js/admin/sets.js"></script>
</body>
</html>
```

---

## ðŸŽ¨ UI/UX GUIDELINES

### Color Palette (Logo Colors)

```css
:root {
  /* Primary colors from logo */
  --color-red: #FF4444;      /* der */
  --color-blue: #4444FF;     /* die */
  --color-yellow: #FFD700;   /* das */
  --color-green: #44FF44;    /* .space */
  
  /* Neutrals */
  --color-dark: #2a2a2a;
  --color-light: #f5f5f5;
  --color-gray: #666666;
  
  /* Semantic */
  --color-correct: #2ecc71;
  --color-wrong: #e74c3c;
  --color-warning: #f39c12;
  
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-dark: #1a1a1a;
  
  /* Text */
  --text-primary: #2a2a2a;
  --text-secondary: #666666;
  --text-light: #999999;
  
  /* Borders */
  --border-color: #e0e0e0;
  --border-radius: 12px;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

---

### Typography

```css
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 2rem;       /* 32px */
  --text-4xl: 2.5rem;     /* 40px */
}

body {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--text-primary);
}

h1 {
  font-size: var(--text-4xl);
  font-weight: 700;
  line-height: 1.2;
}

h2 {
  font-size: var(--text-3xl);
  font-weight: 600;
}

h3 {
  font-size: var(--text-2xl);
  font-weight: 600;
}
```

---

### Responsive Breakpoints

```css
:root {
  --breakpoint-mobile: 320px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;
}

/* Mobile first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

### Button Styles

```css
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--text-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: var(--color-blue);
  color: white;
}

.btn-secondary {
  background: var(--color-gray);
  color: white;
}

.btn-success {
  background: var(--color-correct);
  color: white;
}

.btn-danger {
  background: var(--color-wrong);
  color: white;
}

/* Artikel buttons */
.btn-der {
  background: var(--color-red);
  color: white;
}

.btn-die {
  background: var(--color-blue);
  color: white;
}

.btn-das {
  background: var(--color-yellow);
  color: var(--color-dark);
}
```

---

### Card Component

```css
.card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.card-header {
  font-size: var(--text-xl);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.card-body {
  /* content */
}

.card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

---

### Game Selection Grid

```css
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.game-card {
  background: var(--bg-primary);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 3px solid transparent;
}

.game-card:hover {
  border-color: var(--color-blue);
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.game-card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.game-card-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.game-card-description {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: 1rem;
}

.game-card-meta {
  display: flex;
  justify-content: space-around;
  font-size: var(--text-xs);
  color: var(--text-light);
}
```

---

## ðŸŒ DÄ°L SÄ°STEMÄ°

### Desteklenen Diller
- ðŸ‡¹ðŸ‡· TÃ¼rkÃ§e (tr)
- ðŸ‡¬ðŸ‡§ Ä°ngilizce (en)

### Language Structure

```javascript
// i18n.js

const translations = {
  tr: {
    // Common
    start: 'BaÅŸla',
    login: 'GiriÅŸ Yap',
    logout: 'Ã‡Ä±kÄ±ÅŸ',
    register: 'KayÄ±t Ol',
    cancel: 'Ä°ptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'DÃ¼zenle',
    close: 'Kapat',
    back: 'Geri',
    next: 'Sonraki',
    submit: 'GÃ¶nder',
    loading: 'YÃ¼kleniyor...',
    
    // Game UI
    correct: 'DoÄŸru!',
    wrong: 'YanlÄ±ÅŸ!',
    timeUp: 'SÃ¼re Doldu!',
    score: 'Skor',
    combo: 'Combo',
    question: 'Soru',
    of: '/',
    seconds: 'saniye',
    
    // Set Summary
    setComplete: 'Set TamamlandÄ±!',
    yourScore: 'Skorunuz',
    correctAnswers: 'DoÄŸru Cevaplar',
    wrongAnswers: 'YanlÄ±ÅŸ Cevaplar',
    maxCombo: 'Max Combo',
    avgTime: 'Ortalama SÃ¼re',
    accuracy: 'DoÄŸruluk',
    speedBonus: 'HÄ±z Bonusu',
    comboBonus: 'Combo Bonusu',
    penalty: 'Ceza',
    baseScore: 'Temel Puan',
    normalizedScore: 'Normalized Skor',
    globalRank: 'Global SÄ±ralama',
    backToHome: 'Ana Sayfaya DÃ¶n',
    viewLeaderboard: 'Skor Tablosunu GÃ¶r',
    
    // Leaderboard
    leaderboard: 'Skor Tablosu',
    rank: 'SÄ±ra',
    player: 'Oyuncu',
    game: 'Oyun',
    level: 'Seviye',
    globalLeaderboard: 'Global Liderlik',
    gameLeaderboard: 'Oyun LiderliÄŸi',
    
    // Levels
    level1: 'Kolay',
    level2: 'Orta-Kolay',
    level3: 'Orta',
    level4: 'Zor',
    level5: 'Ã‡ok Zor',
    
    // Games
    derDieDash: 'Der Die Dash',
    caseControl: 'Case Control',
    wordSalad: 'Word Salad',
    translationQuest: 'Translation Quest',
    fiveLetterBlitz: '5-Letter Blitz',
    
    // Badges
    badges: 'Rozetler',
    earnedBadges: 'KazanÄ±lan Rozetler',
    newBadge: 'Yeni Rozet!',
    badgeEarned: 'Rozet KazandÄ±n!',
    
    // Errors
    errorGeneric: 'Bir hata oluÅŸtu',
    errorNetwork: 'BaÄŸlantÄ± hatasÄ±',
    errorAuth: 'Kimlik doÄŸrulama hatasÄ±',
    errorInvalidInput: 'GeÃ§ersiz giriÅŸ',
    
    // Auth
    emailPlaceholder: 'E-posta adresiniz',
    passwordPlaceholder: 'Åžifreniz',
    displayNamePlaceholder: 'AdÄ±nÄ±z',
    loginWithGoogle: 'Google ile GiriÅŸ',
    loginWithEmail: 'E-posta ile GiriÅŸ',
    dontHaveAccount: 'HesabÄ±nÄ±z yok mu?',
    alreadyHaveAccount: 'Zaten hesabÄ±nÄ±z var mÄ±?',
    
    // Demo
    demoMode: 'Demo Modu',
    demoMessage: 'KayÄ±t olmadan oynuyorsunuz. Skorunuz kaydedilmeyecek.',
    registerToSave: 'Skorunuzu kaydetmek iÃ§in kayÄ±t olun',
  },
  
  en: {
    // Common
    start: 'Start',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Game UI
    correct: 'Correct!',
    wrong: 'Wrong!',
    timeUp: 'Time\'s Up!',
    score: 'Score',
    combo: 'Combo',
    question: 'Question',
    of: 'of',
    seconds: 'seconds',
    
    // Set Summary
    setComplete: 'Set Complete!',
    yourScore: 'Your Score',
    correctAnswers: 'Correct Answers',
    wrongAnswers: 'Wrong Answers',
    maxCombo: 'Max Combo',
    avgTime: 'Average Time',
    accuracy: 'Accuracy',
    speedBonus: 'Speed Bonus',
    comboBonus: 'Combo Bonus',
    penalty: 'Penalty',
    baseScore: 'Base Score',
    normalizedScore: 'Normalized Score',
    globalRank: 'Global Rank',
    backToHome: 'Back to Home',
    viewLeaderboard: 'View Leaderboard',
    
    // Leaderboard
    leaderboard: 'Leaderboard',
    rank: 'Rank',
    player: 'Player',
    game: 'Game',
    level: 'Level',
    globalLeaderboard: 'Global Leaderboard',
    gameLeaderboard: 'Game Leaderboard',
    
    // Levels
    level1: 'Easy',
    level2: 'Medium-Easy',
    level3: 'Medium',
    level4: 'Hard',
    level5: 'Very Hard',
    
    // Games
    derDieDash: 'Der Die Dash',
    caseControl: 'Case Control',
    wordSalad: 'Word Salad',
    translationQuest: 'Translation Quest',
    fiveLetterBlitz: '5-Letter Blitz',
    
    // Badges
    badges: 'Badges',
    earnedBadges: 'Earned Badges',
    newBadge: 'New Badge!',
    badgeEarned: 'Badge Earned!',
    
    // Errors
    errorGeneric: 'An error occurred',
    errorNetwork: 'Network error',
    errorAuth: 'Authentication error',
    errorInvalidInput: 'Invalid input',
    
    // Auth
    emailPlaceholder: 'Your email',
    passwordPlaceholder: 'Your password',
    displayNamePlaceholder: 'Your name',
    loginWithGoogle: 'Login with Google',
    loginWithEmail: 'Login with Email',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    
    // Demo
    demoMode: 'Demo Mode',
    demoMessage: 'Playing without registration. Your score won\'t be saved.',
    registerToSave: 'Register to save your score',
  }
};

let currentLang = localStorage.getItem('language') || 'tr';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageTranslations();
  }
}

export function t(key) {
  return translations[currentLang][key] || key;
}

export function getCurrentLanguage() {
  return currentLang;
}

function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// Auto-update on page load
document.addEventListener('DOMContentLoaded', updatePageTranslations);
```

---

### Usage in HTML

```html
<button data-i18n="start">BaÅŸla</button>
<input type="email" data-i18n-placeholder="emailPlaceholder" />
<h1 data-i18n="leaderboard">Skor Tablosu</h1>
```

---

## ðŸ† LEADERBOARD SYSTEM

### Types

1. **Global Leaderboard** - TÃ¼m oyunlar, normalized score
2. **Game-Specific** - Oyun+level bazÄ±nda, raw score
3. **Time-Based** - Last 7 days, Last 30 days, All-time

---

### Real-Time + Cache Hybrid

```javascript
// leaderboard.js

let leaderboardCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getGlobalLeaderboard(limit = 100, forceRefresh = false) {
  // Check cache
  if (!forceRefresh && leaderboardCache && cacheTimestamp) {
    const age = Date.now() - cacheTimestamp;
    if (age < CACHE_DURATION) {
      return leaderboardCache;
    }
  }
  
  // Fetch fresh data
  const { data, error } = await supabase
    .from('v_global_leaderboard')
    .select('*')
    .limit(limit);
  
  if (error) throw error;
  
  // Update cache
  leaderboardCache = data;
  cacheTimestamp = Date.now();
  
  return data;
}

export async function getGameLeaderboard(gameTypeId, level, limit = 100) {
  const { data, error } = await supabase
    .from('v_game_leaderboard')
    .select('*')
    .eq('game_type_id', gameTypeId)
    .eq('level', level)
    .limit(limit);
  
  if (error) throw error;
  return data;
}

export async function getUserRank(userId) {
  const { data, error } = await supabase
    .from('v_global_leaderboard')
    .select('rank')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data.rank;
}

// Auto-refresh every 30 seconds on leaderboard page
let refreshInterval = null;

export function startAutoRefresh() {
  if (refreshInterval) return;
  
  refreshInterval = setInterval(async () => {
    await getGlobalLeaderboard(100, true);
    renderLeaderboard();
  }, 30000);
}

export function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
```

---

## ðŸŽ–ï¸ BADGE SYSTEM

### Badge Types

1. **Streak** - Login streaks
2. **Achievement** - Game milestones
3. **Rank** - Leaderboard positions
4. **Milestone** - Special achievements

---

### Auto-Award Logic

```javascript
// Called after:
// - Login (streak badges)
// - Set complete (achievement badges)
// - Score save (rank badges)

export async function checkAndAwardBadges(userId) {
  const { data, error } = await supabase
    .rpc('check_and_award_badges', { p_user_id: userId });
  
  if (error) {
    console.error('Badge check error:', error);
    return [];
  }
  
  // Show badge notification for each earned
  if (data && data.length > 0) {
    for (const badge of data) {
      await showBadgeNotification(badge);
    }
  }
  
  return data;
}

async function showBadgeNotification(badge) {
  // Fetch badge details
  const { data } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badge.badge_id)
    .single();
  
  if (!data) return;
  
  // Show animated modal
  const modal = document.createElement('div');
  modal.className = 'badge-notification';
  modal.innerHTML = `
    <div class="badge-modal">
      <div class="badge-glow"></div>
      <div class="badge-icon">${data.icon_url || 'ðŸ†'}</div>
      <h2>${t('newBadge')}</h2>
      <h3>${getCurrentLanguage() === 'tr' ? data.badge_name_tr : data.badge_name_en}</h3>
      <p>${getCurrentLanguage() === 'tr' ? data.badge_description_tr : data.badge_description_en}</p>
      <div class="badge-rarity ${data.rarity}">${data.rarity}</div>
      <button onclick="this.closest('.badge-notification').remove()">${t('close')}</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    modal.remove();
  }, 5000);
}
```

---

## ðŸŽ® DEMO MODE

### Rules

- No registration required
- Can play 1 demo set per game (5 total)
- Scores not saved
- No badges earned
- "Register to save score" message after set

---

### Implementation

```javascript
// demo.js

export function isDemoMode() {
  return !isAuthenticated();
}

export async function canPlayDemoSet(gameTypeId) {
  const playedKey = `demo_played_${gameTypeId}`;
  return !localStorage.getItem(playedKey);
}

export function markDemoPlayed(gameTypeId) {
  const playedKey = `demo_played_${gameTypeId}`;
  localStorage.setItem(playedKey, 'true');
}

export async function loadDemoSet(gameTypeId) {
  const { data, error } = await supabase
    .from('word_sets')
    .select(`
      *,
      questions (*)
    `)
    .eq('game_type_id', gameTypeId)
    .eq('is_demo', true)
    .single();
  
  if (error) throw error;
  return data;
}
```

---

## âœ¨ ANIMASYONLAR

### DoÄŸru Cevap

```css
@keyframes correctPulse {
  0% {
    transform: scale(1);
    background: var(--color-correct);
  }
  50% {
    transform: scale(1.1);
    background: #27ae60;
  }
  100% {
    transform: scale(1);
    background: var(--color-correct);
  }
}

.answer-correct {
  animation: correctPulse 0.5s ease;
}

.confetti-burst {
  /* Particle system or CSS confetti */
}
```

---

### YanlÄ±ÅŸ Cevap

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes flashRed {
  0%, 100% { background: transparent; }
  50% { background: rgba(231, 76, 60, 0.3); }
}

.answer-wrong {
  animation: shake 0.5s ease, flashRed 0.5s ease;
}
```

---

### Combo Animation

```css
@keyframes comboAppear {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@keyframes comboPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.combo-indicator {
  animation: comboAppear 0.3s ease, comboPulse 1s ease infinite;
  background: linear-gradient(135deg, #f39c12, #e74c3c);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 2rem;
  font-weight: bold;
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.combo-indicator::before {
  content: 'ðŸ”¥';
  margin-right: 0.5rem;
}
```

---

### Set Complete Modal

```css
@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.set-complete-modal {
  animation: modalSlideIn 0.5s ease;
  background: white;
  padding: 3rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  margin: 2rem auto;
}
```

---

## ðŸ“ CODE STYLE GUIDE

### JavaScript

```javascript
// Use const/let, not var
const MAX_TIME = 5;
let currentScore = 0;

// Named functions for clarity
async function calculateScore(params) {
  // ...
}

// Arrow functions for callbacks
const handleClick = () => {
  // ...
};

// Destructuring
const { userId, gameType } = params;

// Template literals
const message = `Score: ${score}`;

// Async/await over promises
async function fetchData() {
  try {
    const data = await supabase.from('table').select();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Comments in Turkish for clarity
// KullanÄ±cÄ±nÄ±n skorunu hesapla
function calculateUserScore() {
  // ...
}
```

---

### CSS

```css
/* BEM-like naming */
.game-card { }
.game-card__title { }
.game-card__description { }
.game-card--active { }

/* Group related properties */
.element {
  /* Positioning */
  position: relative;
  top: 0;
  left: 0;
  
  /* Display & Box Model */
  display: flex;
  width: 100%;
  padding: 1rem;
  margin: 0;
  
  /* Visual */
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  
  /* Typography */
  font-size: 1rem;
  color: #333;
  
  /* Misc */
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Use CSS variables */
.button {
  background: var(--color-primary);
  color: var(--text-light);
}
```

---

### HTML

```html
<!-- Semantic HTML -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <section class="game-section">
    <article class="game-card">
      <!-- ... -->
    </article>
  </section>
</main>

<footer>
  <!-- ... -->
</footer>

<!-- Data attributes for JS -->
<button data-game-id="1" data-action="start">Start</button>

<!-- Accessibility -->
<button aria-label="Close modal" onclick="closeModal()">
  <span aria-hidden="true">&times;</span>
</button>

<!-- i18n -->
<h1 data-i18n="title">Title</h1>
```

---

## âœ… TESTING CHECKLIST

### Functional Tests

#### Authentication
- [ ] Google OAuth login
- [ ] Email/password login
- [ ] Email/password registration
- [ ] Logout
- [ ] Session persistence
- [ ] Auto-login on return

#### Demo Mode
- [ ] Play without login
- [ ] Score not saved
- [ ] Register prompt shown
- [ ] Demo limit enforced

#### Games - Der Die Dash
- [ ] Timer works (5s)
- [ ] Correct answer feedback
- [ ] Wrong answer feedback
- [ ] Score calculation correct
- [ ] Combo system works
- [ ] Set completes at 10 questions
- [ ] Can't replay same set

#### Games - Case Control
- [ ] 3 options rendered correctly
- [ ] Preposition + word display
- [ ] Correct form validation
- [ ] (Same as above for timer/score/combo)

#### Games - Word Salad
- [ ] 10 scrambled words shown
- [ ] Click or drag to reorder
- [ ] GO button checks answer
- [ ] RESET button works
- [ ] 20 second timer
- [ ] Wrong answer allows retry

#### Games - Translation Quest
- [ ] UI language affects options (TR vs EN)
- [ ] 4 options rendered
- [ ] Correct translation validated
- [ ] 8 second timer

#### Games - 5-Letter Blitz
- [ ] Only 5 letters shown
- [ ] Click to add to top box
- [ ] OK button validates
- [ ] RESET clears selection
- [ ] 10 second timer

#### Scoring System
- [ ] Base score correct per game
- [ ] Difficulty multiplier applied
- [ ] Speed bonus calculated correctly
- [ ] Combo bonus works (3-5 streak)
- [ ] Wrong penalty applied
- [ ] Perfect set bonus (+50)
- [ ] Normalized score accurate

#### Leaderboard
- [ ] Global leaderboard shows all games
- [ ] Game-specific leaderboard filters
- [ ] User's rank highlighted
- [ ] Auto-refresh works (30s)
- [ ] Cache works (5 min)

#### Badge System
- [ ] Login streak badge awarded
- [ ] Achievement badge awarded
- [ ] Badge notification shown
- [ ] Badge collection page accurate
- [ ] No duplicate badges

#### Admin Panel
- [ ] API key login works
- [ ] Dashboard stats accurate
- [ ] Set CRUD operations work
- [ ] CSV upload works
- [ ] Badge CRUD operations work
- [ ] Game type management works

---

### Cross-Browser Tests
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

### Responsive Tests
- [ ] Mobile (320px-767px)
- [ ] Tablet (768px-1023px)
- [ ] Desktop (1024px+)
- [ ] Wide screen (1440px+)

---

### Performance Tests
- [ ] Page load < 2s
- [ ] First contentful paint < 1s
- [ ] Time to interactive < 3s
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] Alt text on images
- [ ] Semantic HTML used

---

## ðŸš€ DEPLOYMENT

### Vercel Setup

#### 1. Environment Variables
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

#### 2. vercel.json
```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "devCommand": null,
  "installCommand": null,
  "framework": null,
  "rewrites": [
    {
      "source": "/admin/:path*",
      "destination": "/admin/:path*"
    }
  ],
  "headers": [
    {
      "source": "/assets/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3. GitHub Integration
- Push to main branch â†’ Auto-deploy
- Pull requests â†’ Preview deployments

---

### Supabase Setup

#### 1. Create Project
```
1. Go to supabase.com
2. New project
3. Choose region (closest to users)
4. Set strong password
```

#### 2. Run SQL Scripts
```sql
-- In Supabase SQL Editor:
-- Run in order:
1. 01_schema.sql
2. 02_views.sql
3. 03_functions.sql
4. 04_seed_data.sql
```

#### 3. Configure Auth
```
Authentication â†’ Settings:
- Enable Email/Password
- Enable Google OAuth
- Disable email confirmation
- Set site URL
- Set redirect URLs
```

#### 4. Set RLS Policies
```sql
-- Example for user_game_sets
ALTER TABLE user_game_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scores"
  ON user_game_sets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON user_game_sets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Everyone can read leaderboards
CREATE POLICY "Anyone can read leaderboards"
  ON user_game_sets FOR SELECT
  USING (true);
```

---

### Pre-Launch Checklist

- [ ] All SQL scripts run successfully
- [ ] Seed data inserted
- [ ] Admin API key generated and saved
- [ ] Supabase auth configured
- [ ] Google OAuth credentials set
- [ ] Environment variables in Vercel
- [ ] Domain connected
- [ ] SSL certificate active
- [ ] All pages load correctly
- [ ] Demo mode works
- [ ] At least 1 demo set per game
- [ ] Tested on mobile device
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (optional)

---

## ðŸŽ¯ SCOPE SUMMARY

### v1.0 Includes:
âœ… 5 playable games (full implementations)
âœ… Unified scoring system
âœ… Global + game-specific leaderboards
âœ… Badge system (parametric)
âœ… Admin panel (API key auth)
âœ… Demo mode
âœ… 2 languages (TR/EN)
âœ… Responsive design
âœ… Authentication (Google + Email)
âœ… Set summary with detailed stats
âœ… Combo system
âœ… Animations (correct/wrong/combo)

### v1.0 Excludes:
âŒ Sound effects (v1.5)
âŒ Adaptive difficulty (v2.0)
âŒ Elo ranking (v2.0)
âŒ Multiplayer (v3.0)
âŒ Mobile app (v3.0)

---

## ðŸ“Š DELIVERABLES

### What to Create:

1. **SQL Files** (4 files in /sql/)
2. **HTML Pages** (14+ pages)
3. **CSS Files** (4 files in /css/)
4. **JavaScript Files** (20+ files in /js/)
5. **Assets** (logo, favicon)
6. **Config Files** (.env.example, vercel.json)
7. **Documentation** (README.md, SETUP.md)

### Placeholder Data:

**Demo Sets** (AI to generate):
- 1 demo set per game = 5 sets
- 10 questions each = 50 questions total
- Use simple/common German words
- Realistic wrong options

**Initial Badges** (in seed data):
- first_game
- streak_3_days
- streak_7_days
- perfect_game
- sets_10

---

## ðŸŽ¯ SUCCESS CRITERIA

**v1.0 is complete when:**

âœ… User can register/login
âœ… User can play all 5 games (demo without login)
âœ… Scores are calculated correctly
âœ… Leaderboards work (global + game-specific)
âœ… Badges are awarded automatically
âœ… Admin can manage sets/badges via panel
âœ… UI is responsive (mobile + desktop)
âœ… Animations work smoothly
âœ… Language switching works
âœ… No critical bugs
âœ… Deployed to Vercel
âœ… Supabase configured correctly

---

## ðŸ“ž FINAL NOTES

### Code Quality
- Clean, readable, commented (Turkish comments OK)
- Modular structure
- Reusable components
- Error handling everywhere
- Loading states for async operations

### User Experience
- Fast loading
- Smooth transitions
- Clear feedback
- Intuitive navigation
- Mobile-friendly

### Maintainability
- Easy to add new games
- Easy to add new badges
- Easy to modify scoring
- Well-documented
- Version controlled

---

**END OF BRIEF**

Bu brief'i takip ederek, modÃ¼ler, scalable ve profesyonel bir Almanca Ã¶ÄŸrenme platformu oluÅŸturabilirsin.

Herhangi bir soru veya belirsizlik varsa, dÃ¶kÃ¼manÄ± referans al!

ðŸš€ Ä°yi geliÅŸtirmeler!
