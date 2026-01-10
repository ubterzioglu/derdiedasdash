import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, Target, Clock, Star, Play, Home, BarChart3, ChevronDown } from 'lucide-react';
import { getOrCreateUser, saveRaceResult, getGlobalLeaderboard as fetchGlobalLeaderboard, getRaceLeaderboard as fetchRaceLeaderboard, getUserStats } from './lib/api';

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
  1: { basePoints: 200, maxSpeedBonus: 200, maxPoints: 400, label: 'Very Easy', emoji: '🟢', color: '#00CC00' },
  2: { basePoints: 350, maxSpeedBonus: 350, maxPoints: 700, label: 'Easy', emoji: '🔵', color: '#0088FF' },
  3: { basePoints: 500, maxSpeedBonus: 500, maxPoints: 1000, label: 'Medium', emoji: '🟡', color: '#FFD700' },
  4: { basePoints: 750, maxSpeedBonus: 750, maxPoints: 1500, label: 'Hard', emoji: '🟠', color: '#FF6600' },
  5: { basePoints: 1000, maxSpeedBonus: 1000, maxPoints: 2000, label: 'Expert', emoji: '🔴', color: '#FF0000' },
};

// Get difficulty level from race number
const getDifficultyLevel = (raceNumber) => {
  if (raceNumber <= 2) return 1;      // Race 1-2: Very Easy
  if (raceNumber <= 4) return 2;      // Race 3-4: Easy
  if (raceNumber <= 6) return 3;      // Race 5-6: Medium
  if (raceNumber <= 8) return 4;      // Race 7-8: Hard
  return 5;                           // Race 9-10: Expert
};

