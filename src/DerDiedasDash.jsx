import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, Target, Clock, Star, Play, Home, BarChart3 } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

// 100 German words database
const WORDS_DATABASE = [
  // Race 1 (1-10)
  { word: "Tisch", artikel: "der" },
  { word: "Katze", artikel: "die" },
  { word: "Buch", artikel: "das" },
  { word: "Wasser", artikel: "das" },
  { word: "Sonne", artikel: "die" },
  { word: "Auto", artikel: "das" },
  { word: "Haus", artikel: "das" },
  { word: "Mann", artikel: "der" },
  { word: "Frau", artikel: "die" },
  { word: "Kind", artikel: "das" },
  
  // Race 2 (11-20)
  { word: "Hund", artikel: "der" },
  { word: "Schule", artikel: "die" },
  { word: "Fenster", artikel: "das" },
  { word: "Tür", artikel: "die" },
  { word: "Baum", artikel: "der" },
  { word: "Blume", artikel: "die" },
  { word: "Stuhl", artikel: "der" },
  { word: "Lampe", artikel: "die" },
  { word: "Bett", artikel: "das" },
  { word: "Garten", artikel: "der" },
  
  // Race 3 (21-30)
  { word: "Stadt", artikel: "die" },
  { word: "Land", artikel: "das" },
  { word: "Berg", artikel: "der" },
  { word: "See", artikel: "der" },
  { word: "Meer", artikel: "das" },
  { word: "Fluss", artikel: "der" },
  { word: "Straße", artikel: "die" },
  { word: "Park", artikel: "der" },
  { word: "Brücke", artikel: "die" },
  { word: "Gebäude", artikel: "das" },
  
  // Race 4 (31-40)
  { word: "Telefon", artikel: "das" },
  { word: "Computer", artikel: "der" },
  { word: "Uhr", artikel: "die" },
  { word: "Handy", artikel: "das" },
  { word: "Musik", artikel: "die" },
  { word: "Film", artikel: "der" },
  { word: "Bild", artikel: "das" },
  { word: "Zeitung", artikel: "die" },
  { word: "Brief", artikel: "der" },
  { word: "Radio", artikel: "das" },
  
  // Race 5 (41-50)
  { word: "Essen", artikel: "das" },
  { word: "Brot", artikel: "das" },
  { word: "Käse", artikel: "der" },
  { word: "Milch", artikel: "die" },
  { word: "Kaffee", artikel: "der" },
  { word: "Tee", artikel: "der" },
  { word: "Apfel", artikel: "der" },
  { word: "Orange", artikel: "die" },
  { word: "Fleisch", artikel: "das" },
  { word: "Salat", artikel: "der" },
  
  // Race 6 (51-60)
  { word: "Arbeit", artikel: "die" },
  { word: "Beruf", artikel: "der" },
  { word: "Büro", artikel: "das" },
  { word: "Chef", artikel: "der" },
  { word: "Firma", artikel: "die" },
  { word: "Kollege", artikel: "der" },
  { word: "Projekt", artikel: "das" },
  { word: "Aufgabe", artikel: "die" },
  { word: "Termin", artikel: "der" },
  { word: "Meeting", artikel: "das" },
  
  // Race 7 (61-70)
  { word: "Familie", artikel: "die" },
  { word: "Vater", artikel: "der" },
  { word: "Mutter", artikel: "die" },
  { word: "Bruder", artikel: "der" },
  { word: "Schwester", artikel: "die" },
  { word: "Großvater", artikel: "der" },
  { word: "Großmutter", artikel: "die" },
  { word: "Onkel", artikel: "der" },
  { word: "Tante", artikel: "die" },
  { word: "Cousin", artikel: "der" },
  
  // Race 8 (71-80)
  { word: "Körper", artikel: "der" },
  { word: "Hand", artikel: "die" },
  { word: "Fuß", artikel: "der" },
  { word: "Auge", artikel: "das" },
  { word: "Nase", artikel: "die" },
  { word: "Mund", artikel: "der" },
  { word: "Ohr", artikel: "das" },
  { word: "Kopf", artikel: "der" },
  { word: "Herz", artikel: "das" },
  { word: "Haar", artikel: "das" },
  
  // Race 9 (81-90)
  { word: "Zeit", artikel: "die" },
  { word: "Tag", artikel: "der" },
  { word: "Nacht", artikel: "die" },
  { word: "Jahr", artikel: "das" },
  { word: "Monat", artikel: "der" },
  { word: "Woche", artikel: "die" },
  { word: "Stunde", artikel: "die" },
  { word: "Minute", artikel: "die" },
  { word: "Sekunde", artikel: "die" },
  { word: "Moment", artikel: "der" },
  
  // Race 10 (91-100)
  { word: "Farbe", artikel: "die" },
  { word: "Rot", artikel: "das" },
  { word: "Blau", artikel: "das" },
  { word: "Grün", artikel: "das" },
  { word: "Gelb", artikel: "das" },
  { word: "Schwarz", artikel: "das" },
  { word: "Weiß", artikel: "das" },
  { word: "Himmel", artikel: "der" },
  { word: "Erde", artikel: "die" },
  { word: "Welt", artikel: "die" },
];

