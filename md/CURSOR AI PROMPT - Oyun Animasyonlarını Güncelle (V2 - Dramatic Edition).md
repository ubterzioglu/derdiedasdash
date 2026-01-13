# CURSOR AI PROMPT - Oyun Animasyonlarını Güncelle (V2 - Dramatic Edition)

## 🎯 GÖREV

Der Die Das Space projesindeki oyun animasyonlarını yenile. Şu dosyaları güncelleyeceksin:
- `js/core/animations.js`
- `css/animations.css`

## 📋 MEVCUT DURUM

Şu anda 3 animasyon var:
1. **Doğru Cevap**: `createConfetti()` + `animateCorrect()` - Yeşil pulse + confetti
2. **Yanlış Cevap**: `createWrongAnimation()` + `animateWrong()` - Shake + kırmızı flash
3. **Zaman Bitti**: `createTimeoutAnimation()` - Sarı pulse rings

## 🎨 YENİ ANİMASYONLAR

### 1️⃣ DOĞRU CEVAP: "Neon Glow Success"

**Konsept**: Retro neon tabelası gibi parlama efekti + elektrik çarpması

**Özellikler**:
- Buton neon yeşil ışıkla parlıyor (çok parlak glow effect)
- Kelimenin etrafında neon çerçeve oluşuyor
- Elektrik çarpması gibi zikzak ışıklar (lightning bolts)
- Arka planda yeşil grid pattern (80s retro style)
- Text shadow ve box shadow ile çok parlak efekt

**CSS Keyframes Ekle** (`css/animations.css`):
```css
/* Neon Glow Animation */
@keyframes neonGlow {
  0%, 100% {
    text-shadow: 
      0 0 10px #88CC00,
      0 0 20px #88CC00,
      0 0 30px #88CC00;
    box-shadow: 
      0 0 20px #88CC00,
      0 0 40px #88CC00,
      0 0 60px #88CC00,
      inset 0 0 20px #88CC00;
    filter: brightness(1.2);
  }
  50% {
    text-shadow: 
      0 0 20px #88CC00,
      0 0 40px #88CC00,
      0 0 60px #88CC00,
      0 0 80px #88CC00;
    box-shadow: 
      0 0 40px #88CC00,
      0 0 80px #88CC00,
      0 0 120px #88CC00,
      0 0 160px #88CC00,
      inset 0 0 40px #88CC00;
    filter: brightness(1.5);
  }
}

@keyframes neonFrame {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

@keyframes lightningBolt {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scaleY(0);
  }
  10% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
  20% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
}

@keyframes retroGrid {
  0% {
    opacity: 0;
    transform: perspective(500px) rotateX(60deg) scale(0);
  }
  50% {
    opacity: 0.6;
    transform: perspective(500px) rotateX(60deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: perspective(500px) rotateX(60deg) scale(1.5);
  }
}

.artikel-btn--neon {
  animation: neonGlow 0.8s ease-in-out;
  background: #88CC00 !important;
  color: #000 !important;
}

.neon-frame {
  position: absolute;
  border: 3px solid #88CC00;
  box-shadow: 
    0 0 20px #88CC00,
    0 0 40px #88CC00,
    inset 0 0 20px #88CC00;
  animation: neonFrame 0.8s ease-out;
}

.lightning-bolt {
  position: absolute;
  width: 4px;
  height: 100px;
  background: linear-gradient(to bottom, #fff, #88CC00);
  box-shadow: 0 0 10px #88CC00, 0 0 20px #88CC00;
  animation: lightningBolt 0.6s ease-out;
  clip-path: polygon(
    50% 0%, 
    40% 30%, 
    60% 30%, 
    45% 60%, 
    65% 60%, 
    50% 100%, 
    55% 60%, 
    35% 60%, 
    60% 30%, 
    40% 30%
  );
}

.retro-grid {
  position: absolute;
  width: 400px;
  height: 400px;
  background: 
    linear-gradient(0deg, transparent 24%, rgba(136, 204, 0, 0.3) 25%, rgba(136, 204, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(136, 204, 0, 0.3) 75%, rgba(136, 204, 0, 0.3) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(136, 204, 0, 0.3) 25%, rgba(136, 204, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(136, 204, 0, 0.3) 75%, rgba(136, 204, 0, 0.3) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  animation: retroGrid 1s ease-out;
}
```