const DerDiedasDash = () => {
  const [screen, setScreen] = useState('welcome'); // welcome, demo, game, raceResults, globalStats, demoResults
  const [username, setUsername] = useState('');
  const [currentRace, setCurrentRace] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [questionTransition, setQuestionTransition] = useState('enter');
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [raceLeaderboard, setRaceLeaderboard] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const timerRef = useRef(null);

  // Load user data on mount (from localStorage username if exists, for backward compatibility)
  useEffect(() => {
    loadUserData();
  }, []);

  // Check if user has visited before (show demo first time)
  useEffect(() => {
    if (!loading) {
      const hasVisitedBefore = localStorage.getItem('derdiedasdash-visited');
      if (!hasVisitedBefore && !userData && screen === 'welcome') {
        // First time visitor, show demo
        setScreen('demo');
        localStorage.setItem('derdiedasdash-visited', 'true');
      }
    }
  }, [loading, userData, screen]);

  // Load race leaderboard when screen changes to raceResults
  useEffect(() => {
    if (screen === 'raceResults' && currentRace) {
      const loadRaceLeaderboard = async () => {
        const leaderboard = await getRaceLeaderboard(currentRace);
        setRaceLeaderboard(leaderboard);
      };
      loadRaceLeaderboard();
    }
  }, [screen, currentRace]);

  // Load global leaderboard when screen changes to globalStats
  useEffect(() => {
    if (screen === 'globalStats') {
      const loadGlobalLeaderboard = async () => {
        const leaderboard = await getGlobalLeaderboard();
        setGlobalLeaderboard(leaderboard);
      };
      loadGlobalLeaderboard();
    }
  }, [screen]);

  const loadUserData = async () => {
    try {
      // Check localStorage for username (backward compatibility)
      const stored = localStorage.getItem('der-die-das-dash-user');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.username && data.userId) {
          // Try to load user from Supabase
          try {
            const userStats = await getUserStats(data.userId);
            if (userStats) {
              setUserData(userStats);
              setUsername(userStats.username);
              // Update localStorage with userId
              localStorage.setItem('der-die-das-dash-user', JSON.stringify({ username: userStats.username, userId: userStats.userId }));
            } else {
              // User exists in localStorage but not in DB, keep it for now
              setUserData(data);
              setUsername(data.username);
            }
          } catch (error) {
            // If getUserStats fails (e.g., user not found, network error), keep localStorage data
            console.error('Error loading user from Supabase:', error);
            setUserData(data);
            setUsername(data.username);
          }
        } else if (data.username) {
          // User exists in localStorage but no userId, will be created on next game start
          setUserData(data);
          setUsername(data.username);
        }
      }
    } catch (error) {
      console.log('Error loading user data, starting fresh:', error);
    } finally {
      setLoading(false);
      // If no user data and screen is welcome, show demo instead
      if (!userData && screen === 'welcome') {
        // Don't change screen here, let the render logic handle it
      }
    }
  };

  const updateUserData = (data) => {
    setUserData(data);
    // Keep username and userId in localStorage for quick access
    if (data.username) {
      localStorage.setItem('der-die-das-dash-user', JSON.stringify({ 
        username: data.username, 
        userId: data.userId || data.id 
      }));
    }
  };

  const startDemoGame = () => {
    setIsDemoMode(true);
    setScreen('game');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(5);
    setCombo(0);
    setQuestionTransition('enter');
    setCurrentRace(1); // Demo always starts with race 1
    startTimer();
  };

  const startGame = async () => {
    if (!username.trim()) {
      alert('Please enter your name first!');
      return;
    }

    setIsDemoMode(false);

    // Get or create user in Supabase
    if (!userData || !userData.userId) {
      try {
        setLoading(true);
        const user = await getOrCreateUser(username.trim());
        const userStats = await getUserStats(user.id);
        updateUserData(userStats);
      } catch (error) {
        console.error('Error creating/fetching user:', error);
        alert('Failed to initialize user. Please try again.');
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setScreen('game');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(5);
    setCombo(0);
    setQuestionTransition('enter');
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
    
    // Get difficulty level and scoring config
    const difficultyLevel = getDifficultyLevel(currentRace);
    const scoring = DIFFICULTY_SCORING[difficultyLevel];
    
    // Calculate points with difficulty-based system
    let points = 0;
    let comboBonus = 0;
    if (isCorrect) {
      // Speed bonus: Based on difficulty
      // Faster answers get more points (timeLeft closer to 5 = faster = more bonus)
      // Formula: maxSpeedBonus * (timeLeft / 5)
      const speedBonus = Math.max(0, Math.round((timeLeft / 5) * scoring.maxSpeedBonus));
      
      const newCombo = combo + 1;
      
      // Combo bonus: 50 points per combo level, scaled by difficulty multiplier
      // Higher difficulty = higher combo multiplier
      const comboMultiplier = difficultyLevel * 0.5; // 0.5x, 1x, 1.5x, 2x, 2.5x
      comboBonus = newCombo >= 2 ? Math.round((newCombo - 1) * 50 * comboMultiplier) : 0;
      
      points = scoring.basePoints + speedBonus + comboBonus;
      
      setCombo(newCombo);
      if (newCombo >= 2) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 1500);
      }
    } else {
      setCombo(0); // Reset combo on wrong answer
    }
    
    setAnswers([...answers, {
      word: currentWord.word,
      correct: currentWord.artikel,
      selected,
      isCorrect,
      timeTaken,
      points,
      combo: isCorrect ? combo + 1 : 0,
      difficulty: difficultyLevel
    }]);
    
    setScore(score + points);
    setFeedbackType(isCorrect ? 'correct' : 'wrong');
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < 9) {
        // Smooth transition
        setQuestionTransition('exit');
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setTimeLeft(5);
          setQuestionTransition('enter');
          startTimer();
        }, 300);
      } else {
        finishRace();
      }
    }, 800);
  };

  const finishRace = async () => {
    clearInterval(timerRef.current);
    
    // Trigger confetti celebration
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    
    // If demo mode, go to demo results screen
    if (isDemoMode) {
      setScreen('demoResults');
      return;
    }
    
    // Save race results to Supabase
    if (userData && userData.userId) {
      try {
        await saveRaceResult(userData.userId, currentRace, score, answers);
        // Refresh user stats
        const updatedStats = await getUserStats(userData.userId);
        updateUserData(updatedStats);
      } catch (error) {
        console.error('Error saving race result:', error);
        alert('Failed to save race result. Please check your connection.');
      }
    }
    
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

  const getRaceLeaderboard = async (raceNum) => {
    try {
      const leaderboard = await fetchRaceLeaderboard(raceNum);
      return leaderboard;
    } catch (error) {
      console.error('Error fetching race leaderboard:', error);
      // Fallback to showing current user's score if available
      if (userData && userData.races && userData.races[`race${raceNum}`]) {
        return [{
          username: userData.username,
          score: userData.races[`race${raceNum}`].score,
          date: userData.races[`race${raceNum}`].date,
        }];
      }
      return [];
    }
  };

  const getGlobalLeaderboard = async () => {
    try {
      const leaderboard = await fetchGlobalLeaderboard();
      return leaderboard;
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      // Fallback to showing current user's stats if available
      if (userData) {
        return [{
          username: userData.username,
          totalRaces: userData.totalRaces || 0,
          totalScore: userData.totalScore || 0,
          avgScore: userData.totalRaces ? Math.round(userData.totalScore / userData.totalRaces) : 0,
        }];
      }
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-cyan-400 text-2xl font-bold animate-pulse">LOADING...</div>
      </div>
    );
  }

  // Demo Screen (shown first time users visit or when explicitly requested)
  if (screen === 'demo') {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{background: '#00CC00'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', background: '#FFC300'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s', background: '#21A8FF'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          {/* Logo */}
          <div className="text-center mb-12 animate-fadeIn">
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
            
            <div className="flex flex-col items-center gap-1 mb-8">
              <p className="text-2xl font-black">
                <span style={{color: '#21A8FF'}}>der</span>{' '}
                <span style={{color: '#FF0000'}}>die</span>{' '}
                <span style={{color: '#FFC300'}}>das</span>!
              </p>
              <p className="text-xl font-bold" style={{color: '#00CC00'}}>Find the Right One!</p>
              <p className="text-lg font-semibold" style={{color: '#00CC00'}}>Race Against Time!</p>
            </div>
          </div>

          {/* Demo Info Card */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 rounded-2xl p-8 mb-8 backdrop-blur-sm" style={{borderColor: '#00CC00' + '50'}}>
            <div className="text-center mb-6">
              <Star className="w-12 h-12 mx-auto mb-4" style={{color: '#FFC300'}} />
              <h2 className="text-3xl font-black mb-3" style={{color: '#00CC00'}}>Try It Free!</h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Experience the thrill of learning German articles in a fast-paced race against time. No sign-up required!
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#00CC00'}} />
                <p className="text-slate-300">Play a complete race with 10 questions</p>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#00CC00'}} />
                <p className="text-slate-300">Test your knowledge and improve your speed</p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#00CC00'}} />
                <p className="text-slate-300">See your results and track your progress</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-900/30 to-green-900/30 border rounded-xl p-4 mb-6" style={{borderColor: '#FFC300' + '30'}}>
              <p className="text-center text-sm text-slate-300">
                <span className="font-bold text-white">Note:</span> Demo progress won't be saved. Sign up to save your scores and compete on leaderboards!
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startDemoGame}
                className="flex items-center justify-center gap-3 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-lg"
                style={{backgroundImage: 'linear-gradient(to right, #00CC00, #00AA00)'}}
              >
                <Play className="w-6 h-6" />
                Start Demo Game
              </button>
              <button
                onClick={() => {
                  setIsDemoMode(false);
                  setScreen('welcome');
                }}
                className="flex items-center justify-center gap-3 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105 bg-slate-800/50 border-2 border-slate-600"
              >
                Sign Up to Save Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse" style={{background: '#FF0000'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', background: '#FFC300'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s', background: '#21A8FF'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          {/* Title */}
          <div className="text-center mb-16 animate-fadeIn">
            {/* Logo */}
            <div className="mb-6 px-8">
              <img 
                src="/logo.png" 
                alt="Der Die Das Space" 
                className="w-full max-w-xs mx-auto animate-bounce"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(255, 195, 0, 0.3))'
                }}
              />
            </div>
            
            {/* Logo Altı Yazılar */}
            <div className="flex flex-col items-center gap-1 mb-8">
              <p className="text-2xl font-black">
                <span style={{color: '#21A8FF'}}>der</span>{' '}
                <span style={{color: '#FF0000'}}>die</span>{' '}
                <span style={{color: '#FFC300'}}>das</span>!
              </p>
              <p className="text-xl font-bold" style={{color: '#00CC00'}}>Find the Right One!</p>
              <p className="text-lg font-semibold" style={{color: '#00CC00'}}>Race Against Time!</p>
            </div>
          </div>

          {/* Stats Overview */}
          {userData && (
            <div className="grid grid-cols-1 gap-6 mb-12">
              <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border-2 border-red-500/30 rounded-2xl p-6 backdrop-blur-sm" style={{borderColor: '#FF0000' + '30'}}>
                <Trophy className="w-8 h-8 mb-2" style={{color: '#FFC300'}} />
                <div className="text-3xl font-black text-white mb-1">{getCompletedRaces()}</div>
                <div className="text-sm font-semibold" style={{color: '#FF0000'}}>Races Completed</div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm" style={{borderColor: '#21A8FF' + '30'}}>
                <Star className="w-8 h-8 mb-2" style={{color: '#21A8FF'}} />
                <div className="text-3xl font-black text-white mb-1">{userData.totalScore || 0}</div>
                <div className="text-sm font-semibold" style={{color: '#21A8FF'}}>Total Points</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm" style={{borderColor: '#FFC300' + '30'}}>
                <Target className="w-8 h-8 mb-2" style={{color: '#FFC300'}} />
                <div className="text-3xl font-black text-white mb-1">
                  {userData.totalRaces ? Math.round(userData.totalScore / userData.totalRaces) : 0}
                </div>
                <div className="text-sm font-semibold" style={{color: '#FFC300'}}>Average Score</div>
              </div>
            </div>
          )}

          {/* Username Input or Welcome */}
          <div className="mb-12">
            {!userData ? (
              <div className="bg-slate-900/50 border-2 rounded-2xl p-8 backdrop-blur-sm" style={{borderColor: '#21A8FF' + '30'}}>
                <h2 className="text-2xl font-black mb-6 text-center" style={{color: '#21A8FF'}}>Welcome!</h2>
                <input
                  type="text"
                  placeholder="Enter your name..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && startGame()}
                  className="w-full bg-slate-800 border-2 rounded-xl px-6 py-4 text-white text-xl font-bold placeholder-slate-500 focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#21A8FF' + '50', '--tw-ring-color': '#21A8FF' + '20'}}
                  autoFocus
                />
              </div>
            ) : (
              <div className="text-center">
                <p className="text-3xl font-black text-white mb-2">Welcome Back,</p>
                <p className="text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent" style={{backgroundImage: 'linear-gradient(to right, #FF0000, #FFC300)'}}>
                  {username}!
                </p>
              </div>
            )}
          </div>

          {/* What is DDD Dash? Info Card */}
          <div className="mb-12">
            <button
              onClick={() => setInfoExpanded(!infoExpanded)}
              className="w-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-400/50 transition-all group"
              style={{borderColor: '#FFC300' + '30'}}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" style={{color: '#FFC300'}} />
                  <h3 className="text-2xl font-black" style={{color: '#FFC300'}}>What is Der Die Das Space?</h3>
                </div>
                <ChevronDown 
                  className={`w-6 h-6 transition-transform duration-300 ${infoExpanded ? 'rotate-180' : ''}`}
                  style={{color: '#FFC300'}}
                />
              </div>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                infoExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="bg-slate-900/50 border-2 rounded-2xl p-6 backdrop-blur-sm pb-8" style={{borderColor: '#FFC300' + '20'}}>
                <div className="space-y-4 text-slate-300">
                  <p className="text-lg leading-relaxed">
                    <span className="font-black" style={{color: '#FFC300'}}>Der Die Das Space</span> is a high-speed German article learning game! Test your knowledge of German articles (<span className="font-bold" style={{color: '#21A8FF'}}>der</span>, <span className="font-bold" style={{color: '#FF0000'}}>die</span>, <span className="font-bold" style={{color: '#FFC300'}}>das</span>) against the clock.
                  </p>
                  
                  <div className="border-l-4 pl-4" style={{borderColor: '#21A8FF' + '30'}}>
                    <h4 className="font-black mb-2" style={{color: '#21A8FF'}}>How to Play:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Each race contains <span className="text-white font-bold">10 German words</span></li>
                      <li>• You have <span className="text-white font-bold">5 seconds</span> to choose the correct article</li>
                      <li>• Faster answers = <span className="font-bold" style={{color: '#FFC300'}}>bonus points!</span></li>
                      <li>• Complete all <span className="text-white font-bold">10 races</span> to master 100 words</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 pl-4" style={{borderColor: '#A200FF' + '30'}}>
                    <h4 className="font-black mb-2" style={{color: '#A200FF'}}>Difficulty-Based Scoring:</h4>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <div>• <span className="font-bold" style={{color: '#00CC00'}}>🟢 Very Easy (Race 1-2):</span></div>
                        <div className="ml-4 text-slate-300">Base 200 + Speed 0-200 = Max 400 pts</div>
                      </li>
                      <li>
                        <div>• <span className="font-bold" style={{color: '#0088FF'}}>🔵 Easy (Race 3-4):</span></div>
                        <div className="ml-4 text-slate-300">Base 350 + Speed 0-350 = Max 700 pts</div>
                      </li>
                      <li>
                        <div>• <span className="font-bold" style={{color: '#FFD700'}}>🟡 Medium (Race 5-6):</span></div>
                        <div className="ml-4 text-slate-300">Base 500 + Speed 0-500 = Max 1,000 pts</div>
                      </li>
                      <li>
                        <div>• <span className="font-bold" style={{color: '#FF6600'}}>🟠 Hard (Race 7-8):</span></div>
                        <div className="ml-4 text-slate-300">Base 750 + Speed 0-750 = Max 1,500 pts</div>
                      </li>
                      <li>
                        <div>• <span className="font-bold" style={{color: '#FF0000'}}>🔴 Expert (Race 9-10):</span></div>
                        <div className="ml-4 text-slate-300">Base 1,000 + Speed 0-1,000 = Max 2,000 pts</div>
                      </li>
                      <li className="mt-2">• <span className="font-bold" style={{color: '#FFC300'}}>Combo Bonus:</span> Increases with difficulty level</li>
                      <li>• <span className="font-bold" style={{color: '#FF0000'}}>Wrong/timeout:</span> 0 points</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-900/20 to-yellow-900/20 border rounded-xl p-4 mt-4" style={{borderColor: '#FFC300' + '30'}}>
                    <p className="text-center text-sm">
                      <span className="font-black text-white">Pro Tip:</span> Study the patterns! Masculine, feminine, and neuter nouns often follow predictable rules. The more you play, the better you'll get! 🚀
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Race Selection */}
          <div className="mb-12">
            <h3 className="text-3xl font-black text-center text-white mb-8 uppercase tracking-wide">Choose a Race</h3>
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
                        alert('Please enter your name first!');
                        return;
                      }
                      setCurrentRace(raceNum);
                      startGame();
                    }}
                    className={`relative group ${
                      completed 
                        ? 'bg-gradient-to-br border-2' 
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600'
                    } rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-2xl`}
                    style={completed ? {
                      backgroundImage: 'linear-gradient(to bottom right, #30B946, #30B946)',
                      borderColor: '#30B946'
                    } : {
                      borderColor: difficulty.color + '50'
                    }}
                  >
                    {completed && (
                      <div className="absolute top-2 right-2">
                        <Trophy className="w-5 h-5" style={{color: '#FFC300'}} />
                      </div>
                    )}
                    {/* Difficulty Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black" style={{background: difficulty.color + '40', color: difficulty.color}}>
                      <span>{difficulty.emoji}</span>
                      <span>{difficulty.label}</span>
                    </div>
                    <div className="text-4xl font-black text-white mb-2">{raceNum}</div>
                    <div className="text-xs font-semibold uppercase" style={{color: completed ? '#FFC300' : '#21A8FF'}}>Race {raceNum}</div>
                    {!completed && (
                      <div className="text-xs mt-2 font-bold" style={{color: difficulty.color}}>
                        Max: {difficulty.maxPoints} pts
                      </div>
                    )}
                    {completed && (
                      <div className="text-xs mt-2 font-bold" style={{color: '#FFC300'}}>
                        {completed.score} pts
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={startDemoGame}
              className="flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{backgroundImage: 'linear-gradient(to right, #00CC00, #00AA00)'}}
            >
              <Play className="w-5 h-5" />
              Play Demo
            </button>
            <button
              onClick={() => setScreen('globalStats')}
              className="flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{backgroundImage: 'linear-gradient(to right, #A200FF, #21A8FF)'}}
            >
              <BarChart3 className="w-5 h-5" />
              Global Leaderboard
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
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Background effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'linear-gradient(to bottom right, #FF0000, #FFC300, #21A8FF)'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  if (isDemoMode) {
                    setScreen('demo');
                  } else {
                    setScreen('welcome');
                  }
                }}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl transition-all"
              >
                <Home className="w-6 h-6" />
              </button>
              <div>
                <div className="text-sm text-cyan-400 font-semibold">Race {currentRace}</div>
                <div className="text-2xl font-black text-white">
                  {isDemoMode ? 'Demo Player' : username}
                </div>
                {isDemoMode && (
                  <div className="text-xs font-bold" style={{color: '#00CC00'}}>DEMO MODE</div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-fuchsia-400 font-semibold">Score</div>
              <div className="text-4xl font-black text-white">{score}</div>
            </div>
          </div>

          {/* Progress Bar with Combo Counter */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold" style={{color: '#21A8FF'}}>Question {currentQuestion + 1}/10</span>
              <div className="flex items-center gap-3">
                {combo >= 2 && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${showCombo ? 'animate-bounce' : ''}`} style={{background: 'linear-gradient(to right, #FFC300, #FF6219)'}}>
                    <Zap className="w-4 h-4 text-white" />
                    <span className="text-sm font-black text-white">{combo}x COMBO!</span>
                  </div>
                )}
                <span className="text-sm font-semibold" style={{color: '#21A8FF'}}>{Math.round(progress)}%</span>
              </div>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full transition-all duration-300 ${combo >= 3 ? 'animate-pulse' : ''}`}
                style={{ 
                  width: `${progress}%`,
                  backgroundImage: combo >= 3 ? 'linear-gradient(to right, #FFC300, #FF6219, #A200FF)' : 'linear-gradient(to right, #FF0000, #FFC300)'
                }}
              ></div>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-12">
            <div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-6 h-6" style={{color: '#FFC300'}} />
                <span className="text-xl font-bold" style={{color: '#FFC300'}}>Time</span>
              </div>
              <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-100 ${
                    timeLeft > 3 ? '' : timeLeft > 1 ? '' : 'animate-pulse'
                  }`}
                  style={{ 
                    width: `${(timeLeft / 5) * 100}%`,
                    backgroundColor: timeLeft > 3 ? '#30B946' : timeLeft > 1 ? '#FFC300' : '#FF0000'
                  }}
                ></div>
              </div>
              <div className="text-center mt-2 text-2xl font-black text-white">
                {timeLeft.toFixed(1)}s
              </div>
            </div>
          </div>

          {/* Word Display */}
          <div className="mb-16">
            <div className={`bg-gradient-to-br border-4 rounded-3xl p-12 backdrop-blur-sm text-center relative overflow-hidden transition-all duration-300 ${
              questionTransition === 'enter' ? 'animate-slideIn' : questionTransition === 'exit' ? 'animate-slideOut' : ''
            }`} style={{
              backgroundImage: 'linear-gradient(to bottom right, rgba(0, 204, 0, 0.15), rgba(0, 180, 0, 0.25))',
              borderColor: '#00CC00' + '50',
              boxShadow: '0 0 30px rgba(0, 204, 0, 0.3)'
            }}>
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 animate-pulse" style={{backgroundImage: 'linear-gradient(to right, #FF0000, #FFC300, #21A8FF)'}}></div>
              </div>
              
              <div className="relative z-10">
                <div className="text-7xl md:text-9xl font-black text-white mb-4" style={{fontFamily: '"Orbitron", sans-serif'}}>
                  {currentWord.word}
                </div>
                <div className="text-2xl font-bold" style={{color: '#00CC00'}}>Which article?</div>
              </div>
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {['der', 'die', 'das'].map((artikel) => {
              // Logo renklerine uygun renkler
              const artikelColors = {
                der: { 
                  main: '#21A8FF',      // Mavi - logo rengi (vibrant blue)
                  dark: '#0066CC',      // Daha koyu mavi (gradient için)
                  glow: '#4DB8FF'       // Glow efekti için
                },
                die: { 
                  main: '#FF0000',      // Kırmızı - logo rengi (bright red)
                  dark: '#CC0000',      // Daha koyu kırmızı (gradient için)
                  glow: '#FF3333'       // Glow efekti için
                },
                das: { 
                  main: '#FFC300',      // Altın sarısı - logo rengi (golden yellow)
                  dark: '#CC9900',      // Daha koyu sarı (gradient için)
                  glow: '#FFD700'       // Glow efekti için
                }
              };
              
              const colors = artikelColors[artikel];
              
              return (
                <button
                  key={artikel}
                  onClick={() => handleAnswer(artikel)}
                  disabled={showFeedback}
                  className={`relative group border-4 rounded-2xl p-10 md:p-8 transition-all hover:scale-105 active:scale-95 hover:shadow-2xl disabled:opacity-50 disabled:scale-100 transform-gpu`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, ${colors.main}, ${colors.dark})`,
                    borderColor: colors.main,
                    minHeight: '100px',
                    boxShadow: `0 0 20px ${colors.main}40`
                  }}
                >
                  <div className="text-6xl md:text-5xl font-black text-white drop-shadow-lg">{artikel}</div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" 
                       style={{
                         background: colors.main,
                         filter: 'blur(25px)',
                         boxShadow: `0 0 40px ${colors.glow}80`
                       }}></div>
                </button>
              );
            })}
          </div>

          {/* Feedback Overlay */}
          {showFeedback && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className={`text-9xl font-black animate-scaleIn`} style={{color: feedbackType === 'correct' ? '#30B946' : '#FF0000'}}>
                {feedbackType === 'correct' ? '✓' : '✗'}
              </div>
            </div>
          )}

          {/* Confetti Overlay */}
          {showConfetti && (
            <div className="fixed inset-0 z-40 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    width: '10px',
                    height: '10px',
                    background: ['#FF0000', '#FFC300', '#21A8FF', '#A200FF', '#30B946'][Math.floor(Math.random() * 5)],
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
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
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateX(50px) scale(0.9);
            }
            to { 
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes slideOut {
            from { 
              opacity: 1;
              transform: translateX(0) scale(1);
            }
            to { 
              opacity: 0;
              transform: translateX(-50px) scale(0.9);
            }
          }
          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          .animate-slideIn {
            animation: slideIn 0.4s ease-out;
          }
          .animate-slideOut {
            animation: slideOut 0.3s ease-in;
          }
          .confetti {
            animation: confettiFall linear forwards;
          }
        `}</style>
      </div>
    );
  }

  // Demo Results Screen
  if (screen === 'demoResults') {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / 10) * 100);
    const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / 10;

    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{background: '#00CC00'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', background: '#FFC300'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <Star className="w-24 h-24 mx-auto mb-6 animate-bounce" style={{color: '#00CC00'}} />
            <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent uppercase" style={{backgroundImage: 'linear-gradient(to right, #00CC00, #FFC300)'}}>
              Demo Complete!
            </h1>
            <p className="text-xl text-slate-400">Great job! Ready to save your progress?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#00CC00' + '30'}}>
              <Star className="w-8 h-8 mx-auto mb-3" style={{color: '#00CC00'}} />
              <div className="text-4xl font-black text-white mb-2">{score}</div>
              <div className="text-sm font-semibold" style={{color: '#00CC00'}}>Total Score</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#21A8FF' + '30'}}>
              <Target className="w-8 h-8 mx-auto mb-3" style={{color: '#21A8FF'}} />
              <div className="text-4xl font-black text-white mb-2">{accuracy}%</div>
              <div className="text-sm font-semibold" style={{color: '#21A8FF'}}>Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#A200FF' + '30'}}>
              <Zap className="w-8 h-8 mx-auto mb-3" style={{color: '#A200FF'}} />
              <div className="text-4xl font-black text-white mb-2">{correctAnswers}/10</div>
              <div className="text-sm font-semibold" style={{color: '#A200FF'}}>Correct Answers</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#FFC300' + '30'}}>
              <Clock className="w-8 h-8 mx-auto mb-3" style={{color: '#FFC300'}} />
              <div className="text-4xl font-black text-white mb-2">{avgTime.toFixed(1)}s</div>
              <div className="text-sm font-semibold" style={{color: '#FFC300'}}>Avg Time</div>
            </div>
          </div>

          {/* Sign Up CTA */}
          <div className="bg-gradient-to-br from-green-900/40 to-yellow-900/40 border-2 rounded-2xl p-8 mb-12 backdrop-blur-sm text-center" style={{borderColor: '#00CC00' + '50'}}>
            <Trophy className="w-16 h-16 mx-auto mb-4" style={{color: '#FFC300'}} />
            <h2 className="text-3xl font-black mb-4" style={{color: '#00CC00'}}>Save Your Progress!</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Sign up now to save your scores, track your progress, and compete on global leaderboards. Join thousands of learners mastering German articles!
            </p>
            <div className="space-y-3 mb-6 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#FFC300'}} />
                <p className="text-slate-300">Save all your race results</p>
              </div>
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#FFC300'}} />
                <p className="text-slate-300">Compete on global leaderboards</p>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 mt-1 flex-shrink-0" style={{color: '#FFC300'}} />
                <p className="text-slate-300">Track your improvement over time</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsDemoMode(false);
                setScreen('welcome');
              }}
              className="flex items-center justify-center gap-3 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg text-lg mx-auto"
              style={{backgroundImage: 'linear-gradient(to right, #00CC00, #00AA00)'}}
            >
              <Trophy className="w-6 h-6" />
              Sign Up Now - It's Free!
            </button>
          </div>

          {/* Answers Review */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Your Answers</h2>
            <div className="grid grid-cols-1 gap-4">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-4 backdrop-blur-sm`}
                  style={{
                    backgroundImage: answer.isCorrect 
                      ? 'linear-gradient(to right, rgba(0, 204, 0, 0.4), rgba(0, 204, 0, 0.2))' 
                      : 'linear-gradient(to right, rgba(255, 0, 0, 0.4), rgba(255, 0, 0, 0.2))',
                    borderColor: answer.isCorrect ? '#00CC00' + '30' : '#FF0000' + '30'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-black text-white">{answer.word}</div>
                      {answer.combo >= 2 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black" style={{background: 'linear-gradient(to right, #FFC300, #FF6219)'}}>
                          <Zap className="w-3 h-3 text-white" />
                          <span className="text-white">{answer.combo}x</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-3xl`} style={{color: answer.isCorrect ? '#00CC00' : '#FF0000'}}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-400">You chose: </span>
                      <span className={`font-bold`} style={{color: answer.isCorrect ? '#00CC00' : '#FF0000'}}>
                        {answer.selected === 'timeout' ? 'Timeout' : answer.selected}
                      </span>
                      {!answer.isCorrect && (
                        <>
                          <span className="text-slate-400"> • Correct: </span>
                          <span className="font-bold" style={{color: '#00CC00'}}>{answer.correct}</span>
                        </>
                      )}
                    </div>
                    <div className="text-slate-300">
                      {answer.timeTaken.toFixed(1)}s • <span className="font-bold" style={{color: '#FFC300'}}>{answer.points}pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={startDemoGame}
              className="flex items-center justify-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{backgroundImage: 'linear-gradient(to right, #00CC00, #00AA00)'}}
            >
              <Play className="w-5 h-5" />
              Play Demo Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Race Results Screen
  if (screen === 'raceResults') {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / 10) * 100);
    const avgTime = answers.reduce((sum, a) => sum + a.timeTaken, 0) / 10;

    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{background: '#30B946'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', background: '#FFC300'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <Trophy className="w-24 h-24 mx-auto mb-6 animate-bounce" style={{color: '#FFC300'}} />
            <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent uppercase" style={{backgroundImage: 'linear-gradient(to right, #FFC300, #30B946)'}}>
              Race {currentRace} Complete!
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#30B946' + '30'}}>
              <Star className="w-8 h-8 mx-auto mb-3" style={{color: '#30B946'}} />
              <div className="text-4xl font-black text-white mb-2">{score}</div>
              <div className="text-sm font-semibold" style={{color: '#30B946'}}>Total Score</div>
            </div>
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#21A8FF' + '30'}}>
              <Target className="w-8 h-8 mx-auto mb-3" style={{color: '#21A8FF'}} />
              <div className="text-4xl font-black text-white mb-2">{accuracy}%</div>
              <div className="text-sm font-semibold" style={{color: '#21A8FF'}}>Accuracy</div>
            </div>
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#A200FF' + '30'}}>
              <Zap className="w-8 h-8 mx-auto mb-3" style={{color: '#A200FF'}} />
              <div className="text-4xl font-black text-white mb-2">{correctAnswers}/10</div>
              <div className="text-sm font-semibold" style={{color: '#A200FF'}}>Correct Answers</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 rounded-2xl p-6 backdrop-blur-sm text-center" style={{borderColor: '#FFC300' + '30'}}>
              <Clock className="w-8 h-8 mx-auto mb-3" style={{color: '#FFC300'}} />
              <div className="text-4xl font-black text-white mb-2">{avgTime.toFixed(1)}s</div>
              <div className="text-sm font-semibold" style={{color: '#FFC300'}}>Avg Time</div>
            </div>
          </div>

          {/* Answers Review */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Your Answers</h2>
            <div className="grid grid-cols-1 gap-4">
              {answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-xl p-4 backdrop-blur-sm`}
                  style={{
                    backgroundImage: answer.isCorrect 
                      ? 'linear-gradient(to right, rgba(48, 185, 70, 0.4), rgba(48, 185, 70, 0.2))' 
                      : 'linear-gradient(to right, rgba(255, 0, 0, 0.4), rgba(255, 0, 0, 0.2))',
                    borderColor: answer.isCorrect ? '#30B946' + '30' : '#FF0000' + '30'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-black text-white">{answer.word}</div>
                      {answer.combo >= 2 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black" style={{background: 'linear-gradient(to right, #FFC300, #FF6219)'}}>
                          <Zap className="w-3 h-3 text-white" />
                          <span className="text-white">{answer.combo}x</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-3xl`} style={{color: answer.isCorrect ? '#30B946' : '#FF0000'}}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-slate-400">You chose: </span>
                      <span className={`font-bold`} style={{color: answer.isCorrect ? '#30B946' : '#FF0000'}}>
                        {answer.selected === 'timeout' ? 'Timeout' : answer.selected}
                      </span>
                      {!answer.isCorrect && (
                        <>
                          <span className="text-slate-400"> • Correct: </span>
                          <span className="font-bold" style={{color: '#30B946'}}>{answer.correct}</span>
                        </>
                      )}
                    </div>
                    <div className="text-slate-300">
                      {answer.timeTaken.toFixed(1)}s • <span className="font-bold" style={{color: '#FFC300'}}>{answer.points}pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Race Leaderboard */}
          <div className="mb-12">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Race {currentRace} Leaderboard</h2>
            <div className="bg-slate-900/50 border-2 rounded-2xl p-6 backdrop-blur-sm" style={{borderColor: '#21A8FF' + '30'}}>
              {raceLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-slate-400">Loading leaderboard...</div>
              ) : (
                raceLeaderboard.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-700 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-black" style={{color: '#FFC300'}}>#{idx + 1}</div>
                    <div>
                      <div className="text-xl font-bold text-white">{entry.username}</div>
                      <div className="text-sm text-slate-400">
                        {new Date(entry.date).toLocaleDateString('en-US')}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-black" style={{color: '#21A8FF'}}>{entry.score}</div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Home
            </button>
            <button
              onClick={() => {
                if (currentRace < 10) {
                  setCurrentRace(currentRace + 1);
                  startGame();
                } else {
                  alert('You completed all races! 🎉');
                }
              }}
              className="flex items-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{backgroundImage: 'linear-gradient(to right, #30B946, #30B946)'}}
            >
              <Play className="w-5 h-5" />
              {currentRace < 10 ? `Race ${currentRace + 1}` : 'Play Again'}
            </button>
          </div>

          {/* Confetti Overlay */}
          {showConfetti && (
            <div className="fixed inset-0 z-40 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    width: '10px',
                    height: '10px',
                    background: ['#FF0000', '#FFC300', '#21A8FF', '#A200FF', '#30B946'][Math.floor(Math.random() * 5)],
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes confettiFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .confetti {
            animation: confettiFall linear forwards;
          }
        `}</style>
      </div>
    );
  }

  // Global Stats Screen
  if (screen === 'globalStats') {
    return (
      <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{background: '#FF0000'}}></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s', background: '#21A8FF'}}></div>
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <BarChart3 className="w-20 h-20 mx-auto mb-6" style={{color: '#21A8FF'}} />
            <h1 className="text-6xl font-black mb-4 bg-clip-text text-transparent uppercase" style={{backgroundImage: 'linear-gradient(to right, #FF0000, #21A8FF)'}}>
              Global Leaderboard
            </h1>
            <p className="text-xl text-slate-400">Performance across all players</p>
          </div>

          {/* Global Leaderboard */}
          <div className="mb-12">
            <div className="bg-slate-900/50 border-2 rounded-2xl p-6 backdrop-blur-sm" style={{borderColor: '#21A8FF' + '30'}}>
              <div className="space-y-4">
                {globalLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">Loading leaderboard...</div>
                ) : (
                  globalLeaderboard.map((entry, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl font-black" style={{color: '#FFC300'}}>#{idx + 1}</div>
                        <div>
                          <div className="text-2xl font-black text-white">{entry.username}</div>
                        </div>
                      </div>
                      <Trophy className="w-12 h-12" style={{color: '#FFC300'}} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-black" style={{color: '#FF0000'}}>{entry.totalRaces}</div>
                        <div className="text-sm text-slate-400 font-semibold">Races</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black" style={{color: '#21A8FF'}}>{entry.totalScore}</div>
                        <div className="text-sm text-slate-400 font-semibold">Total Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-black" style={{color: '#30B946'}}>{entry.avgScore}</div>
                        <div className="text-sm text-slate-400 font-semibold">Average</div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Individual Race Stats */}
          {userData && userData.races && Object.keys(userData.races).length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-black text-white mb-6 text-center">Race Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(userData.races).map(([raceKey, raceData]) => {
                  const raceNum = parseInt(raceKey.replace('race', ''));
                  return (
                    <div key={raceKey} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 rounded-xl p-4 text-center" style={{borderColor: '#30B946' + '30'}}>
                      <Trophy className="w-6 h-6 mx-auto mb-2" style={{color: '#FFC300'}} />
                      <div className="text-2xl font-black text-white mb-1">Race {raceNum}</div>
                      <div className="text-3xl font-black mb-1" style={{color: '#30B946'}}>{raceData.score}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(raceData.date).toLocaleDateString('en-US')}
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
              className="flex items-center gap-2 text-white font-black px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{backgroundImage: 'linear-gradient(to right, #FF0000, #21A8FF)'}}
            >
              <Home className="w-5 h-5" />
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DerDiedasDash;
