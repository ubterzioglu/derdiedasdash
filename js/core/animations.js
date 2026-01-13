/* ============================================
   DER DIE DAS SPACE - ANIMATIONS
   Correct/wrong answer animations
   ============================================ */

/**
 * Create confetti effect for correct answers (ESKİ - Geriye dönük uyumluluk için)
 */
export function createConfetti(container) {
  if (!container) return;

  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  document.body.appendChild(confettiContainer);

  const colors = ['#4444FF', '#FF4444', '#FFD700', '#44FF44'];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = '-10px';
    particle.style.animationDelay = `${Math.random() * 0.5}s`;
    particle.style.animationDuration = `${0.8 + Math.random() * 0.7}s`;
    
    confettiContainer.appendChild(particle);
  }

  // Remove after animation
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 2000);
}

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
  
  // Butona glow efekti ekle
  container.style.setProperty('--artikel-glow', color);
  container.classList.add('artikel-btn--explosion');
  
  // Sparkle container oluştur
  const sparkleContainer = document.createElement('div');
  sparkleContainer.className = 'sparkle-container';
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

  // Explosion class'ını kaldır
  setTimeout(() => {
    container.classList.remove('artikel-btn--explosion');
  }, 600);

  // Temizlik
  setTimeout(() => {
    if (document.body.contains(sparkleContainer)) {
      document.body.removeChild(sparkleContainer);
    }
  }, 1200);
}

/**
 * Add correct answer animation classes
 * NOTE: Artikel explosion is NOT triggered here - call createArtikelExplosion separately only for correct user answers
 */
export function animateCorrect(element) {
  if (!element) return;
  
  // Eski animasyonları da destekle (geriye dönük uyumluluk)
  element.classList.add('artikel-btn--correct', 'word-frame--correct', 'form-btn--correct', 'translation-option--correct', 'sentence-builder--correct', 'letter-builder--correct');
}

/**
 * Add wrong answer animation classes
 */
export function animateWrong(element) {
  if (!element) return;
  
  // Shake animasyonunu ekle (daha hafif)
  if (element.classList.contains('artikel-btn')) {
    element.classList.add('artikel-btn--wrong-shake');
  } else {
    element.classList.add('artikel-btn--wrong', 'word-frame--wrong', 'form-btn--wrong', 'translation-option--wrong', 'sentence-builder--wrong', 'letter-builder--wrong', 'preposition-frame--wrong');
  }
}

/**
 * Create wrong answer animation (red flash/shake) (ESKİ - Geriye dönük uyumluluk için)
 */
export function createWrongAnimation(container) {
  if (!container) return;

  const wrongContainer = document.createElement('div');
  wrongContainer.className = 'wrong-animation-container';
  document.body.appendChild(wrongContainer);

  // Create red flash overlay
  const flash = document.createElement('div');
  flash.className = 'wrong-flash';
  wrongContainer.appendChild(flash);

  // Remove after animation
  setTimeout(() => {
    if (document.body.contains(wrongContainer)) {
      document.body.removeChild(wrongContainer);
    }
  }, 600);
}

/**
 * Create shatter effect for wrong answers
 * @param {HTMLElement} wrongButton - The wrong button clicked
 * @param {HTMLElement} correctButton - The correct button to hint
 */
export function createShatterEffect(wrongButton, correctButton) {
  if (!wrongButton) return;

  const shatterContainer = document.createElement('div');
  shatterContainer.className = 'shatter-container';
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
    
    // Butonun arka plan rengini kopyala
    const computedStyle = window.getComputedStyle(wrongButton);
    piece.style.background = computedStyle.background || computedStyle.backgroundColor || '#FF4444';
    piece.style.borderRadius = computedStyle.borderRadius || '0';
    
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

/**
 * Create negative confetti effect for wrong answers (like confetti but negative)
 * Red/black particles falling down
 */
export function createWrongConfetti(container) {
  if (!container) return;

  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'wrong-confetti-container';
  document.body.appendChild(confettiContainer);

  const colors = ['#FF4444', '#CC0000', '#990000', '#000000', '#333333'];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'wrong-confetti-particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = '-10px';
    particle.style.animationDelay = `${Math.random() * 0.5}s`;
    particle.style.animationDuration = `${0.8 + Math.random() * 0.7}s`;
    
    confettiContainer.appendChild(particle);
  }

  // Remove after animation
  setTimeout(() => {
    if (document.body.contains(confettiContainer)) {
      document.body.removeChild(confettiContainer);
    }
  }, 2000);
}

/**
 * Create timeout animation (pulse/fade effect) (ESKİ - Geriye dönük uyumluluk için)
 */
export function createTimeoutAnimation(container) {
  if (!container) return;

  const timeoutContainer = document.createElement('div');
  timeoutContainer.className = 'timeout-animation-container';
  document.body.appendChild(timeoutContainer);

  // Create pulse rings
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'timeout-ring';
    ring.style.animationDelay = `${i * 0.2}s`;
    timeoutContainer.appendChild(ring);
  }

  // Remove after animation
  setTimeout(() => {
    if (document.body.contains(timeoutContainer)) {
      document.body.removeChild(timeoutContainer);
    }
  }, 1500);
}

/**
 * Create clock explosion effect for timeout
 */
export function createClockExplosion() {
  const clockContainer = document.createElement('div');
  clockContainer.className = 'clock-explosion-container';
  document.body.appendChild(clockContainer);

  // Saat ikonu (emoji)
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
    wave.style.animationDelay = `${i * 0.2}s`;
    clockContainer.appendChild(wave);
  }

  // Saat parçaları (12 adet - saat rakamları)
  const pieces = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  pieces.forEach((num, i) => {
    const piece = document.createElement('div');
    piece.className = 'clock-piece';
    piece.textContent = num;
    
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