**JavaScript Ekle** (`js/core/animations.js`):
```javascript
/**
 * Create neon glow effect for correct answers
 * @param {HTMLElement} button - The correct button
 * @param {HTMLElement} wordFrame - The word frame element
 */
export function createNeonGlow(button, wordFrame) {
  if (!button) return;

  const neonContainer = document.createElement('div');
  neonContainer.className = 'neon-container';
  neonContainer.style.position = 'fixed';
  neonContainer.style.top = '0';
  neonContainer.style.left = '0';
  neonContainer.style.width = '100%';
  neonContainer.style.height = '100%';
  neonContainer.style.pointerEvents = 'none';
  neonContainer.style.zIndex = '9999';
  document.body.appendChild(neonContainer);

  // Retro grid background
  const grid = document.createElement('div');
  grid.className = 'retro-grid';
  grid.style.position = 'absolute';
  grid.style.top = '50%';
  grid.style.left = '50%';
  grid.style.transform = 'translate(-50%, -50%)';
  neonContainer.appendChild(grid);

  // Neon frame around word
  if (wordFrame) {
    const rect = wordFrame.getBoundingClientRect();
    const frame = document.createElement('div');
    frame.className = 'neon-frame';
    frame.style.position = 'absolute';
    frame.style.left = `${rect.left - 10}px`;
    frame.style.top = `${rect.top - 10}px`;
    frame.style.width = `${rect.width + 20}px`;
    frame.style.height = `${rect.height + 20}px`;
    frame.style.borderRadius = '10px';
    neonContainer.appendChild(frame);
  }

  // Lightning bolts (8 directions)
  const buttonRect = button.getBoundingClientRect();
  const centerX = buttonRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top + buttonRect.height / 2;

  for (let i = 0; i < 8; i++) {
    const bolt = document.createElement('div');
    bolt.className = 'lightning-bolt';
    
    const angle = (Math.PI * 2 * i) / 8;
    const distance = 80;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    bolt.style.left = `${x}px`;
    bolt.style.top = `${y}px`;
    bolt.style.transform = `translate(-50%, -50%) rotate(${angle}rad)`;
    bolt.style.animationDelay = `${i * 0.05}s`;
    
    neonContainer.appendChild(bolt);
  }

  // Cleanup
  setTimeout(() => {
    if (document.body.contains(neonContainer)) {
      document.body.removeChild(neonContainer);
    }
  }, 1000);
}
```

**animateCorrect() fonksiyonunu güncelle**:
```javascript
export function animateCorrect(element) {
  if (!element) return;
  element.classList.add('artikel-btn--neon');
  
  // Remove class after animation
  setTimeout(() => {
    element.classList.remove('artikel-btn--neon');
  }, 800);
}
```

---

### 2️⃣ YANLIŞ CEVAP: "Glitch Error"

**Konsept**: Dijital hata efekti (glitch art) + RGB shift + statik noise

**Özellikler**:
- Kelime ve buton RGB shift efektiyle bozuluyor
- Ekranda scan lines (tarama çizgileri)
- Statik noise (TV karışması)
- "ERROR" yazısı glitch efektiyle yanıp sönüyor
- Cyberpunk/tech hissi

