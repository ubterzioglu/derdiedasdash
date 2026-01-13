/* ============================================
   DER DIE DAS SPACE - ANIMATIONS
   Correct/wrong answer animations
   ============================================ */

/**
 * Create confetti effect for correct answers
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
 * Add correct answer animation classes
 * NOTE: Confetti is NOT triggered here - call createConfetti separately only for correct user answers
 */
export function animateCorrect(element) {
  if (!element) return;
  
  element.classList.add('artikel-btn--correct', 'word-frame--correct', 'form-btn--correct', 'translation-option--correct', 'sentence-builder--correct', 'letter-builder--correct');
}

/**
 * Add wrong answer animation classes
 */
export function animateWrong(element) {
  if (!element) return;
  
  element.classList.add('artikel-btn--wrong', 'word-frame--wrong', 'form-btn--wrong', 'translation-option--wrong', 'sentence-builder--wrong', 'letter-builder--wrong', 'preposition-frame--wrong');
}

/**
 * Create wrong answer animation (red flash/shake)
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
 * Create timeout animation (pulse/fade effect)
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
