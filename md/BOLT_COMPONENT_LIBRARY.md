# 📚 COMPONENT LIBRARY REFERENCE - Der Die Das Space

## Bolt.new'de Kopyala-Yapıştır İçin Hazır

Mevcut component'lerinin CSS/HTML'i - Bolt.new'de referans olarak kullan!

---

## 🎨 COLOR SYSTEM

```css
/* Brand Colors */
--color-blue: #0099FF;        /* der artikel */
--color-coral: #FF5C6E;       /* die artikel */
--color-yellow: #FFCC00;      /* das artikel */
--color-green: #88CC00;       /* success */
--color-red: #FF4444;         /* danger */

/* Opacity Variations */
--color-blue-50: rgba(0, 153, 255, 0.5);
--color-blue-30: rgba(0, 153, 255, 0.3);
--color-blue-20: rgba(0, 153, 255, 0.2);
--color-blue-10: rgba(0, 153, 255, 0.1);
/* (Her renk için aynı) */

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Colored Shadows */
--shadow-blue: 0 4px 12px rgba(0, 153, 255, 0.25);
--shadow-coral: 0 4px 12px rgba(255, 92, 110, 0.25);
--shadow-yellow: 0 4px 12px rgba(255, 204, 0, 0.25);
--shadow-green: 0 4px 12px rgba(136, 204, 0, 0.25);
```

---

## 🔘 BUTTON COMPONENT

```html
<!-- Primary Button -->
<button class="btn btn-primary">
  Button Text
</button>

<!-- Artikel Buttons -->
<button class="btn btn-der">DER</button>
<button class="btn btn-die">DIE</button>
<button class="btn btn-das">DAS</button>

<!-- Success Button -->
<button class="btn btn-success">Success</button>
```

```css
/* Base Button */
.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
}

/* Primary (Blue) */
.btn-primary {
  background: linear-gradient(135deg, #0099FF 0%, #0077CC 100%);
  color: white;
  box-shadow: var(--shadow-blue);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 153, 255, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

/* DER Button (Coral) */
.btn-der {
  background: linear-gradient(135deg, #FF5C6E 0%, #FF3355 100%);
  color: white;
  box-shadow: var(--shadow-coral);
}

/* DIE Button (Blue) */
.btn-die {
  background: linear-gradient(135deg, #0099FF 0%, #0077CC 100%);
  color: white;
  box-shadow: var(--shadow-blue);
}

/* DAS Button (Yellow) */
.btn-das {
  background: linear-gradient(135deg, #FFCC00 0%, #FFAA00 100%);
  color: #1a1a1a;
  box-shadow: var(--shadow-yellow);
}

/* Success Button (Green) */
.btn-success {
  background: linear-gradient(135deg, #88CC00 0%, #66AA00 100%);
  color: white;
  box-shadow: var(--shadow-green);
}
```

---

## 🃏 CARD COMPONENT

```html
<!-- Basic Card -->
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</div>

<!-- Game Card (Clickable) -->
<a href="games/der-die-dash.html" class="game-card">
  <div class="game-icon">🎯</div>
  <h3 class="game-title">Der Die Dash</h3>
  <p class="game-desc">Artikel tahmin oyunu</p>
  <span class="difficulty-badge badge-easy">EASY</span>
</a>
```

```css
/* Base Card */
.card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(0, 153, 255, 0.1);
}

/* Game Card */
.game-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 32px 24px;
  text-decoration: none;
  color: inherit;
  box-shadow: var(--shadow-md);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.game-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-blue);
}

.game-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.game-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.game-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}
```

---

## 🏷️ BADGE COMPONENT

```html
<!-- Difficulty Badges -->
<span class="difficulty-badge badge-easy">EASY</span>
<span class="difficulty-badge badge-medium">MEDIUM</span>
<span class="difficulty-badge badge-hard">HARD</span>
<span class="difficulty-badge badge-very-hard">VERY HARD</span>
<span class="difficulty-badge badge-expert">EXPERT</span>
```

```css
/* Base Badge */
.difficulty-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

/* EASY (Green) */
.badge-easy {
  background: linear-gradient(135deg, #88CC00, #66AA00);
  color: white;
  box-shadow: 0 2px 8px rgba(136, 204, 0, 0.3);
}

.badge-easy:hover {
  box-shadow: 0 4px 16px rgba(136, 204, 0, 0.5);
  transform: scale(1.05);
}

/* MEDIUM (Blue) */
.badge-medium {
  background: linear-gradient(135deg, #0099FF, #0077CC);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 153, 255, 0.3);
}

/* HARD (Orange) */
.badge-hard {
  background: linear-gradient(135deg, #FF9900, #FF7700);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 153, 0, 0.3);
}

/* VERY HARD (Pink) */
.badge-very-hard {
  background: linear-gradient(135deg, #FF3366, #FF1144);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 51, 102, 0.3);
}

/* EXPERT (Purple) */
.badge-expert {
  background: linear-gradient(135deg, #9933FF, #7711DD);
  color: white;
  box-shadow: 0 2px 8px rgba(153, 51, 255, 0.3);
}
```

---

## 🍔 HAMBURGER MENU