**CSS Keyframes Ekle** (`css/animations.css`):
```css
/* Glitch Error Animation */
@keyframes glitchShift {
  0%, 100% {
    transform: translate(0, 0);
    filter: none;
  }
  10% {
    transform: translate(-5px, 2px);
    filter: hue-rotate(90deg);
  }
  20% {
    transform: translate(5px, -2px);
    filter: hue-rotate(-90deg);
  }
  30% {
    transform: translate(-3px, 3px);
    filter: saturate(3) contrast(2);
  }
  40% {
    transform: translate(3px, -3px);
    filter: brightness(2) invert(0.2);
  }
  50% {
    transform: translate(-4px, 1px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(4px, -1px);
    filter: saturate(0) brightness(3);
  }
  70% {
    transform: translate(-2px, 2px);
    filter: hue-rotate(-180deg);
  }
  80% {
    transform: translate(2px, -2px);
    filter: contrast(3);
  }
  90% {
    transform: translate(-1px, 1px);
    filter: brightness(0.5);
  }
}

@keyframes rgbSplit {
  0%, 100% {
    text-shadow: none;
  }
  25% {
    text-shadow: 
      -3px 0 0 rgba(255, 0, 0, 0.8),
      3px 0 0 rgba(0, 255, 255, 0.8);
  }
  50% {
    text-shadow: 
      3px 0 0 rgba(255, 0, 0, 0.8),
      -3px 0 0 rgba(0, 255, 255, 0.8);
  }
  75% {
    text-shadow: 
      -2px 0 0 rgba(255, 0, 0, 0.8),
      2px 2px 0 rgba(0, 255, 0, 0.8),
      -2px -2px 0 rgba(0, 0, 255, 0.8);
  }
}

@keyframes scanLines {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

@keyframes staticNoise {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 0.15;
  }
}

@keyframes errorText {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(-5deg);
  }
  10%, 30%, 50%, 70%, 90% {
    opacity: 1;
    transform: scale(1.2) rotate(2deg);
  }
  20%, 40%, 60%, 80% {
    opacity: 0.3;
    transform: scale(0.9) rotate(-2deg);
  }
}

.artikel-btn--glitch {
  animation: glitchShift 0.6s ease;
}

.word-frame--glitch {
  animation: glitchShift 0.6s ease, rgbSplit 0.6s ease;
}

.scan-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: scanLines 0.6s linear infinite;
  pointer-events: none;
}

.static-noise {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.4"/></svg>');
  animation: staticNoise 0.3s infinite;
  pointer-events: none;
}

.error-text {
  position: absolute;
  font-size: 60px;
  font-weight: bold;
  color: #FF4444;
  text-shadow: 
    -2px 0 0 rgba(0, 255, 255, 0.8),
    2px 0 0 rgba(255, 0, 0, 0.8);
  animation: errorText 0.8s ease-out;
  font-family: 'Courier New', monospace;
  letter-spacing: 5px;
}
```

**JavaScript Ekle** (`js/core/animations.js`):
```javascript
/**
 * Create glitch error effect for wrong answers
 * @param {HTMLElement} button - The wrong button
 * @param {HTMLElement} wordFrame - The word frame element
 */
export function createGlitchError(button, wordFrame) {
  if (!button) return;

  const glitchContainer = document.createElement('div');
  glitchContainer.className = 'glitch-container';
  glitchContainer.style.position = 'fixed';
  glitchContainer.style.top = '0';
  glitchContainer.style.left = '0';
  glitchContainer.style.width = '100%';
  glitchContainer.style.height = '100%';
  glitchContainer.style.pointerEvents = 'none';
  glitchContainer.style.zIndex = '9998';
  glitchContainer.style.overflow = 'hidden';
  document.body.appendChild(glitchContainer);

  // Scan lines
  const scanLines = document.createElement('div');
  scanLines.className = 'scan-lines';
  glitchContainer.appendChild(scanLines);

  // Static noise
  const noise = document.createElement('div');
  noise.className = 'static-noise';
  glitchContainer.appendChild(noise);

  // ERROR text
  const errorText = document.createElement('div');
  errorText.className = 'error-text';
  errorText.textContent = 'ERROR';
  errorText.style.position = 'absolute';
  errorText.style.top = '50%';
  errorText.style.left = '50%';
  errorText.style.transform = 'translate(-50%, -50%)';
  glitchContainer.appendChild(errorText);

  // Apply glitch to word frame
  if (wordFrame) {
    wordFrame.classList.add('word-frame--glitch');
    setTimeout(() => {
      wordFrame.classList.remove('word-frame--glitch');
    }, 600);
  }

  // Cleanup
  setTimeout(() => {
    if (document.body.contains(glitchContainer)) {
      document.body.removeChild(glitchContainer);
    }
  }, 800);
}
```

