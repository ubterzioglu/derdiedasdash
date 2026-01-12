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
 */
export function animateCorrect(element) {
  if (!element) return;
  
  element.classList.add('artikel-btn--correct', 'word-frame--correct', 'form-btn--correct', 'translation-option--correct', 'sentence-builder--correct', 'letter-builder--correct');
  
  // Trigger confetti
  createConfetti(element);
}

/**
 * Add wrong answer animation classes
 */
export function animateWrong(element) {
  if (!element) return;
  
  element.classList.add('artikel-btn--wrong', 'word-frame--wrong', 'form-btn--wrong', 'translation-option--wrong', 'sentence-builder--wrong', 'letter-builder--wrong', 'preposition-frame--wrong');
}