// Difficulty-based scoring configuration
const DIFFICULTY_SCORING = {
  1: { basePoints: 200, maxSpeedBonus: 200, maxPoints: 400, label: 'Very Easy', color: '#00CC00' },
  2: { basePoints: 350, maxSpeedBonus: 350, maxPoints: 700, label: 'Easy', color: '#0088FF' },
  3: { basePoints: 500, maxSpeedBonus: 500, maxPoints: 1000, label: 'Medium', color: '#FFD700' },
  4: { basePoints: 750, maxSpeedBonus: 750, maxPoints: 1500, label: 'Hard', color: '#FF6600' },
  5: { basePoints: 1000, maxSpeedBonus: 1000, maxPoints: 2000, label: 'Expert', color: '#FF0000' },
};

// Get difficulty level from race number
const getDifficultyLevel = (raceNumber) => {
  if (raceNumber <= 2) return 1;      // Race 1-2: Very Easy
  if (raceNumber <= 4) return 2;      // Race 3-4: Easy
  if (raceNumber <= 6) return 3;      // Race 5-6: Medium
  if (raceNumber <= 8) return 4;      // Race 7-8: Hard
  return 5;                           // Race 9-10: Expert
};

const DerDiedasDash = ({ authUser, onLogout }) => {
  const { t } = useLanguage();
  const [screen, setScreen] = useState('welcome'); // welcome, game, raceResults, globalStats
  const [username, setUsername] = useState(authUser?.email?.split('@')[0] || '');
  const [currentRace, setCurrentRace] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const timerRef = useRef(null);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const result = await window.storage?.get('der-die-das-dash-user');
      if (result) {
        const data = JSON.parse(result.value);
        setUserData(data);
        setUsername(data.username);
      }
    } catch (error) {
      console.log('New user, starting fresh');
    }
    setLoading(false);
  };

  const saveUserData = async (data) => {
    try {
      await window.storage?.set('der-die-das-dash-user', JSON.stringify(data));
      setUserData(data);
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const startGame = () => {
    if (!username.trim()) {
      alert(t('pleaseEnterNameAlert'));
      return;
    }

    if (!userData) {
      const newUserData = {
        username: username.trim(),
        races: {},
        totalRaces: 0,
        totalScore: 0,
      };
      saveUserData(newUserData);
    }

    setScreen('game');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(5);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleAnswer('timeout');
          return 5;
        }
        return prev - 0.1;
      });
    }, 100);
  };

  const handleAnswer = (selected) => {
    clearInterval(timerRef.current);
    
    const raceStart = (currentRace - 1) * 10;
    const currentWord = WORDS_DATABASE[raceStart + currentQuestion];
    const isCorrect = selected === currentWord.artikel;
    const timeTaken = 5 - timeLeft;
    
    // Calculate points: Speed bonus (0-500) + Accuracy (500)
    let points = 0;
    if (isCorrect) {
      const speedBonus = Math.max(0, Math.round((5 - timeTaken) * 100));
      points = speedBonus + 500;
    }
    
    setAnswers([...answers, {
      word: currentWord.word,
      correct: currentWord.artikel,
      selected,
      isCorrect,
      timeTaken,
      points
    }]);
    
    setScore(score + points);
    setFeedbackType(isCorrect ? 'correct' : 'wrong');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < 9) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(5);
        startTimer();
      } else {
        finishRace();
      }
    }, 800);
  };

  const finishRace = () => {
    clearInterval(timerRef.current);
    
    // Save race results
    const updatedUserData = {
      ...userData,
      races: {
        ...userData.races,
        [`race${currentRace}`]: {
          score,
          answers,
          date: new Date().toISOString(),
        }
      },
      totalRaces: (userData.totalRaces || 0) + 1,
      totalScore: (userData.totalScore || 0) + score,
    };
    
    saveUserData(updatedUserData);
    setScreen('raceResults');
  };

  const getRaceWords = () => {
    const start = (currentRace - 1) * 10;
    return WORDS_DATABASE.slice(start, start + 10);
  };

  const getCompletedRaces = () => {
    if (!userData || !userData.races) return 0;
    return Object.keys(userData.races).length;
  };

  const getRaceLeaderboard = (raceNum) => {
    // For now, just show current user's score
    // In a real app, this would fetch all users' scores from shared storage
    if (!userData || !userData.races || !userData.races[`race${raceNum}`]) {
      return [];
    }
    
    return [{
      username: userData.username,
      score: userData.races[`race${raceNum}`].score,
      date: userData.races[`race${raceNum}`].date,
    }];
  };

  const getGlobalLeaderboard = () => {
    if (!userData) return [];
    
    return [{
      username: userData.username,
      totalRaces: userData.totalRaces || 0,
      totalScore: userData.totalScore || 0,
      avgScore: userData.totalRaces ? Math.round(userData.totalScore / userData.totalRaces) : 0,
    }];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-cyan-400 text-2xl font-bold animate-pulse">LOADING...</div>
      </div>
    );
  }

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-12">
          {/* Title */}
          <div className="text-center mb-16 animate-fadeIn">
            {/* Logo */}
            <div className="mb-6 px-8">
              <img
                src="/logo.png"
                alt="Der Die Das Dash"
                className="w-full max-w-xs mx-auto animate-bounce"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255, 195, 0, 0.3))'
                }}
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xl font-bold" style={{color: '#FF0000'}}>{t('findRightOne')}</p>
              <p className="text-xl font-bold" style={{color: '#21A8FF'}}>{t('raceAgainstTime')}</p>
              <p className="text-xl font-bold" style={{color: '#FFC300'}}>{t('beTheBest')}</p>
            </div>
          </div>

          {/* Stats Overview */}
          {userData && (
            <div className="grid grid-cols-1 gap-4 mb-8 w-full max-w-sm mx-auto">
              <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border-2 border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="text-3xl font-black text-white mb-1">{getCompletedRaces()}</div>
                <div className="text-cyan-300 text-sm font-semibold">{t('racesCompleted')}</div>
              </div>
              <div className="bg-gradient-to-br from-fuchsia-900/40 to-fuchsia-800/20 border-2 border-fuchsia-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <Star className="w-8 h-8 text-fuchsia-400 mb-2" />
                <div className="text-3xl font-black text-white mb-1">{userData.totalScore || 0}</div>
                <div className="text-fuchsia-300 text-sm font-semibold">{t('totalScore')}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
                <Target className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="text-3xl font-black text-white mb-1">
                  {userData.totalRaces ? Math.round(userData.totalScore / userData.totalRaces) : 0}
                </div>
                <div className="text-yellow-300 text-sm font-semibold">{t('averageScore')}</div>
              </div>
            </div>
          )}

          {/* Username Input or Welcome */}
          <div className="w-full max-w-sm mx-auto mb-8">
            {!userData ? (
              <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-black text-cyan-400 mb-6 text-center">{t('welcomeTitle')}</h2>
                <input
                  type="text"
                  placeholder={t('enterName')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && startGame()}
                  className="w-full bg-slate-800 border-2 border-cyan-500/50 rounded-xl px-6 py-4 text-white text-xl font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  autoFocus
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-2">{t('welcomeBack')}</p>
                <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">{username}!</p>
              </div>
            )}
          </div>

          {/* Race Selection */}
          <div className="w-full max-w-sm mx-auto mb-8">
            <h3 className="text-3xl font-black text-center text-white mb-8 uppercase tracking-wide">{t('selectRace')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((raceNum) => {
                const completed = userData?.races?.[`race${raceNum}`];
                const difficultyLevel = getDifficultyLevel(raceNum);
                const difficulty = DIFFICULTY_SCORING[difficultyLevel];
                return (
                  <button
                    key={raceNum}
                    onClick={() => {
                      if (!userData) {
                        alert(t('pleaseEnterName'));
                        return;
                      }
                      setCurrentRace(raceNum);
                      startGame();
                    }}
                    className="relative group bg-gradient-to-br from-slate-800 to-slate-900 border-2 rounded-2xl p-4 transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      borderColor: difficulty.color + '40',
                      boxShadow: completed ? `0 0 20px ${difficulty.color}40` : undefined
                    }}
                  >
                    {completed && (
                      <div className="absolute top-2 right-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                    )}
                    {/* Difficulty Badge */}
                    <div 
                      className="w-full mb-3 rounded-full py-1 px-3 text-center"
                      style={{ backgroundColor: difficulty.color }}
                    >
                      <span className="text-xs font-bold text-white">{difficulty.label}</span>
                    </div>
                    {/* Race Number */}
                    <div className="text-5xl font-black text-white mb-2 text-center">{raceNum}</div>
                    {/* Race Label */}
                    <div className="text-xs font-semibold text-center mb-2" style={{color: '#21A8FF'}}>
                      {t('raceLabel').toUpperCase()} {raceNum}
                    </div>
                    {/* Max Points */}
                    <div className="text-xs font-bold text-center" style={{color: difficulty.color}}>
                      Max: {difficulty.maxPoints} pts
                    </div>
                    {completed && (
                      <div className="text-xs text-green-300 mt-2 font-bold text-center">
                        {completed.score} pts
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setScreen('globalStats')}
              className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-fuchsia-500/50"
            >
              <BarChart3 className="w-5 h-5" />
              {t('globalLeaderboard')}
            </button>
          </div>
        </div>

        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet" />
      </div>
    );
  }

  // Game Screen
  if (screen === 'game') {
    const raceWords = getRaceWords();
    const currentWord = raceWords[currentQuestion];
    const progress = ((currentQuestion) / 10) * 100;

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-fuchsia-500 to-yellow-500"></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  setScreen('welcome');
                }}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all"
              >
                <Home className="w-6 h-6" />
              </button>
              <div>
                <div className="text-sm text-cyan-400 font-semibold">Race {currentRace}</div>
                <div className="text-2xl font-black text-white">{username}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-fuchsia-400 font-semibold">{t('score')}</div>
              <div className="text-4xl font-black text-white">{score}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-cyan-300">{t('question')} {currentQuestion + 1}/10</span>
              <span className="text-sm font-semibold text-cyan-300">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-12">
            <div className="w-full max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold text-yellow-300">{t('time')}</span>
              </div>
              <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-100 ${
                    timeLeft > 3 ? 'bg-green-500' : timeLeft > 1 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${(timeLeft / 5) * 100}%` }}
                ></div>
              </div>
              <div className="text-center mt-2 text-2xl font-black text-white">
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Word Display - Mobile First */}
          <div className="w-full max-w-sm mx-auto mb-8 px-4">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-4 border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm text-center relative overflow-visible">
              {/* Animated background */}
              <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-500 animate-pulse"></div>
              </div>
              
              <div className="relative z-10 py-2">
                <div 
                  className="font-black text-white mb-3 animate-scaleIn whitespace-nowrap overflow-visible" 
                  style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontSize: 'clamp(3rem, 15vw, 5rem)',
                    lineHeight: '1.1',
                    wordBreak: 'keep-all',
                    overflowWrap: 'normal',
                    minHeight: '4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {currentWord.word}
                </div>
                <div className="text-xl md:text-2xl text-cyan-300 font-bold">{t('whichArticle')}</div>
              </div>
            </div>
          </div>

          {/* Answer Buttons - Mobile First */}
          <div className="w-full max-w-sm mx-auto grid grid-cols-3 gap-3 md:gap-4 px-4">
            {['der', 'die', 'das'].map((artikel) => (
              <button
                key={artikel}
                onClick={() => handleAnswer(artikel)}
                disabled={showFeedback}
                className={`relative group ${
                  artikel === 'der' ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-blue-400' :
                  artikel === 'die' ? 'bg-gradient-to-br from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 border-pink-400' :
                  'bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border-purple-400'
                } border-4 rounded-2xl p-4 md:p-6 transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:scale-100`}
              >
                <div className="text-3xl md:text-4xl font-black text-white">{artikel}</div>
              </button>
            ))}
          </div>

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className={`text-8xl md:text-9xl font-black animate-scaleIn ${feedbackType === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                {feedbackType === 'correct' ? '✓' : '✗'}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Race Results Screen
  if (screen === 'raceResults') {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / 10) * 100);
    const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / 10;

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent uppercase">
              {t('raceLabel')} {currentRace} {t('raceCompleted')}
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-sm mx-auto">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 border-green-500/30 rounded-2xl p-6 backdrop-blur-sm text-center">
              <Star className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-2">{score}</div>
              <div className="text-green-300 text-sm font-semibold">{t('totalPoints')}</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-2">{accuracy}%</div>
              <div className="text-blue-300 text-sm font-semibold">{t('accuracy')}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm text-center">
              <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-2">{correctAnswers}/10</div>
              <div className="text-purple-300 text-sm font-semibold">{t('correctAnswers')}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm text-center">
              <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-4xl font-black text-white mb-2">{avgTime.toFixed(1)}s</div>
              <div className="text-yellow-300 text-sm font-semibold">{t('avgTime')}</div>
            </div>
          </div>

          {/* Answers Review */}
          <div className="w-full max-w-sm mx-auto mb-8">
            <h2 className="text-3xl font-black text-white mb-6 text-center">{t('yourAnswers')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`${
                    answer.isCorrect 
                      ? 'bg-gradient-to-r from-green-900/40 to-green-800/20 border-green-500/30' 
                      : 'bg-gradient-to-r from-red-900/40 to-red-800/20 border-red-500/30'
                  } border-2 rounded-xl p-4 backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-black text-white">{answer.word}</div>
                    <div className={`text-3xl ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-400">{t('selected')} </span>
                      <span className={`font-bold ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {answer.selected === 'timeout' ? t('timeout') : answer.selected}
                      </span>
                      {!answer.isCorrect && (
                        <>
                          <span className="text-slate-400"> • {t('correct')} </span>
                          <span className="font-bold text-green-400">{answer.correct}</span>
                        </>
                      )}
                    </div>
                    <div className="text-slate-300">
                      {answer.timeTaken.toFixed(1)}s • <span className="text-yellow-400 font-bold">{answer.points}pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Race Leaderboard */}
          <div className="w-full max-w-sm mx-auto mb-8">
            <h2 className="text-3xl font-black text-white mb-6 text-center">{t('raceLabel')} {currentRace} {t('raceLeaderboard')}</h2>
            <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
              {getRaceLeaderboard(currentRace).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-700 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black text-yellow-400">#{idx + 1}</div>
                    <div>
                      <div className="text-xl font-bold text-white">{entry.username}</div>
                      <div className="text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-cyan-400">{entry.score}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              {t('mainMenu')}
            </button>
            <button
              onClick={() => {
                if (currentRace < 10) {
                  setCurrentRace(currentRace + 1);
                  startGame();
                } else {
                  alert(t('allRacesCompleted'));
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-green-500/50"
            >
              <Play className="w-5 h-5" />
              {currentRace < 10 ? `${t('raceLabel')} ${currentRace + 1}` : t('playAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Global Stats Screen
  if (screen === 'globalStats') {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-sm mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <BarChart3 className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent uppercase">
              Genel Sıralama
            </h1>
            <p className="text-xl text-slate-400">{t('allPlayers')}</p>
          </div>

          {/* Global Leaderboard */}
          <div className="w-full max-w-sm mx-auto mb-8">
            <div className="bg-slate-900/50 border-2 border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {getGlobalLeaderboard().map((entry, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl font-black text-yellow-400">#{idx + 1}</div>
                        <div>
                          <div className="text-2xl font-black text-white">{entry.username}</div>
                        </div>
                      </div>
                      <Trophy className="w-12 h-12 text-yellow-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-black text-cyan-400">{entry.totalRaces}</div>
                        <div className="text-sm text-slate-400 font-semibold">{t('race')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-fuchsia-400">{entry.totalScore}</div>
                        <div className="text-sm text-slate-400 font-semibold">{t('totalScore')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black text-green-400">{entry.avgScore}</div>
                        <div className="text-sm text-slate-400 font-semibold">Ortalama</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Individual Race Stats */}
          {userData && userData.races && Object.keys(userData.races).length > 0 && (
            <div className="w-full max-w-sm mx-auto mb-8">
              <h2 className="text-3xl font-black text-white mb-6 text-center">{t('raceDetails')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(userData.races).map(([raceKey, raceData]) => {
                  const raceNum = parseInt(raceKey.replace('race', ''));
                  return (
                    <div key={raceKey} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-green-500/30 rounded-xl p-4 text-center">
                      <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-black text-white mb-1">{t('raceLabel')} {raceNum}</div>
                      <div className="text-3xl font-black text-green-400 mb-1">{raceData.score}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(raceData.date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              <Home className="w-5 h-5" />
              {t('mainMenu')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DerDiedasDash;
