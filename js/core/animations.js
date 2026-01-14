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
 * Create neon glow effect for correct answers (V2 - Dramatic Edition)
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

/**
 * Create artikel explosion effect for correct answers (ESKİ - Geriye dönük uyumluluk için)
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
 * Create floating success message animation (screen-based)
 */
export function createFloatingSuccessMessage() {
  const message = document.createElement('div');
  message.className = 'floating-message';
  message.textContent = '✓ Correct!';

  const wash = document.createElement('div');
  wash.className = 'color-wash';

  document.body.appendChild(wash);
  document.body.appendChild(message);

  setTimeout(() => {
    if (document.body.contains(message)) {
      document.body.removeChild(message);
    }
    if (document.body.contains(wash)) {
      document.body.removeChild(wash);
    }
  }, 1200);
}

/**
 * Create warning lines animation (screen-based)
 */
export function createWarningLines() {
  const line1 = document.createElement('div');
  line1.className = 'warning-line warning-line-1';

  const line2 = document.createElement('div');
  line2.className = 'warning-line warning-line-2';

  document.body.appendChild(line1);
  document.body.appendChild(line2);

  setTimeout(() => {
    if (document.body.contains(line1)) {
      document.body.removeChild(line1);
    }
    if (document.body.contains(line2)) {
      document.body.removeChild(line2);
    }
  }, 600);
}

/**
 * Add correct answer animation classes
 * NOTE: Neon glow is NOT triggered here - call createNeonGlow separately only for correct user answers
 */
export function animateCorrect(element) {
  if (!element) return;
  
  // V2 - Dramatic Edition: Neon glow class
  if (element.classList.contains('artikel-btn')) {
    element.classList.add('artikel-btn--neon');
    // Remove class after animation
    setTimeout(() => {
      element.classList.remove('artikel-btn--neon');
    }, 800);
  } else {
    // Eski animasyonları da destekle (geriye dönük uyumluluk)
    element.classList.add('artikel-btn--correct', 'word-frame--correct', 'form-btn--correct', 'translation-option--correct', 'sentence-builder--correct', 'letter-builder--correct');
  }

  createFloatingSuccessMessage();
}

/**
 * Add wrong answer animation classes
 */
export function animateWrong(element) {
  if (!element) return;
  
  // V2 - Dramatic Edition: Glitch class
  if (element.classList.contains('artikel-btn')) {
    element.classList.add('artikel-btn--glitch');
    // Remove class after animation
    setTimeout(() => {
      element.classList.remove('artikel-btn--glitch');
    }, 600);
  } else {
    // Eski animasyonları da destekle (geriye dönük uyumluluk)
    element.classList.add('artikel-btn--wrong', 'word-frame--wrong', 'form-btn--wrong', 'translation-option--wrong', 'sentence-builder--wrong', 'letter-builder--wrong', 'preposition-frame--wrong');
  }

  createWarningLines();
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
 * Create glitch error effect for wrong answers (V2 - Dramatic Edition)
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

/**
 * Create shatter effect for wrong answers (ESKİ - Geriye dönük uyumluluk için)
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
 * Create clock explosion effect for timeout (V2 - Dramatic Edition)
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