**animateWrong() fonksiyonunu güncelle**:
```javascript
export function animateWrong(element) {
  if (!element) return;
  element.classList.add('artikel-btn--glitch');
  
  // Remove class after animation
  setTimeout(() => {
    element.classList.remove('artikel-btn--glitch');
  }, 600);
}
```

---

### 3️⃣ ZAMAN BİTTİ: "Clock Explosion"

**Konsept**: Saat simgesi hızla dönüp patlıyor

**Özellikler**:
- Ekranın ortasında büyük saat simgesi (🕐 veya SVG)
- Saat 1080° (3 tam tur) dönerek büyüyor
- Patlama anında turuncu/sarı dalga efekti
- Saat kolları ve rakamlar etrafa saçılıyor

**CSS Keyframes Ekle** (`css/animations.css`):
```css
/* Clock Explosion Animation */
@keyframes clockSpin {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  40% {
    transform: scale(1.5) rotate(720deg);
    opacity: 1;
  }
  100% {
    transform: scale(3) rotate(1080deg);
    opacity: 0;
  }
}

@keyframes clockWave {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

@keyframes clockPieceScatter {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) rotate(var(--rotate));
    opacity: 0;
  }
}

.clock-icon {
  font-size: 80px;
  animation: clockSpin 1.2s ease-out;
  filter: drop-shadow(0 0 20px rgba(255, 153, 0, 0.8));
}

.clock-wave {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 4px solid rgba(255, 153, 0, 0.7);
  border-radius: 50%;
  animation: clockWave 1s ease-out;
}

.clock-piece {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #FF9900;
  text-shadow: 0 0 10px rgba(255, 153, 0, 0.8);
  animation: clockPieceScatter 1s ease-out forwards;
}
```

**JavaScript Ekle** (`js/core/animations.js`):
```javascript
/**
 * Create clock explosion effect for timeout
 */
export function createClockExplosion() {
  const clockContainer = document.createElement('div');
  clockContainer.className = 'clock-explosion-container';
  clockContainer.style.position = 'fixed';
  clockContainer.style.top = '50%';
  clockContainer.style.left = '50%';
  clockContainer.style.transform = 'translate(-50%, -50%)';
  clockContainer.style.pointerEvents = 'none';
  clockContainer.style.zIndex = '9998';
  clockContainer.style.width = '300px';
  clockContainer.style.height = '300px';
  document.body.appendChild(clockContainer);

  // Clock icon
  const clockIcon = document.createElement('div');
  clockIcon.className = 'clock-icon';
  clockIcon.textContent = '🕐';
  clockIcon.style.position = 'absolute';
  clockIcon.style.top = '50%';
  clockIcon.style.left = '50%';
  clockIcon.style.transform = 'translate(-50%, -50%)';
  clockContainer.appendChild(clockIcon);

  // Waves (3 layers)
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'clock-wave';
    wave.style.position = 'absolute';
    wave.style.top = '50%';
    wave.style.left = '50%';
    wave.style.animationDelay = `${i * 0.2}s`;
    clockContainer.appendChild(wave);
  }

  // Clock numbers (12 pieces)
  const pieces = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  pieces.forEach((num, i) => {
    const piece = document.createElement('div');
    piece.className = 'clock-piece';
    piece.textContent = num;
    piece.style.position = 'absolute';
    piece.style.top = '50%';
    piece.style.left = '50%';
    
    // Circular scatter
    const angle = (Math.PI * 2 * i) / 12;
    const distance = 150 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rotate = Math.random() * 720 - 360;
    
    piece.style.setProperty('--x', `${tx}px`);
    piece.style.setProperty('--y', `${ty}px`);
    piece.style.setProperty('--rotate', `${rotate}deg`);
    piece.style.animationDelay = '0.4s';
    
    clockContainer.appendChild(piece);
  });

  // Cleanup
  setTimeout(() => {
    if (document.body.contains(clockContainer)) {
      document.body.removeChild(clockContainer);
    }
  }, 1800);
}
```

