/* ============================================
   DER DIE DAS SPACE - GAME REGISTRY
   Oyun kayıt sistemi (game key mapping)
   ============================================ */

/**
 * Game Registry
 * Tüm oyunların kaydı ve meta bilgileri
 */
export const GAME_REGISTRY = {
  'der_die_dash': {
    code: 'der_die_dash',
    name_tr: 'Der Die Dash',
    name_en: 'Der Die Dash',
    name_de: 'Der Die Dash',
    description_tr: 'Almanca kelimelerin artikelini tahmin et',
    description_en: 'Guess the article of German words',
    description_de: 'Rate den Artikel der deutschen Wörter',
    icon: '🚀',
    route: 'games/der-die-dash.html',
    jsModule: '/js/games/der-die-dash.js',
    maxTime: 5,
    baseScore: 20
  },
  'case_control': {
    code: 'case_control',
    name_tr: 'Case Control',
    name_en: 'Case Control',
    name_de: 'Case Control',
    description_tr: 'Preposition + doğru form seçimi',
    description_en: 'Preposition + correct form selection',
    description_de: 'Präposition + richtige Form auswählen',
    icon: '✏️',
    route: 'games/case-control.html',
    jsModule: '/js/games/case-control.js',
    maxTime: 5,
    baseScore: 25
  },
  'word_salad': {
    code: 'word_salad',
    name_tr: 'Word Salad',
    name_en: 'Word Salad',
    name_de: 'Word Salad',
    description_tr: 'Kelimelerden cümle kur (10 kelime)',
    description_en: 'Build sentences from words (10 words)',
    description_de: 'Bilde Sätze aus Wörtern (10 Wörter)',
    icon: '🥗',
    route: 'games/word-salad.html',
    jsModule: '/js/games/word-salad.js',
    maxTime: 20,
    baseScore: 30
  },
  'translation_quest': {
    code: 'translation_quest',
    name_tr: 'Translation Quest',
    name_en: 'Translation Quest',
    name_de: 'Translation Quest',
    description_tr: 'Almanca kelimeleri çevir (TR/EN şıklar)',
    description_en: 'Translate German words (TR/EN options)',
    description_de: 'Übersetze deutsche Wörter (TR/EN Optionen)',
    icon: '🌍',
    route: 'games/translation-quest.html',
    jsModule: '/js/games/translation-quest.js',
    maxTime: 8,
    baseScore: 22
  },
  'five_letter_blitz': {
    code: 'five_letter_blitz',
    name_tr: '5-Letter Blitz',
    name_en: '5-Letter Blitz',
    name_de: '5-Letter Blitz',
    description_tr: '5 harfli kelimeleri sırala',
    description_en: 'Arrange 5-letter words',
    description_de: 'Ordne 5-Buchstaben-Wörter',
    icon: '⚡',
    route: 'games/five-letter-blitz.html',
    jsModule: '/js/games/five-letter-blitz.js',
    maxTime: 10,
    baseScore: 25
  }
};

/**
 * Get game by code
 */
export function getGame(gameCode) {
  return GAME_REGISTRY[gameCode] || null;
}

/**
 * Get all games
 */
export function getAllGames() {
  return Object.values(GAME_REGISTRY);
}

/**
 * Get game route
 */
export function getGameRoute(gameCode) {
  const game = getGame(gameCode);
  return game ? game.route : null;
}

/**
 * Get game JS module
 */
export function getGameModule(gameCode) {
  const game = getGame(gameCode);
  return game ? game.jsModule : null;
}

/**
 * Check if game exists
 */
export function gameExists(gameCode) {
  return gameCode in GAME_REGISTRY;
}

/**
 * Get game name in current language
 */
export function getGameName(gameCode, lang = 'en') {
  const game = getGame(gameCode);
  if (!game) return gameCode;
  
  const key = `name_${lang}`;
  return game[key] || game.name_en || gameCode;
}

/**
 * Get game description in current language
 */
export function getGameDescription(gameCode, lang = 'en') {
  const game = getGame(gameCode);
  if (!game) return '';
  
  const key = `description_${lang}`;
  return game[key] || game.description_en || '';
}
