# ðŸŽ¨ FRONTEND DESIGN BRIEF v1.2.1 FINAL - Der Die Das Space

**Proje:** Der Die Das Space - Almanca Ã–ÄŸrenme Platformu  
**Domain:** derdiedas.space  
**Teknoloji:** HTML5, CSS3, Vanilla JavaScript  
**AltyapÄ±:** Supabase (backend), Vercel (hosting)  
**Tarih:** 11 Ocak 2026

---

## ðŸ“‹ Ä°Ã‡Ä°NDEKÄ°LER

1. [Genel YaklaÅŸÄ±m](#genel-yaklaÅŸÄ±m)
2. [Renk Paleti](#renk-paleti)
3. [Tipografi](#tipografi)
4. [Layout Sistemi](#layout-sistemi)
5. [Landing Page](#landing-page)
6. [Oyun SayfasÄ± (Der Die Dash)](#oyun-sayfasÄ±)
7. [Set Ã–zeti EkranÄ±](#set-Ã¶zeti-ekranÄ±)
8. [Leaderboard SayfasÄ±](#leaderboard-sayfasÄ±)
9. [Profil SayfasÄ±](#profil-sayfasÄ±)
10. [Badge Collection SayfasÄ±](#badge-collection-sayfasÄ±)
11. [Component Library](#component-library)
12. [Animasyonlar](#animasyonlar)
13. [Responsive Behavior](#responsive-behavior)
14. [Accessibility](#accessibility)
15. [Dosya YapÄ±sÄ±](#dosya-yapÄ±sÄ±)
16. [Umut'un YapacaklarÄ±](#umutun-yapacaklarÄ±)

---

## ðŸŽ¯ GENEL YAKLAÅžIM

### TasarÄ±m Felsefesi
**"Premium Gamification - Oyunsu ama KÃ¼tÃ¼k DeÄŸil"**

### Core Principles
- âœ… **Oyunsu ve eÄŸlenceli** (Gen Y & Z hedef)
- âœ… **Premium gÃ¶rÃ¼nÃ¼m** (minimalist, ÅŸÄ±k)
- âœ… **Mobile-first** (desktop sonra bÃ¼yÃ¼r)
- âŒ **KÃ¼tÃ¼k bÃ¼yÃ¼k yazÄ±lar yok**
- âŒ **AÅŸÄ±rÄ± renkli Ã§ocuksu tasarÄ±m yok**
- âŒ **Keyboard input YOK** (sadece tÄ±klama!)

### Hedef Kitle
- **YaÅŸ:** 20-45
- **Profil:** Gen Y & Z, gamification seviyor
- **Motivasyon:** Badge, skor, rekabet

### Core Message
**"Bedava oyna, kayÄ±t ol skorunu koru, Almanca'nÄ± geliÅŸtir!"**

---

## ðŸŽ¨ RENK PALETÄ°

### Logo Renkleri
```css
:root {
  /* === PRIMARY BRAND COLORS === */
  --color-blue: #0099FF;        /* die artikel + mavi tema */
  --color-green: #88CC00;       /* .space domain + yeÅŸil tema */
  --color-orange: #FF6633;      /* accent/CTA + turuncu tema */
  --color-yellow: #FFCC00;      /* das artikel + sarÄ± tema */
  --color-red: #FF4444;         /* der artikel + kÄ±rmÄ±zÄ± */
  --color-white: #FFFFFF;       /* backgrounds */
  --color-black: #1A1A1A;       /* text/dark */
  
  /* === EXTENDED PALETTE === */
  --color-gray-dark: #333333;
  --color-gray: #666666;
  --color-gray-light: #CCCCCC;
  --color-gray-lighter: #F5F5F5;
  
  /* === SEMANTIC COLORS === */
  --color-success: #88CC00;
  --color-error: #FF6633;
  --color-warning: #FFCC00;
  --color-info: #0099FF;
  
  /* === DIFFICULTY COLORS === */
  --difficulty-easy: #88CC00;        /* YeÅŸil */
  --difficulty-medium: #0099FF;      /* Mavi */
  --difficulty-hard: #FF6633;        /* Turuncu */
  --difficulty-very-hard: #FF3366;   /* Koyu Pembe */
  --difficulty-expert: #9933FF;      /* Mor */
  
  /* === UI COLORS === */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-card: #FFFFFF;
  --bg-card-hover: #FAFAFA;
  
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-light: #999999;
  
  --border-color: #E0E0E0;
  --border-color-hover: #CCCCCC;
  --border-radius: 12px;
  --border-radius-sm: 8px;
  --border-radius-lg: 16px;
  
  /* === SHADOWS === */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.12);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.15);
  
  /* === WHATSAPP === */
  --whatsapp-green: #25D366;
  --whatsapp-green-hover: #1EBE57;
  
  /* === Z-INDEX === */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 900;
  --z-modal: 1000;
  --z-tooltip: 1100;
}
```

---

## ðŸ“ TÄ°POGRAFÄ°

### Font Stack
```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

### Font Sizes
```css
/* Mobile (320px - 767px) */
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  :root {
    --text-lg: 1.25rem;    /* 20px */
    --text-xl: 1.5rem;     /* 24px */
    --text-2xl: 2rem;      /* 32px */
    --text-3xl: 2.5rem;    /* 40px */
    --text-4xl: 3rem;      /* 48px */
  }
}
```

### Spacing
```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

### Transitions
```css
:root {
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

---

## ðŸ—ï¸ LAYOUT SÄ°STEMÄ°

### Grid System

**Mobile (320px - 767px):**
```css
.container {
  padding: 1rem;
  max-width: 100%;
}

.game-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.set-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
```

**Tablet (768px - 1023px):**
```css
.container {
  padding: 2rem;
  max-width: 720px;
  margin: 0 auto;
}

.game-grid {
  grid-template-columns: repeat(2, 1fr);
}

.set-grid {
  grid-template-columns: repeat(3, 1fr);
}
```

**Desktop (1024px+):**
```css
.container {
  padding: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.game-grid {
  grid-template-columns: repeat(3, 1fr);
}

.set-grid {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

---

## ðŸ“± LANDING PAGE

### Ä°lk AÃ§Ä±lÄ±ÅŸ: Dil SeÃ§im Modal (ZORUNLU)

```html
<!-- language-select-modal -->
<div class="language-modal-overlay">
  <div class="language-modal">
    <div class="language-modal-header">
      <img src="/assets/logo.png" alt="Der Die Das Space">
      <h2>Choose Your Language</h2>
      <p>Dilinizi SeÃ§in</p>
    </div>
    
    <div class="language-modal-options">
      <button class="language-option language-option--large" data-lang="tr">
        <span class="language-flag">ðŸ‡¹ðŸ‡·</span>
        <span class="language-name">TÃ¼rkÃ§e</span>
      </button>
      
      <button class="language-option language-option--large" data-lang="en">
        <span class="language-flag">ðŸ‡¬ðŸ‡§</span>
        <span class="language-name">English</span>
      </button>
    </div>
  </div>
</div>
```

**Stil:**
```css
.language-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(8px);
}

.language-modal {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: modalSlideIn 0.4s ease;
}

.language-option--large {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: var(--bg-secondary);
  border: 3px solid transparent;
  border-radius: 12px;
  font-size: var(--text-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.language-option--large:hover {
  border-color: var(--color-blue);
  background: white;
  transform: scale(1.05);
}
```

### Mobile Layout (Dil seÃ§imi sonrasÄ±)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  â”Œâ”€â”€â”€â” derdiedas.space              â”‚
â”‚  â””â”€â”€â”€â”˜                       [GÄ°RÄ°Åž]â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ â“ NasÄ±l OynanÄ±r?      [+]  â”‚   â”‚ â† KapalÄ± accordion
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚  ðŸŽ¯ Der Die Dash            â”‚   â”‚ â† Oyun kartÄ± 1
â”‚  â”‚  Artikel tahmin oyunu       â”‚   â”‚   (tek sÃ¼tun)
â”‚  â”‚  [EASY]                     â”‚   â”‚
â”‚  â”‚  [OYNA >]                   â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚  ðŸ“ Case Control            â”‚   â”‚ â† Oyun kartÄ± 2
â”‚  â”‚  Preposition challenge      â”‚   â”‚
â”‚  â”‚  [MEDIUM]                   â”‚   â”‚
â”‚  â”‚  [OYNA >]                   â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                     â”‚
â”‚  [... 3 oyun daha ...]              â”‚
â”‚                                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ ðŸŽ® TÃ¼m Oyunlar Ãœcretsiz!    â”‚   â”‚ â† Sticky CTA
â”‚  â”‚ [GÄ°RÄ°Åž YAP] [KAYIT OL]      â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Desktop Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  â”Œâ”€â”€â”€â” derdiedas.space           [TR][EN]  [GÄ°RÄ°Åž][KAYIT]â”‚
â”‚  â””â”€â”€â”€â”˜                                                     â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                           â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚ â“ NasÄ±l OynanÄ±r?                              [âˆ’] â”‚ â”‚ â† AÃ§Ä±k
â”‚  â”‚                                                     â”‚ â”‚
â”‚  â”‚ Her oyundan 1 set Ã¼cretsiz oynayabilirsiniz!       â”‚ â”‚
â”‚  â”‚ KayÄ±t olun, skorunuzu kaydedin, badge kazanÄ±n!     â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                                           â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚  â”‚ ðŸŽ¯ Der Die   â”‚  â”‚ ðŸ“ Case      â”‚  â”‚ ðŸ¥— Word      â”‚   â”‚
â”‚  â”‚    Dash      â”‚  â”‚    Control   â”‚  â”‚    Salad     â”‚   â”‚
â”‚  â”‚              â”‚  â”‚              â”‚  â”‚              â”‚   â”‚
â”‚  â”‚ [EASY]       â”‚  â”‚ [MEDIUM]     â”‚  â”‚ [HARD]       â”‚   â”‚
â”‚  â”‚ [OYNA >]     â”‚  â”‚ [OYNA >]     â”‚  â”‚ [OYNA >]     â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚                                                           â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                      â”‚
â”‚  â”‚ ðŸ”¤ Translationâ”‚  â”‚ ðŸ”  5-Letter  â”‚                      â”‚
â”‚  â”‚    Quest     â”‚  â”‚    Blitz     â”‚                      â”‚
â”‚  â”‚ [VERY HARD]  â”‚  â”‚ [EXPERT]     â”‚                      â”‚
â”‚  â”‚ [OYNA >]     â”‚  â”‚ [OYNA >]     â”‚                      â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Login OlmuÅŸ KullanÄ±cÄ± Ä°Ã§in

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸ‘¤ Umut YÄ±ldÄ±rÄ±m          [PROFÄ°L] â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                     â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚ â† Profil kartÄ±
â”‚  â”‚ ðŸ† Toplam Skor: 12,450       â”‚  â”‚
â”‚  â”‚ ðŸ“Š Global SÄ±ra: #42          â”‚  â”‚
â”‚  â”‚                              â”‚  â”‚
â”‚  â”‚ ðŸŽ–ï¸ Son KazanÄ±lan Badge'ler:  â”‚  â”‚
â”‚  â”‚ â”Œâ”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”        â”‚  â”‚
â”‚  â”‚ â”‚ ðŸ”¥ â”‚ â”‚ â­ â”‚ â”‚ ðŸ† â”‚        â”‚  â”‚
â”‚  â”‚ â””â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”˜        â”‚  â”‚
â”‚  â”‚                              â”‚  â”‚
â”‚  â”‚ [PROFÄ°LE GÄ°T >]              â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                     â”‚
â”‚  [... Oyun kartlarÄ± ...]            â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ðŸŽ® OYUN SAYFASI (Der Die Dash)

### Mobile Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ [â†] Der Die Dash        ðŸ‘¤      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                 â”‚
â”‚  Soru 3/10                      â”‚
â”‚                                 â”‚
â”‚  â±ï¸ 3s    ðŸ”¥ 3x COMBO           â”‚ â† Timer + Combo
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â” â”‚
â”‚  â”‚                           â”‚ â”‚
â”‚  â”‚        Tisch              â”‚ â”‚ â† YEÅžÄ°L frame
â”‚  â”‚                           â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜ â”‚
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”          â”‚ â† YAN YANA!
â”‚  â”‚der â”‚ â”‚die â”‚ â”‚das â”‚          â”‚   (Hotfix)
â”‚  â””â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”˜          â”‚
â”‚                                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Kelime Frame (YeÅŸil)

```css
.word-frame {
  background: #88CC00;
  color: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  text-align: center;
  font-size: var(--text-4xl);
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(136, 204, 0, 0.3);
  margin: 2rem 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 767px) {
  .word-frame {
    font-size: var(--text-3xl);
    padding: 2rem 1.5rem;
    min-height: 150px;
  }
}
```

### Artikel ButonlarÄ± (Logo Renkleri)

```css
.artikel-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: nowrap; /* Mobilde bile yan yana! */
}

.artikel-btn {
  flex: 1;
  min-width: 80px;
  padding: 1.5rem 1rem;
  font-size: var(--text-xl);
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: lowercase;
}

@media (min-width: 768px) {
  .artikel-btn {
    min-width: 120px;
    padding: 1.5rem 2rem;
    font-size: var(--text-2xl);
  }
}

.artikel-btn-der {
  background: #FF4444;
  color: white;
}

.artikel-btn-die {
  background: #0099FF;
  color: white;
}

.artikel-btn-das {
  background: #FFCC00;
  color: #1A1A1A;
}

.artikel-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}

.artikel-btn:active {
  transform: scale(0.95);
}
```

### Timer + Combo

```css
.game-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-xl);
  font-weight: 600;
}

.timer-value {
  font-family: var(--font-mono);
  color: var(--color-orange);
}

.timer--warning .timer-value {
  color: var(--color-error);
  animation: timerPulse 1s infinite;
}

.combo-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-orange);
  background: rgba(255, 102, 51, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.combo-indicator::before {
  content: 'ðŸ”¥';
  font-size: 1.5rem;
}
```

---

## ðŸ“Š SET Ã–ZETÄ° EKRANI

### Mobile Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚        ðŸŽ‰ SET TAMAMLANDI!       â”‚
â”‚                                 â”‚
â”‚     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚     â”‚   SKORUN: 245         â”‚  â”‚
â”‚     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ âœ… DoÄŸru: 8              â”‚  â”‚
â”‚  â”‚ âŒ YanlÄ±ÅŸ: 2             â”‚  â”‚
â”‚  â”‚ â±ï¸ Ort. SÃ¼re: 2.3s       â”‚  â”‚
â”‚  â”‚ ðŸ”¥ Max Combo: 5          â”‚  â”‚
â”‚  â”‚ âš¡ HÄ±z Bonusu: +45       â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                 â”‚
â”‚  ðŸŽ–ï¸ KAZANDIÄžIN BADGE'LER:      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”               â”‚
â”‚  â”‚ ðŸ”¥  â”‚ â”‚ â­  â”‚               â”‚
â”‚  â”‚ 5x  â”‚ â”‚ 10s â”‚               â”‚
â”‚  â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜               â”‚
â”‚                                 â”‚
â”‚  "Momentum bir ÅŸampiyonun       â”‚
â”‚   en iyi arkadaÅŸÄ±dÄ±r."          â”‚
â”‚  â€” Kobe Bryant                  â”‚
â”‚                                 â”‚
â”‚  ðŸ“Š SIRA: Global #42 | Set #5   â”‚
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ ðŸŽ¯ SORU DETAYLARI   [+]  â”‚  â”‚ â† Accordion
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                 â”‚
â”‚  [ANA SAYFA]  [PROFÄ°L]         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Soru DetaylarÄ± (AÃ§Ä±k)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸŽ¯ SORU DETAYLARI         [âˆ’] â”‚
â”‚                                 â”‚
â”‚  Soru 1: Tisch                  â”‚
â”‚  Senin: der âœ…  SÃ¼re: 2.1s     â”‚
â”‚  Puan: 25                       â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”‚
â”‚  Soru 2: TÃ¼r                    â”‚
â”‚  Senin: das âŒ  DoÄŸru: die     â”‚
â”‚  SÃ¼re: 5.0s (zaman doldu)       â”‚
â”‚  Puan: -5                       â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”‚
â”‚  [... 10 soruya kadar]          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Badge Quote Sistemi

```javascript
const badgeQuotes = {
  'streak_7_days': {
    quote: "Disiplin Ã¶zgÃ¼rlÃ¼kten Ã¶nce gelir.",
    author: "Jocko Willink"
  },
  'perfect_game': {
    quote: "MÃ¼kemmellik bir tesadÃ¼f deÄŸil, alÄ±ÅŸkanlÄ±ktÄ±r.",
    author: "Aristoteles"
  },
  'combo_master': {
    quote: "Momentum bir ÅŸampiyonun en iyi arkadaÅŸÄ±dÄ±r.",
    author: "Kobe Bryant"
  },
  'top_10': {
    quote: "Rakiplerini geÃ§mek iÃ§in Ã¶nce kendini geÃ§melisin.",
    author: "Bruce Lee"
  },
  'first_game': {
    quote: "BaÅŸlamak, bitirmenin yarÄ±sÄ±dÄ±r.",
    author: "Aristoteles"
  }
};
```

---

## ðŸ† LEADERBOARD SAYFASI

### Layout: Global + Oyun Accordion'larÄ±

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸ† LEADERBOARD                 â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                 â”‚
â”‚  [ðŸŒ GLOBAL]                    â”‚ â† Aktif
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ #  Ad         Skor  Badgeâ”‚  â”‚
â”‚  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤  â”‚
â”‚  â”‚ 1  Max        1250  ðŸ†   â”‚  â”‚
â”‚  â”‚ 2  Sophie     1180  ðŸ¥ˆ   â”‚  â”‚
â”‚  â”‚ 3  Alex       1150  ðŸ¥‰   â”‚  â”‚
â”‚  â”‚ ...                      â”‚  â”‚
â”‚  â”‚ 42 Umut       890   â­   â”‚  â”‚ â† Highlight
â”‚  â”‚ ...                      â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                 â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”‚
â”‚                                 â”‚
â”‚  [ðŸŽ¯ Der Die Dash]         [+] â”‚
â”‚  [ðŸ“ Case Control]         [+] â”‚
â”‚  [ðŸ¥— Word Salad]           [+] â”‚
â”‚  [ðŸ”¤ Translation Quest]    [+] â”‚
â”‚  [ðŸ”  5-Letter Blitz]       [+] â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### KullanÄ±cÄ± Highlight

```css
.leaderboard-row--current-user {
  background: linear-gradient(90deg, 
    rgba(0, 153, 255, 0.1) 0%, 
    rgba(136, 204, 0, 0.1) 100%);
  border-left: 4px solid var(--color-blue);
  font-weight: 700;
}

.leaderboard-row--current-user::before {
  content: 'ðŸ‘¤';
  margin-right: 0.5rem;
}
```

---

## ðŸ‘¤ PROFÄ°L SAYFASI

### Mobile Layout

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸ‘¤ Umut YÄ±ldÄ±rÄ±m              â”‚
â”‚  [Ã‡Ä±kÄ±ÅŸ Yap]                    â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ ðŸ† Toplam Skor: 12,450   â”‚  â”‚
â”‚  â”‚ ðŸ“Š Global SÄ±ra: #42      â”‚  â”‚
â”‚  â”‚ ðŸŽ® Tamamlanan Set: 15    â”‚  â”‚
â”‚  â”‚ ðŸŽ¯ Kalan Set: 40         â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚                                 â”‚
â”‚  ðŸŽ–ï¸ BADGE KOLEKSÄ°YONU (7/50)   â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”       â”‚
â”‚  â”‚ ðŸ”¥  â”‚ â”‚ â­  â”‚ â”‚ ðŸ†  â”‚       â”‚
â”‚  â”‚ 7d  â”‚ â”‚ 10s â”‚ â”‚ Top â”‚       â”‚
â”‚  â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜       â”‚
â”‚  [TÃ¼m Badge'leri GÃ¶r]          â”‚
â”‚                                 â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”‚
â”‚                                 â”‚
â”‚  ðŸŽ ARKADAÅžLARINI DAVET ET      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚ UMUT1234      [ðŸ“‹ Kopyala]â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â”‚  [ðŸ“± WhatsApp ile PaylaÅŸ]      â”‚
â”‚                                 â”‚
â”‚  Davet Ettin: 5  |  +250 puan  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### WhatsApp Referral

```javascript
function shareOnWhatsApp(referralCode) {
  const link = `https://derdiedas.space?ref=${referralCode}`;
  const message = encodeURIComponent(
    `ðŸ‡©ðŸ‡ª Almanca Ã¶ÄŸrenirken eÄŸlen!\n\n` +
    `Der Die Das Space'e katÄ±l, benimle yarÄ±ÅŸ!\n\n` +
    `${link}\n\n` +
    `âœ¨ Ä°kimiz de 50 puan kazanÄ±yoruz!`
  );
  window.open(`https://wa.me/?text=${message}`, '_blank');
}
```

---

## ðŸŽ–ï¸ BADGE COLLECTION SAYFASI

### Layout: KarÄ±ÅŸÄ±k Grid

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ðŸŽ–ï¸ BADGE KOLEKSÄ°YONU          â”‚
â”‚  7/50 Badge KazandÄ±n            â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”       â”‚
â”‚  â”‚ ðŸ”¥  â”‚ â”‚ â­  â”‚ â”‚ ðŸ†  â”‚       â”‚ â† Renkli
â”‚  â”‚ 7d  â”‚ â”‚ 10s â”‚ â”‚ Top â”‚       â”‚
â”‚  â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜       â”‚
â”‚                                 â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â” â”Œâ”€â”€â”€â”€â”€â”       â”‚
â”‚  â”‚ ðŸ”’  â”‚ â”‚ ðŸ”’  â”‚ â”‚ ðŸ”’  â”‚       â”‚ â† Locked
â”‚  â”‚ ??? â”‚ â”‚ ??? â”‚ â”‚ ??? â”‚       â”‚   (gri)
â”‚  â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜ â””â”€â”€â”€â”€â”€â”˜       â”‚
â”‚                                 â”‚
â”‚  [... 50 badge'e kadar]         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Badge States

```css
.badge-card--unlocked {
  border: 2px solid var(--color-success);
  box-shadow: 0 4px 12px rgba(136, 204, 0, 0.2);
}

.badge-card--unlocked:hover {
  transform: scale(1.1);
}

.badge-card--locked {
  background: var(--color-gray-lighter);
  border: 2px solid var(--color-gray-light);
  opacity: 0.5;
  cursor: default;
}

.badge-card--locked .badge-icon {
  filter: grayscale(100%);
  opacity: 0.3;
}
```

---

## ðŸ§© COMPONENT LIBRARY

### Modal (Login)

```html
<div class="modal-overlay">
  <div class="modal">
    <button class="modal-close">Ã—</button>
    
    <h2>GiriÅŸ Yap</h2>
    
    <form>
      <input type="email" placeholder="Email">
      <input type="password" placeholder="Åžifre">
      <button type="submit">GiriÅŸ Yap</button>
    </form>
    
    <div class="divider">veya</div>
    
    <button class="btn-google">ðŸ”µ Google ile GiriÅŸ</button>
    
    <p>HesabÄ±n yok mu? <a href="#">KayÄ±t Ol</a></p>
  </div>
</div>
```

### Toast Notification

```css
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  animation: toastSlideIn 0.3s ease;
  z-index: var(--z-tooltip);
}

.toast--success {
  border-left: 4px solid var(--color-success);
}

.toast--error {
  border-left: 4px solid var(--color-error);
}
```

### Loading State (Almanca Bilgisi)

```javascript
const loadingFacts = [
  "Almanca'da 'Gift' zehir demektir!",
  "Almanya'da 1,500'den fazla bira Ã§eÅŸidi var.",
  "Berlin, Paris'ten 9 kat daha bÃ¼yÃ¼ktÃ¼r.",
  "Almanca'da en uzun kelime 63 harflidir!",
  "Almanya'da pazar gÃ¼nleri marketler kapalÄ±dÄ±r."
];
```

### Error Message + Quote

```html
<div class="error-message">
  <h3>âŒ Bir hata oluÅŸtu!</h3>
  
  <blockquote>
    "BaÅŸarÄ±sÄ±zlÄ±k bir seÃ§enek deÄŸildir."
    <cite>â€” Elon Musk</cite>
  </blockquote>
  
  <button>Tekrar Dene</button>
  <button onclick="sendErrorToWhatsApp()">
    GeliÅŸtiriciye WhatsApp GÃ¶nder
  </button>
</div>
```

---

## âœ¨ ANÄ°MASYONLAR

### DoÄŸru Cevap

```css
@keyframes correctPulse {
  0% {
    transform: scale(1);
    background: var(--color-success);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(136, 204, 0, 0.6);
  }
  100% {
    transform: scale(1);
    background: var(--color-success);
  }
}

.artikel-btn--correct {
  animation: correctPulse 0.5s ease;
}
```

### YanlÄ±ÅŸ Cevap

```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes flashRed {
  0%, 100% { background: var(--color-error); }
  50% { background: #ff0000; }
}

.artikel-btn--wrong {
  animation: shake 0.5s ease, flashRed 0.5s ease;
}
```

### Combo PatlamasÄ±

```css
@keyframes comboBurst {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.combo-indicator--burst {
  animation: comboBurst 0.5s ease;
}
```

### Page Transitions

```css
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page {
  animation: pageEnter 0.4s ease;
}
```

---

## ðŸ“± RESPONSIVE BEHAVIOR

### Mobile (320px - 767px)
- Single column
- Stack vertically
- Padding: 1rem
- Font size kÃ¼Ã§Ã¼k
- CTA sticky bottom

### Tablet (768px - 1023px)
- 2 column grid
- Padding: 2rem
- Normal font size

### Desktop (1024px+)
- 3-4 column grid
- Padding: 3rem
- Large font size
- CTA not sticky

---

## â™¿ ACCESSIBILITY

### Focus States
```css
:focus {
  outline: 3px solid var(--color-blue);
  outline-offset: 2px;
}
```

### ARIA Labels
```html
<button aria-label="Der Die Dash oyununu oyna">
  OYNA
</button>
```

### Semantic HTML
```html
<header>
  <nav aria-label="Ana navigasyon">...</nav>
</header>

<main>
  <section aria-labelledby="games-heading">
    <h2 id="games-heading">Oyunlar</h2>
  </section>
</main>
```

---

## ðŸ“ DOSYA YAPISI

```
/der-die-das-space
â”œâ”€â”€ index.html
â”œâ”€â”€ leaderboard.html
â”œâ”€â”€ profile.html
â”œâ”€â”€ badges.html
â”‚
â”œâ”€â”€ /games
â”‚   â”œâ”€â”€ der-die-dash.html
â”‚   â”œâ”€â”€ case-control.html
â”‚   â”œâ”€â”€ word-salad.html
â”‚   â”œâ”€â”€ translation-quest.html
â”‚   â””â”€â”€ five-letter-blitz.html
â”‚
â”œâ”€â”€ /css
â”‚   â”œâ”€â”€ main.css
â”‚   â”œâ”€â”€ components.css
â”‚   â”œâ”€â”€ animations.css
â”‚   â””â”€â”€ difficulty-badges.css
â”‚
â”œâ”€â”€ /js
â”‚   â”œâ”€â”€ /core
â”‚   â”‚   â”œâ”€â”€ supabase.js
â”‚   â”‚   â”œâ”€â”€ auth.js
â”‚   â”‚   â”œâ”€â”€ scoring.js
â”‚   â”‚   â”œâ”€â”€ timer.js
â”‚   â”‚   â”œâ”€â”€ combo.js
â”‚   â”‚   â”œâ”€â”€ i18n.js
â”‚   â”‚   â””â”€â”€ referral.js
â”‚   â”‚
â”‚   â”œâ”€â”€ /components
â”‚   â”‚   â”œâ”€â”€ game-card.js
â”‚   â”‚   â”œâ”€â”€ set-card.js
â”‚   â”‚   â”œâ”€â”€ user-card.js
â”‚   â”‚   â””â”€â”€ language-selector.js
â”‚   â”‚
â”‚   â”œâ”€â”€ /games
â”‚   â”‚   â”œâ”€â”€ der-die-dash.js
â”‚   â”‚   â”œâ”€â”€ case-control.js
â”‚   â”‚   â””â”€â”€ ...
â”‚   â”‚
â”‚   â””â”€â”€ app.js
â”‚
â”œâ”€â”€ /assets
â”‚   â”œâ”€â”€ logo.png
â”‚   â”œâ”€â”€ logo-small.png
â”‚   â””â”€â”€ favicon.ico
â”‚
â””â”€â”€ /sql
    â”œâ”€â”€ 01_schema.sql
    â”œâ”€â”€ 02_views.sql
    â”œâ”€â”€ 03_functions.sql
    â””â”€â”€ 04_seed_data.sql
```

---

## âœ… UMUT'UN YAPACAKLARI

### 1. Supabase Kurulumu
- [ ] Supabase hesabÄ± oluÅŸtur
- [ ] Yeni proje oluÅŸtur
- [ ] Project URL + Anon Key kopyala
- [ ] SQL scriptleri Ã§alÄ±ÅŸtÄ±r (sÄ±rayla)

### 2. Authentication
- [ ] Email/Password: Enabled
- [ ] Email confirmation: DISABLED
- [ ] Google OAuth setup

### 3. Vercel Deploy
- [ ] GitHub repo oluÅŸtur
- [ ] Vercel'e baÄŸla
- [ ] Environment variables ekle
- [ ] Deploy!

### 4. Domain
- [ ] derdiedas.space â†’ Vercel
- [ ] DNS ayarlarÄ±
- [ ] SSL sertifikasÄ± (otomatik)

### 5. Dataset YÃ¼kleme
- [ ] Qwen'den JSON al
- [ ] SQL'e Ã§evir
- [ ] Supabase'e yÃ¼kle
- [ ] Placeholder'larÄ± sil

### 6. Ä°Ã§erik HazÄ±rlama
- [ ] UI Ã§evirileri (TR/EN)
- [ ] Badge quote'larÄ±
- [ ] Loading facts (20-30 Almanca bilgisi)
- [ ] WhatsApp referral mesajÄ±

### 7. Admin Panel
- [ ] API key oluÅŸtur
- [ ] admin_keys tablosuna ekle
- [ ] GiriÅŸ yap, test et

### 8. Test
- [ ] Demo mode
- [ ] Email/password kayÄ±t
- [ ] Google login
- [ ] Her oyunu oyna
- [ ] Badge kazanma
- [ ] Referral sistemi
- [ ] Mobile test
- [ ] Cross-browser test

### 9. Beta Test
- [ ] 5-10 arkadaÅŸa gÃ¶nder
- [ ] Feedback topla
- [ ] Bug'larÄ± dÃ¼zelt

### 10. Launch!
- [ ] Analytics ekle (opsiyonel)
- [ ] Social media duyurusu
- [ ] Ä°lk kullanÄ±cÄ±larÄ± davet et

---

## ðŸ“Š PLACEHOLDER DATASET NOTU

### Ä°lk 2 Set AI Agent Ãœretecek

**Demo Set (10 soru):**
- Basit kelimeler: Tisch, Auto, TÃ¼r, Buch, Stuhl, Lampe, Fenster, Baum, Blume, Kind
- Her artikel dengeli (3-4-3)

**Level 1 - Set 1 (10 soru):**
- GÃ¼nlÃ¼k kelimeler
- Kolay Ã§aÄŸrÄ±ÅŸÄ±mlar

**SonrasÄ±:**
- Qwen ile 550 soru Ã¼retimi
- CSV/SQL ile toplu import
- Placeholder'lar silinecek

---

## ðŸŽ¯ BAÅžARILI LAUNCH Ã–LÃ‡ÃœTLERÄ°

- [ ] Site canlÄ± ve eriÅŸilebilir
- [ ] Auth Ã§alÄ±ÅŸÄ±yor
- [ ] En az 1 demo set oynanabilir
- [ ] Skor kaydediliyor
- [ ] Leaderboard gÃ¼ncelleniyor
- [ ] Badge sistemi Ã§alÄ±ÅŸÄ±yor
- [ ] Referral Ã§alÄ±ÅŸÄ±yor
- [ ] Mobilde sorunsuz
- [ ] Console temiz (hata yok)

---

**FRONTEND_DESIGN_BRIEF_v1.2.1_FINAL** âœ…

**Tarih:** 11 Ocak 2026  
**Version:** 1.2.1  
**Status:** READY FOR DEVELOPMENT ðŸš€
