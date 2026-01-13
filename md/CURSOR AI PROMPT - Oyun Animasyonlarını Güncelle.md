# CURSOR AI PROMPT - Oyun Animasyonlarını Güncelle

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

### 1️⃣ DOĞRU CEVAP: "Artikel Explosion"

**Konsept**: Seçilen artikel rengine göre özelleşmiş patlama efekti

**Özellikler**:
- Buton 360° dönerek büyüyüp küçülür (scale 1 → 1.3 → 1)
- Artikel rengine göre dinamik glow efekti:
  - `der` butonu için: `#0099FF` (mavi)
  - `die` butonu için: `#FF5C6E` (kırmızı/coral)
  - `das` butonu için: `#FFCC00` (sarı)
- Merkezden dışa doğru ışık dalgaları (box-shadow expansion)
- 20-30 adet artikel renginde parçacık (sparkles) - confetti yerine
- Parçacıklar yukarı doğru yükselip kaybolur

**CSS Keyframes Ekle** (`css/animations.css`):
```css
@keyframes artikelExplosion {
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 0 var(--artikel-glow);
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    box-shadow: 0 0 60px 20px var(--artikel-glow);
  }
  100% {
    transform: scale(1) rotate(360deg);
    box-shadow: 0 0 0 0 var(--artikel-glow);
  }
}

@keyframes sparkleRise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-150px) scale(0);
    opacity: 0;
  }
}

.artikel-btn--explosion {
  animation: artikelExplosion 0.6s ease-out;
}

.sparkle-particle {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: sparkleRise 1s ease-out forwards;
}
```

**JavaScript Güncelle** (`js/core/animations.js`):

`createConfetti()` fonksiyonunu `createArtikelExplosion(container, artikelColor)` ile değiştir:

```javascript
/**
 * Create artikel explosion effect for correct answers
 * @param {HTMLElement} container - The button element
 * @param {string} artikelColor - 'der' | 'die' | 'das'
 */
export function createArtikelExplosion(container, artikelColor) {
  if (!container) return;

  // Artikel renklerini belirle
  const colors = {
    der: '#0099FF',  // mavi
    die: '#FF5C6E',  // coral/kırmızı
    das: '#FFCC00'   // sarı
  };
  
  const color = colors[artikelColor] || '#88CC00';
  
  // Sparkle container oluştur
  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'sparkle-container';
  sparkleContainer.style.position = 'fixed';
  sparkleContainer.style.top = '0';
  sparkleContainer.style.left = '0';
  sparkleContainer.style.width = '100%';
  sparkleContainer.style.height = '100%';
  sparkleContainer.style.pointerEvents = 'none';
  sparkleContainer.style.zIndex = '9999';
  document.body.appendChild(sparkleContainer);

  // Button pozisyonunu al
  const rect = container.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 25 adet sparkle parçacığı oluştur
  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'sparkle-particle';
    
    // Parçacık stilini ayarla
    particle.style.background = color;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    particle.style.boxShadow = `0 0 10px ${color}`;
    
    // Rastgele yön ve hız
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity - 100; // Yukarı bias
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.animationDelay = `${Math.random() * 0.1}s`;
    
    sparkleContainer.appendChild(particle);
  }

  // Temizlik
  setTimeout(() => {
    if (document.body.contains(sparkleContainer)) {
      document.body.removeChild(sparkleContainer);
    }
  }, 1200);
}
```

**CSS'e ekle**:
```css
.sparkle-particle {
  animation: sparkleRise 1s ease-out forwards;
}

@keyframes sparkleRise {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}
```

**animateCorrect() fonksiyonunu güncelle**:
```javascript
export function animateCorrect(element) {
  if (!element) return;
  element.classList.add('artikel-btn--explosion');
}
```

---

### 2️⃣ YANLIŞ CEVAP: "Crack & Shatter"

**Konsept**: Buton çatlayıp 6 parçaya bölünüp dağılıyor

**Özellikler**:
- Buton üzerinde çatlak çizgileri beliriyor
- Buton 6 parçaya bölünüp dağılıyor
- Her parça farklı yöne ve rotasyonla düşüyor
- Doğru cevap butonu hafifçe parlıyor (hint)

**CSS Keyframes Ekle** (`css/animations.css`):
```css
@keyframes crackAppear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shatterPiece {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(var(--x), var(--y)) rotate(var(--rotate));
    opacity: 0;
  }
}

@keyframes hintGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(136, 204, 0, 0);
  }
  50% {
    box-shadow: 0 0 20px 5px rgba(136, 204, 0, 0.6);
  }
}

.crack-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,...'); /* SVG çatlak deseni */
  animation: crackAppear 0.2s ease-out;
  pointer-events: none;
}

.shatter-piece {
  position: absolute;
  background: var(--color-danger);
  animation: shatterPiece 0.8s ease-out forwards;
}

.artikel-btn--hint {
  animation: hintGlow 1s ease-in-out 2;
}
```

**JavaScript Güncelle** (`js/core/animations.js`):

`createWrongAnimation()` fonksiyonunu `createShatterEffect(wrongButton, correctButton)` ile değiştir:

