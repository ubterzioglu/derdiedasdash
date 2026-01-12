/* ============================================
   DER DIE DAS SPACE - i18n SYSTEM
   Çok dilli destek (TR/EN)
   ============================================ */

const translations = {
  tr: {
    // Common
    start: 'Başla',
    login: 'Giriş Yap',
    logout: 'Çıkış',
    register: 'Kayıt Ol',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    back: 'Geri',
    next: 'Sonraki',
    submit: 'Gönder',
    loading: 'Yükleniyor...',
    
    // Page specific
    chooseLanguage: 'Dilinizi Seçin',
    chooseLanguageSub: 'Choose Your Language',
    welcomeBack: 'Hoş Geldin!',
    profile: 'Profil',
    howToPlay: '❓ Nasıl Oynanır?',
    selectGame: 'Oyununu Seç!',
    allGamesFree: '🎮 Tüm Oyunlar Ücretsiz!',
    registerPrompt: 'Skorunuzu kaydetmek için kayıt olun',

    // Hero Section
    heroTitle: 'Almanca Artikellerini Oyunla Öğren!',
    heroSubtitle: 'Der, Die, Das artikellerini 5 eğlenceli oyunla master et. Ücretsiz, eğlenceli ve etkili!',
    startLearning: 'Öğrenmeye Başla 🚀',
    exploreGames: 'Oyunları Keşfet',
    
    // Game UI
    correct: 'Doğru!',
    wrong: 'Yanlış!',
    timeUp: 'Süre Doldu!',
    score: 'Skor',
    combo: 'Combo',
    question: 'Soru',
    of: '/',
    seconds: 'saniye',
    timer: 'Süre',
    questions: 'Soru',
    
    // Set Summary
    setComplete: 'Set Tamamlandı!',
    yourScore: 'Skorunuz',
    correctAnswers: 'Doğru Cevaplar',
    wrongAnswers: 'Yanlış Cevaplar',
    maxCombo: 'Max Combo',
    avgTime: 'Ortalama Süre',
    accuracy: 'Doğruluk',
    speedBonus: 'Hız Bonusu',
    comboBonus: 'Combo Bonusu',
    penalty: 'Ceza',
    baseScore: 'Temel Puan',
    normalizedScore: 'Normalized Skor',
    globalRank: 'Global Sıralama',
    backToHome: 'Ana Sayfaya Dön',
    viewLeaderboard: 'Skor Tablosunu Gör',
    
    // Leaderboard
    leaderboard: 'Skor Tablosu',
    rank: 'Sıra',
    player: 'Oyuncu',
    game: 'Oyun',
    level: 'Seviye',
    globalLeaderboard: 'Global Liderlik',
    gameLeaderboard: 'Oyun Liderliği',
    
    // Stats
    totalScore: 'Toplam Skor:',
    completedSets: 'Tamamlanan Set:',
    recentBadges: 'Son Kazanılan Badge\'ler:',
    viewProfile: 'Profile Git',
    
    // Levels
    level1: 'Kolay',
    level2: 'Orta-Kolay',
    level3: 'Orta',
    level4: 'Zor',
    level5: 'Çok Zor',
    
    // Games
    derDieDash: 'Der Die Dash',
    derDieDashDesc: 'Artikel tahmin oyunu',
    caseControl: 'Case Control',
    caseControlDesc: 'Preposition challenge',
    wordSalad: 'Word Salad',
    wordSaladDesc: 'Kelimelerden cümle kur',
    translationQuest: 'Translation Quest',
    translationQuestDesc: 'Almanca → TR/EN çeviri',
    fiveLetterBlitz: '5-Letter Blitz',
    fiveLetterBlitzDesc: '5 harfi sırala',
    
    // Badges
    badges: 'Rozetler',
    earnedBadges: 'Kazanılan Rozetler',
    newBadge: 'Yeni Rozet!',
    badgeEarned: 'Rozet Kazandın!',
    badgesEarned: 'Badge Kazandın',
    viewAllBadges: 'Tüm badge\'leri gör',
    
    // Errors
    errorGeneric: 'Bir hata oluştu',
    errorNetwork: 'Bağlantı hatası',
    errorAuth: 'Kimlik doğrulama hatası',
    errorInvalidInput: 'Geçersiz giriş',
    
    // Auth
    emailPlaceholder: 'E-posta adresiniz',
    passwordPlaceholder: 'Şifreniz',
    displayNamePlaceholder: 'Adınız',
    loginWithGoogle: 'Google ile Giriş',
    loginWithEmail: 'E-posta ile Giriş',
    dontHaveAccount: 'Hesabınız yok mu?',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    
    // Demo
    demoMode: 'Demo Modu',
    demoMessage: 'Kayıt olmadan oynuyorsunuz. Skorunuz kaydedilmeyecek.',
    registerToSave: 'Skorunuzu kaydetmek için kayıt olun',
    
    // Actions
    reset: 'RESET',
    go: 'GO ➜',
    ok: 'OK',
    completed: 'Tamamlandı',
    correctAnswer: 'Doğru Cevap',
    copied: 'Kopyalandı!',
    
    // Time
    date: 'Tarih',
    ago: 'önce',
    justNow: 'Az önce',
    
    // Game instructions
    clickWordsToBuild: 'Kelimelere tıklayarak cümleyi oluştur',
    clickLettersToBuild: 'Harflere tıklayarak kelimeyi oluştur',
    
    // How to Play
    howToPlayDesc1: 'Her oyundan 1 set ücretsiz oynayabilirsiniz!',
    howToPlayDesc2: 'Kayıt olun, skorunuzu kaydedin, badge kazanın!',
    scoringSystem: 'Puanlama Sistemi:',
    scoringBase: 'Base puan: Zorluk seviyesine göre (20-30 puan)',
    scoringSpeed: 'Hız bonusu: Hızlı cevap vererek ekstra puan kazan',
    scoringCombo: 'Combo bonusu: Üst üste doğru cevaplarla combo yakala!',
    difficultyLevels: 'Zorluk Seviyeleri:',
    play: 'OYNA >',
  },
  
  en: {
    // Common
    start: 'Start',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    loading: 'Loading...',
    
    // Page specific
    chooseLanguage: 'Choose Your Language',
    chooseLanguageSub: 'Dilinizi Seçin',
    welcomeBack: 'Welcome Back!',
    profile: 'Profile',
    howToPlay: '❓ How to Play?',
    selectGame: 'Choose Your Game!',
    allGamesFree: '🎮 All Games Free!',
    registerPrompt: 'Register to save your score',

    // Hero Section
    heroTitle: 'Learn German Articles with Games!',
    heroSubtitle: 'Master Der, Die, Das articles with 5 fun games. Free, fun, and effective!',
    startLearning: 'Start Learning 🚀',
    exploreGames: 'Explore Games',
    
    // Game UI
    correct: 'Correct!',
    wrong: 'Wrong!',
    timeUp: 'Time\'s Up!',
    score: 'Score',
    combo: 'Combo',
    question: 'Question',
    of: 'of',
    seconds: 'seconds',
    timer: 'Timer',
    questions: 'Questions',
    
    // Set Summary
    setComplete: 'Set Complete!',
    yourScore: 'Your Score',
    correctAnswers: 'Correct Answers',
    wrongAnswers: 'Wrong Answers',
    maxCombo: 'Max Combo',
    avgTime: 'Average Time',
    accuracy: 'Accuracy',
    speedBonus: 'Speed Bonus',
    comboBonus: 'Combo Bonus',
    penalty: 'Penalty',
    baseScore: 'Base Score',
    normalizedScore: 'Normalized Score',
    globalRank: 'Global Rank',
    backToHome: 'Back to Home',
    viewLeaderboard: 'View Leaderboard',
    
    // Leaderboard
    leaderboard: 'Leaderboard',
    rank: 'Rank',
    player: 'Player',
    game: 'Game',
    level: 'Level',
    globalLeaderboard: 'Global Leaderboard',
    gameLeaderboard: 'Game Leaderboard',
    
    // Stats
    totalScore: 'Total Score:',
    completedSets: 'Completed Sets:',
    recentBadges: 'Recent Badges:',
    viewProfile: 'View Profile',
    
    // Levels
    level1: 'Easy',
    level2: 'Medium-Easy',
    level3: 'Medium',
    level4: 'Hard',
    level5: 'Very Hard',
    
    // Games
    derDieDash: 'Der Die Dash',
    derDieDashDesc: 'Article guessing game',
    caseControl: 'Case Control',
    caseControlDesc: 'Preposition challenge',
    wordSalad: 'Word Salad',
    wordSaladDesc: 'Build sentences from words',
    translationQuest: 'Translation Quest',
    translationQuestDesc: 'German → TR/EN translation',
    fiveLetterBlitz: '5-Letter Blitz',
    fiveLetterBlitzDesc: 'Arrange 5 letters',
    
    // Badges
    badges: 'Badges',
    earnedBadges: 'Earned Badges',
    newBadge: 'New Badge!',
    badgeEarned: 'Badge Earned!',
    badgesEarned: 'Badges Earned',
    viewAllBadges: 'View All Badges',
    
    // Errors
    errorGeneric: 'An error occurred',
    errorNetwork: 'Network error',
    errorAuth: 'Authentication error',
    errorInvalidInput: 'Invalid input',
    
    // Auth
    emailPlaceholder: 'Your email',
    passwordPlaceholder: 'Your password',
    displayNamePlaceholder: 'Your name',
    loginWithGoogle: 'Login with Google',
    loginWithEmail: 'Login with Email',
    dontHaveAccount: 'Don\'t have an account?',
    alreadyHaveAccount: 'Already have an account?',
    
    // Demo
    demoMode: 'Demo Mode',
    demoMessage: 'Playing without registration. Your score won\'t be saved.',
    registerToSave: 'Register to save your score',
    
    // Actions
    reset: 'RESET',
    go: 'GO ➜',
    ok: 'OK',
    completed: 'Completed',
    correctAnswer: 'Correct Answer',
    copied: 'Copied!',
    
    // Time
    date: 'Date',
    ago: 'ago',
    justNow: 'Just now',
    
    // Game instructions
    clickWordsToBuild: 'Click words to build sentence',
    clickLettersToBuild: 'Click letters to build word',
    
    // How to Play
    howToPlayDesc1: 'You can play 1 free set from each game!',
    howToPlayDesc2: 'Register to save your score and earn badges!',
    scoringSystem: 'Scoring System:',
    scoringBase: 'Base score: Based on difficulty level (20-30 points)',
    scoringSpeed: 'Speed bonus: Earn extra points by answering quickly',
    scoringCombo: 'Combo bonus: Catch combos with consecutive correct answers!',
    difficultyLevels: 'Difficulty Levels:',
    play: 'PLAY >',
  }
};

let currentLang = localStorage.getItem('language') || 'tr';

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    updatePageTranslations();
  }
}

export function t(key) {
  return translations[currentLang][key] || key;
}

export function getCurrentLanguage() {
  return currentLang;
}

function updatePageTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// Auto-update on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updatePageTranslations);
} else {
  updatePageTranslations();
}
