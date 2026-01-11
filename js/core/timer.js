/* ============================================
   DER DIE DAS SPACE - TIMER SYSTEM
   Game timer component
   ============================================ */

/**
 * Timer class for game countdown
 */
export class GameTimer {
  constructor(maxTime, onTick, onComplete) {
    this.maxTime = maxTime;
    this.currentTime = maxTime;
    this.onTick = onTick || (() => {});
    this.onComplete = onComplete || (() => {});
    this.intervalId = null;
    this.isRunning = false;
    this.startTime = null;
    this.timeUsed = 0;
  }

  /**
   * Start the timer
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.currentTime = this.maxTime;
    
    this.intervalId = setInterval(() => {
      this.currentTime--;
      this.timeUsed = (Date.now() - this.startTime) / 1000;
      
      if (this.onTick) {
        this.onTick(this.currentTime, this.timeUsed);
      }
      
      if (this.currentTime <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete(this.timeUsed);
        }
      }
    }, 1000);
    
    // Initial tick
    if (this.onTick) {
      this.onTick(this.currentTime, 0);
    }
  }

  /**
   * Stop the timer
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    if (this.startTime) {
      this.timeUsed = (Date.now() - this.startTime) / 1000;
    }
  }

  /**
   * Reset the timer
   */
  reset() {
    this.stop();
    this.currentTime = this.maxTime;
    this.timeUsed = 0;
    this.startTime = null;
  }

  /**
   * Get current time
   */
  getCurrentTime() {
    return this.currentTime;
  }

  /**
   * Get time used in seconds
   */
  getTimeUsed() {
    if (this.isRunning && this.startTime) {
      return (Date.now() - this.startTime) / 1000;
    }
    return this.timeUsed;
  }

  /**
   * Check if timer is running
   */
  getIsRunning() {
    return this.isRunning;
  }
}

/**
 * Format seconds to MM:SS or SS format
 */
export function formatTime(seconds) {
  const secs = Math.max(0, Math.floor(seconds));
  
  if (secs < 60) {
    return `${secs}s`;
  }
  
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
}

/**
 * Create timer display element
 */
export function createTimerDisplay(maxTime) {
  const timerEl = document.createElement('div');
  timerEl.className = 'timer';
  timerEl.innerHTML = `
    <span>⏱</span>
    <span class="timer-value">${maxTime}s</span>
  `;
  
  return timerEl;
}

/**
 * Update timer display
 */
export function updateTimerDisplay(timerEl, currentTime) {
  const timerValue = timerEl.querySelector('.timer-value');
  if (timerValue) {
    timerValue.textContent = `${currentTime}s`;
    
    // Add warning class if time is low
    if (currentTime <= 2) {
      timerEl.classList.add('timer--warning');
    } else {
      timerEl.classList.remove('timer--warning');
    }
  }
}