```javascript
/**
 * Create shatter effect for wrong answers
 * @param {HTMLElement} wrongButton - The wrong button clicked
 * @param {HTMLElement} correctButton - The correct button to hint
 */
export function createShatterEffect(wrongButton, correctButton) {
  if (!wrongButton) return;

  const shatterContainer = document.createElement('div');
  shatterContainer.className = 'shatter-container';
  shatterContainer.style.position = 'fixed';
  shatterContainer.style.top = '0';
  shatterContainer.style.left = '0';
  shatterContainer.style.width = '100%';
  shatterContainer.style.height = '100%';
  shatterContainer.style.pointerEvents = 'none';
  shatterContainer.style.zIndex = '9998';
  document.body.appendChild(shatterContainer);

  // Button pozisyonu
  const rect = wrongButton.getBoundingClientRect();
  
  // 6 parça oluştur
  const pieces = 6;
  const pieceWidth = rect.width / 3;
  const pieceHeight = rect.height / 2;
  
  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement('div');
    piece.className = 'shatter-piece';
    
    // Parça pozisyonu
    const row = Math.floor(i / 3);
    const col = i % 3;
    
    piece.style.left = `${rect.left + col * pieceWidth}px`;
    piece.style.top = `${rect.top + row * pieceHeight}px`;
    piece.style.width = `${pieceWidth}px`;
    piece.style.height = `${pieceHeight}px`;
    
    // Rastgele yön ve rotasyon
    const tx = (Math.random() - 0.5) * 200;
    const ty = 100 + Math.random() * 100;
    const rotate = (Math.random() - 0.5) * 720;
    
    piece.style.setProperty('--x', `${tx}px`);
    piece.style.setProperty('--y', `${ty}px`);
    piece.style.setProperty('--rotate', `${rotate}deg`);
    
    shatterContainer.appendChild(piece);
  }

  // Doğru butonu vurgula
  if (correctButton) {
    correctButton.classList.add('artikel-btn--hint');
    setTimeout(() => {
      correctButton.classList.remove('artikel-btn--hint');
    }, 2000);
  }

  // Temizlik
  setTimeout(() => {
    if (document.body.contains(shatterContainer)) {
      document.body.removeChild(shatterContainer);
    }
  }, 1000);
}
```

**animateWrong() fonksiyonunu güncelle**:
```javascript
export function animateWrong(element) {
  if (!element) return;
  // Shake animasyonunu koru ama daha hafif
  element.classList.add('artikel-btn--wrong-shake');
}
```

**CSS ekle**:
```css
@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.artikel-btn--wrong-shake {
  animation: wrongShake 0.3s ease;
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

@keyframes clockExplode {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes waveExpand {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(3);
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
}

.clock-wave {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 3px solid rgba(255, 153, 0, 0.6);
  border-radius: 50%;
  animation: waveExpand 1s ease-out;
}

.clock-piece {
  position: absolute;
  animation: clockPieceScatter 1s ease-out forwards;
}
```

**JavaScript Güncelle** (`js/core/animations.js`):

`createTimeoutAnimation()` fonksiyonunu `createClockExplosion()` ile değiştir:

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

  // Saat ikonu (emoji veya SVG)
  const clockIcon = document.createElement('div');
  clockIcon.className = 'clock-icon';
  clockIcon.textContent = '🕐';
  clockIcon.style.position = 'absolute';
  clockIcon.style.top = '50%';
  clockIcon.style.left = '50%';
  clockIcon.style.transform = 'translate(-50%, -50%)';
  clockContainer.appendChild(clockIcon);

  // Dalga efektleri (3 adet)
  for (let i = 0; i < 3; i++) {
    const wave = document.createElement('div');
    wave.className = 'clock-wave';
    wave.style.position = 'absolute';
    wave.style.top = '50%';
    wave.style.left = '50%';
    wave.style.transform = 'translate(-50%, -50%)';
    wave.style.animationDelay = `${i * 0.2}s`;
    clockContainer.appendChild(wave);
  }

  // Saat parçaları (12 adet - saat rakamları)
  const pieces = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  pieces.forEach((num, i) => {
    const piece = document.createElement('div');
    piece.className = 'clock-piece';
    piece.textContent = num;
    piece.style.position = 'absolute';
    piece.style.top = '50%';
    piece.style.left = '50%';
    piece.style.fontSize = '20px';
    piece.style.fontWeight = 'bold';
    piece.style.color = '#FF9900';
    
    // Dairesel dağılım
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

  // Temizlik
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
import { animateCorrect, animateWrong, createArtikelExplosion, createShatterEffect, createClockExplosion } from '../core/animations.js';
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
  const artikel = selectedArticle; // 'der', 'die', veya 'das'
  animateCorrect(selectedButton);
  createArtikelExplosion(selectedButton, artikel);
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
  const correctButton = document.querySelector(`[data-article="${correctArticle}"]`);
  animateWrong(selectedButton);
  createShatterEffect(selectedButton, correctButton);
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
2. ✅ `js/core/animations.js` dosyasındaki 3 fonksiyonu güncelle/değiştir
3. ✅ Her oyun dosyasında (`der-die-dash.js`, `case-control.js`, vb.) import ve fonksiyon çağrılarını güncelle
4. ✅ Animasyonların mobilde de düzgün çalıştığını test et
5. ✅ Performans için `will-change` property'lerini ekle
6. ✅ Console'da hata olmadığını kontrol et

---

## 🎯 ÖNEMLİ NOTLAR

- **Performans**: `transform` ve `opacity` kullan (GPU-accelerated)
- **Temizlik**: `setTimeout` ile DOM elementlerini temizle
- **Mobil**: Parçacık sayısını mobilde azalt (isMobile check ekle)
- **Accessibility**: Animasyonları `prefers-reduced-motion` media query ile kontrol et

---

## 🚀 BAŞLA!

Yukarıdaki talimatları takip et ve animasyonları güncelle. Sorularım olursa sor!
