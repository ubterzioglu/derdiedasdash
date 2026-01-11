/* ============================================
   DER DIE DAS SPACE - REFERRAL SYSTEM
   WhatsApp referral link sharing
   ============================================ */

/**
 * Share referral link on WhatsApp
 * @param {string} referralCode - User's referral code
 * @param {string} displayName - User's display name
 */
export function shareOnWhatsApp(referralCode, displayName = 'Ben') {
  const link = `${window.location.origin}?ref=${referralCode}`;
  const lang = localStorage.getItem('language') || 'tr';
  
  let message = '';
  
  if (lang === 'tr') {
    message = `🇩🇪 Almanca öğrenirken eğlen!\n\n` +
              `Der Die Das Space'e katıl, benimle yarış!\n\n` +
              `${link}\n\n` +
              `✨ İkimiz de 50 puan kazanıyoruz!`;
  } else {
    message = `🇩🇪 Learn German while having fun!\n\n` +
              `Join Der Die Das Space, compete with me!\n\n` +
              `${link}\n\n` +
              `✨ We both earn 50 points!`;
  }
  
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
}

/**
 * Copy referral link to clipboard
 * @param {string} referralCode - User's referral code
 * @returns {Promise<boolean>} Success status
 */
export async function copyReferralLink(referralCode) {
  const link = `${window.location.origin}?ref=${referralCode}`;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(link);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return false;
  }
}

/**
 * Get referral code from URL
 * @returns {string|null} Referral code or null
 */
export function getReferralFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

/**
 * Generate referral code for user
 * @param {string} userId - User ID
 * @returns {string} Referral code
 */
export function generateReferralCode(userId) {
  // Simple referral code: first 8 chars of user ID + random 4 chars
  const prefix = userId.substring(0, 8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${random}`;
}