```html
<!-- Hamburger Button -->
<button class="hamburger-btn" aria-label="Menu">
  <span class="hamburger-icon">☰</span>
  Menü
</button>

<!-- Slide-in Menu -->
<nav class="slide-menu">
  <button class="close-btn">✕ Menüyü Kapat</button>
  <ul class="menu-items">
    <li><a href="contact.html">İletişim</a></li>
    <li><a href="leaderboard.html">Leaderboard</a></li>
    <li><a href="badges.html">Badges</a></li>
    <li><a href="#how-to-play">Nasıl Oynanır?</a></li>
  </ul>
</nav>

<!-- Overlay -->
<div class="menu-overlay"></div>
```

```css
/* Hamburger Button */
.hamburger-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  background: var(--color-green);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hamburger-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Slide-in Menu */
.slide-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 150px;
  height: 25vh;
  background: white;
  box-shadow: var(--shadow-xl);
  z-index: 1002;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.slide-menu.active {
  transform: translateX(0);
}

/* Close Button */
.close-btn {
  background: linear-gradient(135deg, #FF4444, #CC0000);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
}

/* Menu Items */
.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-items a {
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.menu-items a:hover {
  background: rgba(0, 153, 255, 0.1);
}

/* Overlay */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.menu-overlay.active {
  opacity: 1;
  pointer-events: auto;
}
```

---

## 📝 FORM INPUT

```html
<!-- Text Input -->
<div class="form-group">
  <label for="email">Email</label>
  <input type="email" id="email" class="form-input" placeholder="email@example.com">
</div>

<!-- Password Input -->
<div class="form-group">
  <label for="password">Şifre</label>
  <input type="password" id="password" class="form-input" placeholder="••••••••">
</div>
```

```css
/* Form Group */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

/* Input */
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue);
  box-shadow: 0 0 0 3px rgba(0, 153, 255, 0.1);
}

.form-input::placeholder {
  color: #999;
}

/* Error State */
.form-input.error {
  border-color: var(--color-red);
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
}
```

---

## 🎭 MODAL/DIALOG

```html
<!-- Modal -->
<div class="modal-overlay">
  <div class="modal">
    <button class="modal-close">✕</button>
    <h2 class="modal-title">Modal Title</h2>
    <div class="modal-body">
      <p>Modal content goes here...</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-primary">Confirm</button>
      <button class="btn btn-secondary">Cancel</button>
    </div>
  </div>
</div>
```

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.modal-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

/* Modal */
.modal {
  background: white;
  border-radius: 24px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-xl);
  position: relative;
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-overlay.active .modal {
  transform: scale(1);
}

/* Close Button */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--color-red);
}

/* Modal Title */
.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* Modal Body */
.modal-body {
  margin-bottom: 24px;
  color: #666;
  line-height: 1.6;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
```

---

## ✨ ANIMATIONS

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Pulse Success (Correct Answer) */
@keyframes pulse-success {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(136, 204, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(136, 204, 0, 0);
  }
}

.correct-answer {
  animation: pulse-success 0.6s ease-out;
}

/* Shake (Wrong Answer) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.wrong-answer {
  animation: shake 0.4s ease-in-out;
}

/* Spin (Loading) */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite;
}

/* Badge Unlock */
@keyframes badgeUnlock {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.badge-unlock {
  animation: badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 📱 RESPONSIVE GRID

```css
/* Game Grid (Landing Page) */
.games-grid {
  display: grid;
  gap: 24px;
  margin-top: 48px;
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2-3 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 5 columns (all games in one row) */
@media (min-width: 1280px) {
  .games-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
```

---

## 🎨 BRAND NAME (Colored Text)

```html
<!-- "derdiedas" with colored letters -->
<div class="brand-name">
  <span style="color: #0099FF;">d</span>
  <span style="color: #0099FF;">e</span>
  <span style="color: #0099FF;">r</span>
  <span style="color: #FF5C6E;">d</span>
  <span style="color: #FF5C6E;">i</span>
  <span style="color: #FF5C6E;">e</span>
  <span style="color: #FFCC00;">d</span>
  <span style="color: #FFCC00;">a</span>
  <span style="color: #FFCC00;">s</span>
</div>
```

```css
.brand-name {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -1px;
}

/* Mobile */
@media (max-width: 767px) {
  .brand-name {
    font-size: clamp(2rem, calc(100vw - 100px), 5rem);
  }
}
```

---

## 🚀 KULLANIM (Bolt.new'de)

### 1. Referans Olarak Kullan
```
"Mevcut button component'ime bak:
[Yukarıdaki button CSS'i yapıştır]

Bunu daha premium yap, gradient güçlendir"
```

### 2. Karşılaştır
```
"İki versiyonu yan yana göster:
A) Mevcut card style (yukarıdaki)
B) Yeni glassmorphism card style"
```

### 3. Kombinasyon Yap
```
"Button + Badge + Card'ı birleştir:
[3 component'i yapıştır]

Bunları kullanarak yeni bir game card tasarla"
```

---

**COMPONENT LIBRARY REFERENCE**  
**Kaynak:** PROJECT_STATUS.md + Mevcut codebase  
**Tarih:** 12 Ocak 2026  
**Kullanım:** Bolt.new'de referans
