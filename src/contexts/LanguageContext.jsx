import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    // Welcome Screen
    welcomeTitle: 'Hoş Geldin!',
    enterName: 'Adını gir...',
    welcomeBack: 'Tekrar Hoş Geldin,',
    selectRace: 'Bir Yarışma Seç',
    racesCompleted: 'Yarışma Tamamlandı',
    totalScore: 'Toplam Puan',
    averageScore: 'Ortalama Puan',
    globalLeaderboard: 'Genel Sıralama',
    race: 'Yarışma',
    raceCompleted: 'Tamamlandı!',
    totalPoints: 'Toplam Puan',
    accuracy: 'Doğruluk',
    correctAnswers: 'Doğru Cevap',
    avgTime: 'Ortalama Süre',
    yourAnswers: 'Cevapların',
    selected: 'Seçtin:',
    correct: 'Doğru:',
    timeout: 'Zaman Aşımı',
    raceLeaderboard: 'Sıralaması',
    mainMenu: 'Ana Menü',
    playAgain: 'Tekrar Oyna',
    raceDetails: 'Yarışma Detayları',
    allPlayers: 'Tüm oyuncuların performansı',
    question: 'Soru',
    whichArticle: 'Welcher Artikel?',
    pleaseEnterName: 'Önce adını gir!',
    pleaseEnterNameAlert: 'Bitte gib einen Namen ein!',
    findRightOne: 'Find the Right One!',
    raceAgainstTime: 'Race Against Time!',
    beTheBest: 'Be the Best One!',
    score: 'Score',
    time: 'Zeit',
    allRacesCompleted: 'Tüm yarışmaları tamamladın! 🎉',
    raceLabel: 'Race',
    average: 'Ortalama',
    points: 'pts'
  },
  de: {
    welcomeTitle: 'Willkommen!',
    enterName: 'Gib deinen Namen ein...',
    welcomeBack: 'Willkommen zurück,',
    selectRace: 'Wähle ein Rennen',
    racesCompleted: 'Rennen Abgeschlossen',
    totalScore: 'Gesamtpunktzahl',
    averageScore: 'Durchschnittspunktzahl',
    globalLeaderboard: 'Globale Rangliste',
    race: 'Rennen',
    raceCompleted: 'Abgeschlossen!',
    totalPoints: 'Gesamtpunktzahl',
    accuracy: 'Genauigkeit',
    correctAnswers: 'Richtige Antworten',
    avgTime: 'Durchschnittszeit',
    yourAnswers: 'Deine Antworten',
    selected: 'Gewählt:',
    correct: 'Richtig:',
    timeout: 'Zeitüberschreitung',
    raceLeaderboard: 'Rangliste',
    mainMenu: 'Hauptmenü',
    playAgain: 'Erneut Spielen',
    raceDetails: 'Renn-Details',
    allPlayers: 'Leistung aller Spieler',
    question: 'Frage',
    whichArticle: 'Welcher Artikel?',
    pleaseEnterName: 'Bitte gib zuerst deinen Namen ein!',
    pleaseEnterNameAlert: 'Bitte gib einen Namen ein!',
    findRightOne: 'Finde das Richtige!',
    raceAgainstTime: 'Rennen gegen die Zeit!',
    beTheBest: 'Sei der Beste!',
    score: 'Punkte',
    time: 'Zeit',
    allRacesCompleted: 'Du hast alle Rennen abgeschlossen! 🎉',
    raceLabel: 'Rennen',
    average: 'Durchschnitt',
    points: 'Pkt'
  },
  en: {
    welcomeTitle: 'Welcome!',
    enterName: 'Enter your name...',
    welcomeBack: 'Welcome back,',
    selectRace: 'Select a Race',
    racesCompleted: 'Races Completed',
    totalScore: 'Total Score',
    averageScore: 'Average Score',
    globalLeaderboard: 'Global Leaderboard',
    race: 'Race',
    raceCompleted: 'Completed!',
    totalPoints: 'Total Points',
    accuracy: 'Accuracy',
    correctAnswers: 'Correct Answers',
    avgTime: 'Average Time',
    yourAnswers: 'Your Answers',
    selected: 'Selected:',
    correct: 'Correct:',
    timeout: 'Timeout',
    raceLeaderboard: 'Leaderboard',
    mainMenu: 'Main Menu',
    playAgain: 'Play Again',
    raceDetails: 'Race Details',
    allPlayers: 'All players\' performance',
    question: 'Question',
    whichArticle: 'Which Article?',
    pleaseEnterName: 'Please enter your name first!',
    pleaseEnterNameAlert: 'Please enter a name!',
    findRightOne: 'Find the Right One!',
    raceAgainstTime: 'Race Against Time!',
    beTheBest: 'Be the Best One!',
    score: 'Score',
    time: 'Time',
    allRacesCompleted: 'You completed all races! 🎉',
    raceLabel: 'Race',
    average: 'Average',
    points: 'pts'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to Turkish
    const saved = localStorage.getItem('der-die-das-language');
    return saved || 'tr';
  });

  useEffect(() => {
    localStorage.setItem('der-die-das-language', language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