---

## 🔧 OYUN DOSYALARINI GÜNCELLE

Her oyun dosyasında (`js/games/der-die-dash.js`, `case-control.js`, vb.) şu değişiklikleri yap:

### Import satırını güncelle:
```javascript
// ESKİ:
import { animateCorrect, animateWrong, createConfetti, createWrongAnimation, createTimeoutAnimation } from '../core/animations.js';

// YENİ:
import { animateCorrect, animateWrong, createNeonGlow, createGlitchError, createClockExplosion } from '../core/animations.js';
```

### handleAnswer() fonksiyonunda:

**Doğru cevap için**:
```javascript
// ESKİ:
if (isCorrect) {
  animateCorrect(selectedButton);
  createConfetti(elements.wordFrame);
}

// YENİ:
if (isCorrect) {
  animateCorrect(selectedButton);
  createNeonGlow(selectedButton, elements.wordFrame);
}
```

**Yanlış cevap için**:
```javascript
// ESKİ:
if (!isCorrect) {
  animateWrong(selectedButton);
  createWrongAnimation(elements.wordFrame);
}

// YENİ:
if (!isCorrect) {
  animateWrong(selectedButton);
  createGlitchError(selectedButton, elements.wordFrame);
}
```

**Timeout için**:
```javascript
// ESKİ:
if (isTimeout) {
  createTimeoutAnimation(elements.wordFrame);
}

// YENİ:
if (isTimeout) {
  createClockExplosion();
}
```

---

## ✅ KONTROL LİSTESİ

Şunları yaptığından emin ol:

1. ✅ `css/animations.css` dosyasına yeni keyframes'leri ekle
2. ✅ `js/core/animations.js` dosyasındaki 3 fonksiyonu güncelle/değiştir:
   - `createNeonGlow(button, wordFrame)`
   - `createGlitchError(button, wordFrame)`
   - `createClockExplosion()`
3. ✅ `animateCorrect()` ve `animateWrong()` fonksiyonlarını güncelle
4. ✅ Her oyun dosyasında import ve fonksiyon çağrılarını güncelle:
   - `der-die-dash.js`
   - `case-control.js`
   - `word-salad.js`
   - `translation-quest.js`
   - `five-letter-blitz.js`
5. ✅ Animasyonların mobilde de düzgün çalıştığını test et
6. ✅ Console'da hata olmadığını kontrol et

---

## 🎯 ÖNEMLİ NOTLAR

### Performans
- `transform` ve `opacity` kullan (GPU-accelerated)
- `will-change` property'sini dikkatli kullan
- Mobilde animasyon süresini kısalt (0.6s → 0.4s)

### Temizlik
- `setTimeout` ile DOM elementlerini temizle
- Animation bitişini `animationend` event ile dinle
- Memory leak olmaması için event listener'ları temizle

### Accessibility
- `prefers-reduced-motion` media query ekle:
```css
@media (prefers-reduced-motion: reduce) {
  .artikel-btn--neon,
  .artikel-btn--glitch,
  .clock-icon {
    animation: none !important;
  }
}
```

### Browser Compatibility
- CSS filter effects modern browserlarda çalışır
- Fallback için basit animasyon ekle
- Safari için `-webkit-` prefix ekle

---

## 🚀 BAŞLA!

Yukarıdaki talimatları takip et ve animasyonları güncelle. Her adımı sırayla yap ve test et!

**Animasyon Özellikleri:**
- ✅ **Neon Glow**: Retro, parlak, 80s vibes
- ❌ **Glitch Error**: Modern, dramatic, cyberpunk
- ⏱️ **Clock Explosion**: Tematik, anlaşılır, smooth

Bu kombinasyon çok modern ve tech-savvy bir his verecek! 🔥
