import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  LinearProgress,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Psychology, Lightbulb, EmojiEvents, LocalFireDepartment, Timer, Stars } from '@mui/icons-material';
import confetti from 'canvas-confetti';

// Add ClimbingCharacter component
const ClimbingCharacter = ({ progress }) => {
  const pathProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <Box sx={{ 
      position: 'absolute',
      right: 20,
      top: 0,
      bottom: 0,
      width: 80,
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {/* Mountain Path */}
      <Box sx={{
        position: 'absolute',
        left: '50%',
        top: '10%',
        bottom: '10%',
        width: 6,
        bgcolor: '#e0e0e0',
        borderRadius: 3,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 24,
          bgcolor: '#f44336',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 2
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 24,
          bgcolor: '#4caf50',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 2
        }
      }} />

      {/* Character */}
      <motion.div
        animate={{
          top: `${90 - (pathProgress * 0.8)}%`,
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          top: { type: "spring", stiffness: 100, damping: 20 },
          rotate: { duration: 0.5, ease: "easeInOut", repeat: Infinity },
          scale: { duration: 0.5, ease: "easeInOut", repeat: Infinity }
        }}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 48,
          height: 48,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3
        }}
      >
        <Box sx={{
          width: 40,
          height: 40,
          bgcolor: '#2196f3',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'Fredoka One',
          fontSize: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -10,
            width: 8,
            height: 8,
            bgcolor: '#2196f3',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }}>
          🧩
        </Box>
      </motion.div>

      {/* Progress Markers */}
      {[0, 25, 50, 75, 100].map((marker) => (
        <Box
          key={marker}
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            top: `${90 - (marker * 0.8)}%`,
            width: 12,
            height: 12,
            bgcolor: pathProgress >= marker ? '#2196f3' : '#e0e0e0',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 6,
              height: 2,
              bgcolor: pathProgress >= marker ? '#2196f3' : '#e0e0e0',
              transition: 'background-color 0.3s ease'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 6,
              height: 2,
              bgcolor: pathProgress >= marker ? '#2196f3' : '#e0e0e0',
              transition: 'background-color 0.3s ease'
            }
          }}
        />
      ))}
    </Box>
  );
};

// Add Streak Multiplier component
const StreakMultiplier = ({ streak, isVisible }) => {
  if (!isVisible || streak <= 1) return null;

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.5, opacity: 0 }}
      style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        background: '#ff9800',
        borderRadius: '50%',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}
    >
      <Typography sx={{ 
        fontFamily: 'Fredoka One',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        {streak}x
      </Typography>
    </motion.div>
  );
};

const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    maxScore: 100,
    timeLimit: 180, // 3 minutes
    problems: [
      {
        question: "Sarah has 5 apples. She gives 2 apples to her friend. How many apples does Sarah have now?",
        options: ["2 apples", "3 apples", "4 apples", "5 apples"],
        correctAnswer: "3 apples",
        explanation: "Sarah started with 5 apples and gave away 2 apples, so she has 5 - 2 = 3 apples left."
      },
      {
        question: "Tom has 3 toy cars. His sister has twice as many cars. How many cars does his sister have?",
        options: ["3 cars", "5 cars", "6 cars", "9 cars"],
        correctAnswer: "6 cars",
        explanation: "Tom's sister has twice as many cars, so she has 3 × 2 = 6 cars."
      },
      {
        question: "A bakery has 20 cookies. They sell them in bags of 4. How many bags can they make?",
        options: ["4 bags", "5 bags", "6 bags", "8 bags"],
        correctAnswer: "5 bags",
        explanation: "To find the number of bags, divide the total cookies by cookies per bag: 20 ÷ 4 = 5 bags."
      },
      {
        question: "John has 8 marbles and loses 3. How many marbles does he have now?",
        options: ["3 marbles", "4 marbles", "5 marbles", "6 marbles"],
        correctAnswer: "5 marbles",
        explanation: "John started with 8 marbles and lost 3, so he has 8 - 3 = 5 marbles left."
      },
      {
        question: "There are 7 birds in a tree. 4 more birds join them. How many birds are there now?",
        options: ["9 birds", "10 birds", "11 birds", "12 birds"],
        correctAnswer: "11 birds",
        explanation: "Starting with 7 birds, 4 more join, so 7 + 4 = 11 birds total."
      },
      {
        question: "A class has 15 students. They form groups of 3. How many groups can they make?",
        options: ["3 groups", "4 groups", "5 groups", "6 groups"],
        correctAnswer: "5 groups",
        explanation: "To find the number of groups, divide total students by students per group: 15 ÷ 3 = 5 groups."
      },
      {
        question: "Emma has 10 stickers. She shares them equally with her friend. How many stickers does each person get?",
        options: ["3 stickers", "4 stickers", "5 stickers", "6 stickers"],
        correctAnswer: "5 stickers",
        explanation: "When sharing 10 stickers equally between 2 people, each gets 10 ÷ 2 = 5 stickers."
      },
      {
        question: "There are 6 rows of chairs with 2 chairs in each row. How many chairs are there in total?",
        options: ["10 chairs", "11 chairs", "12 chairs", "13 chairs"],
        correctAnswer: "12 chairs",
        explanation: "Multiply rows by chairs per row: 6 × 2 = 12 chairs total."
      }
    ]
  },
  MEDIUM: {
    name: 'Medium',
    maxScore: 200,
    timeLimit: 240, // 4 minutes
    problems: [
      {
        question: "A restaurant serves 45 customers on Monday and 60 customers on Tuesday. What is the average number of customers per day?",
        options: ["50 customers", "52.5 customers", "55 customers", "57.5 customers"],
        correctAnswer: "52.5 customers",
        explanation: "To find the average, add both days and divide by 2: (45 + 60) ÷ 2 = 52.5 customers."
      },
      {
        question: "A train travels 240 kilometers in 3 hours. What is its average speed in kilometers per hour?",
        options: ["60 km/h", "70 km/h", "80 km/h", "90 km/h"],
        correctAnswer: "80 km/h",
        explanation: "Average speed = Total distance ÷ Total time: 240 km ÷ 3 hours = 80 km/h."
      },
      {
        question: "If 3 pencils cost $1.50, how much would 7 pencils cost?",
        options: ["$2.50", "$3.00", "$3.50", "$4.00"],
        correctAnswer: "$3.50",
        explanation: "First find cost per pencil: $1.50 ÷ 3 = $0.50, then multiply by 7: $0.50 × 7 = $3.50"
      },
      {
        question: "A store sells shirts for $25 each. If they offer a 20% discount, what is the sale price?",
        options: ["$15", "$18", "$20", "$22"],
        correctAnswer: "$20",
        explanation: "20% of $25 is $5 discount, so sale price is $25 - $5 = $20"
      },
      {
        question: "A recipe needs 2¾ cups of flour. If you want to make 1½ times the recipe, how many cups of flour do you need?",
        options: ["3.5 cups", "4 cups", "4.125 cups", "4.25 cups"],
        correctAnswer: "4.125 cups",
        explanation: "Multiply 2.75 by 1.5: 2.75 × 1.5 = 4.125 cups"
      },
      {
        question: "A rectangular garden is 8 meters long and 6 meters wide. What is its perimeter?",
        options: ["24 meters", "28 meters", "30 meters", "32 meters"],
        correctAnswer: "28 meters",
        explanation: "Perimeter = 2 × (length + width) = 2 × (8 + 6) = 2 × 14 = 28 meters"
      },
      {
        question: "If it takes 4 workers 6 hours to complete a task, how many hours would it take 3 workers?",
        options: ["7 hours", "8 hours", "9 hours", "10 hours"],
        correctAnswer: "8 hours",
        explanation: "Using proportion: (4 workers × 6 hours) = (3 workers × x hours), so x = (4 × 6) ÷ 3 = 8 hours"
      },
      {
        question: "A car uses 6 liters of fuel per 100 kilometers. How many liters would it use for a 250 kilometer journey?",
        options: ["12 liters", "13 liters", "14 liters", "15 liters"],
        correctAnswer: "15 liters",
        explanation: "Set up proportion: 6L/100km = xL/250km, solve for x: x = (6 × 250) ÷ 100 = 15 liters"
      }
    ]
  },
  HARD: {
    name: 'Hard',
    maxScore: 300,
    timeLimit: 300, // 5 minutes
    problems: [
      {
        question: "A store offers a 20% discount on a $80 jacket. If sales tax is 8%, what is the final price?",
        options: ["$68.80", "$72.00", "$76.80", "$82.94"],
        correctAnswer: "$76.80",
        explanation: "Discount: $80 × 0.20 = $16, Price after discount: $64, Tax: $64 × 0.08 = $12.80, Final price: $76.80"
      },
      {
        question: "If it takes 6 workers 4 days to build a wall, how many days would it take 8 workers to build the same wall?",
        options: ["2 days", "3 days", "4 days", "5 days"],
        correctAnswer: "3 days",
        explanation: "Using proportions: (6 workers × 4 days) = (8 workers × x days), so x = (6 × 4) ÷ 8 = 3 days"
      },
      {
        question: "A rectangular pool is 15 meters long and 10 meters wide. If the water level rises by 0.5 meters, how many cubic meters of water were added?",
        options: ["65 m³", "70 m³", "75 m³", "80 m³"],
        correctAnswer: "75 m³",
        explanation: "Volume = length × width × height: 15m × 10m × 0.5m = 75 cubic meters"
      },
      {
        question: "In a class of 30 students, 40% are boys. If 2 more boys join the class, what percentage of the class will be boys?",
        options: ["43.75%", "44.44%", "45.16%", "46.88%"],
        correctAnswer: "43.75%",
        explanation: "Initially 12 boys (40% of 30), after 2 more: 14 boys out of 32 total = 14/32 = 43.75%"
      },
      {
        question: "A company's profit increased by 15% to $69,000. What was the original profit?",
        options: ["$58,650", "$60,000", "$61,500", "$63,250"],
        correctAnswer: "$60,000",
        explanation: "If 115% = $69,000, then 100% = $69,000 ÷ 1.15 = $60,000"
      },
      {
        question: "If 3 machines can produce 180 items in 4 hours, how many items can 5 machines produce in 6 hours?",
        options: ["420 items", "450 items", "480 items", "500 items"],
        correctAnswer: "450 items",
        explanation: "Rate: 180/(3×4) = 15 items per machine-hour. With 5 machines for 6 hours: 15 × 5 × 6 = 450 items"
      },
      {
        question: "A triangle has angles of x°, 2x°, and 3x°. What is the value of x?",
        options: ["25°", "30°", "35°", "40°"],
        correctAnswer: "30°",
        explanation: "Sum of angles = 180°, so x° + 2x° + 3x° = 180°, 6x° = 180°, x = 30°"
      },
      {
        question: "If the ratio of blue to red marbles is 3:4, and there are 84 marbles in total, how many blue marbles are there?",
        options: ["32", "36", "38", "42"],
        correctAnswer: "36",
        explanation: "Total parts = 3 + 4 = 7, each part = 84 ÷ 7 = 12, blue marbles = 3 × 12 = 36"
      }
    ]
  }
};

// Add new celebration components
const GameCompletionCelebration = ({ score, streak, timeLeft, difficulty, onPlayAgain }) => {
  useEffect(() => {
    // Create multiple confetti bursts
    const burstConfetti = () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      const count = 200;
      
      // Center burst
      confetti({
        particleCount: count,
        spread: 100,
        origin: { y: 0.6 },
        colors: colors,
      });

      // Left burst
      setTimeout(() => {
        confetti({
          particleCount: count/2,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors,
        });
      }, 250);

      // Right burst
      setTimeout(() => {
        confetti({
          particleCount: count/2,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors,
        });
      }, 400);
    };

    // Multiple bursts for extended celebration
    burstConfetti();
    const interval = setInterval(burstConfetti, 1500);
    setTimeout(() => clearInterval(interval), 4500);

    // Play celebration sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    audio.play().catch(() => {}); // Catch and ignore if autoplay is blocked
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Typography variant="h2" sx={{ 
            mb: 3, 
            fontFamily: 'Fredoka One',
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎉 Amazing Job! 🎉
          </Typography>
        </motion.div>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          mb: 4,
          flexWrap: 'wrap' 
        }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: 'primary.light',
            color: 'white',
            minWidth: 200
          }}>
            <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Fredoka One' }}>
              {score}
            </Typography>
            <Typography sx={{ fontFamily: 'Fredoka One' }}>
              Final Score
            </Typography>
          </Paper>

          <Paper sx={{ 
            p: 3, 
            bgcolor: 'secondary.light',
            color: 'white',
            minWidth: 200
          }}>
            <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Fredoka One' }}>
              {streak}
            </Typography>
            <Typography sx={{ fontFamily: 'Fredoka One' }}>
              Best Streak
            </Typography>
          </Paper>

          <Paper sx={{ 
            p: 3, 
            bgcolor: 'success.light',
            color: 'white',
            minWidth: 200
          }}>
            <Timer sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" sx={{ fontFamily: 'Fredoka One' }}>
              {timeLeft}s
            </Typography>
            <Typography sx={{ fontFamily: 'Fredoka One' }}>
              Time Left
            </Typography>
          </Paper>
        </Box>

        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onPlayAgain}
            startIcon={<Psychology />}
            sx={{ 
              fontFamily: 'Fredoka One',
              fontSize: '1.2rem',
              py: 2,
              px: 4,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8787, #6EE7E7)',
              }
            }}
          >
            Play Again
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
};

const BrainTeasers = () => {
  const [difficulty, setDifficulty] = useState('EASY');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_LEVELS.EASY.timeLimit);
  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showStreakMultiplier, setShowStreakMultiplier] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hasAttempted, setHasAttempted] = useState(false);
  const timerRef = useRef(null);
  const [usedProblemIndices, setUsedProblemIndices] = useState(new Set());

  const getNextProblem = () => {
    const availableProblems = DIFFICULTY_LEVELS[difficulty].problems;
    const unusedIndices = Array.from(Array(availableProblems.length).keys())
      .filter(index => !usedProblemIndices.has(index));

    // If all problems have been used, reset and shuffle
    if (unusedIndices.length === 0) {
      setUsedProblemIndices(new Set());
      return Math.floor(Math.random() * availableProblems.length);
    }

    // Get random unused problem
    const randomIndex = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
    setUsedProblemIndices(prev => new Set([...prev, randomIndex]));
    return randomIndex;
  };

  const startGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setIsGameActive(true);
    setCurrentProblemIndex(getNextProblem());
    setHintsRemaining(3);
    setSelectedAnswer('');
    setShowHint(false);
    setFeedback(null);
    setUsedProblemIndices(new Set());
  }, [difficulty]);

  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isGameActive, timeLeft]);

  const handleAnswer = useCallback(() => {
    const currentProblem = DIFFICULTY_LEVELS[difficulty].problems[currentProblemIndex];
    if (!currentProblem || !selectedAnswer) return;

    setHasAttempted(true);

    if (selectedAnswer === currentProblem.correctAnswer) {
      // Show streak multiplier
      setShowStreakMultiplier(true);
      setTimeout(() => setShowStreakMultiplier(false), 1000);

      const basePoints = Math.floor(DIFFICULTY_LEVELS[difficulty].maxScore / DIFFICULTY_LEVELS[difficulty].problems.length);
      const timeBonus = Math.floor((timeLeft / DIFFICULTY_LEVELS[difficulty].timeLimit) * basePoints);
      const points = (basePoints + timeBonus) * (streak + 1);

      setScore(prev => prev + points);
      setStreak(prev => prev + 1);

      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${points} points!`
      });

      // Move to next problem or end game
      setTimeout(() => {
        if (currentProblemIndex < DIFFICULTY_LEVELS[difficulty].problems.length - 1) {
          setCurrentProblemIndex(getNextProblem());
          setSelectedAnswer('');
          setFeedback(null);
          setShowHint(false);
          setHasAttempted(false);
        } else {
          setIsGameActive(false);
          // Don't set feedback here as we'll show the celebration screen instead
        }
      }, 1500);
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: 'Not quite right. Try again! 💪'
      });
    }
  }, [currentProblemIndex, difficulty, selectedAnswer, streak, timeLeft, score]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameActive) return;

      // Handle hint key
      if (e.key.toLowerCase() === 'h' && hintsRemaining > 0 && !showHint && hasAttempted) {
        setShowHint(true);
        setHintsRemaining(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameActive, hintsRemaining, showHint, hasAttempted]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Add Climbing Character */}
        <ClimbingCharacter 
          progress={(currentProblemIndex / DIFFICULTY_LEVELS[difficulty].problems.length) * 100} 
        />

        {/* Add Streak Multiplier */}
        <AnimatePresence>
          {showStreakMultiplier && (
            <StreakMultiplier streak={streak + 1} isVisible={showStreakMultiplier} />
          )}
        </AnimatePresence>

        {/* Game Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontFamily: 'Fredoka One', color: 'primary.main' }}>
            Brain Teasers
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
              disabled={isGameActive}
            >
              {Object.entries(DIFFICULTY_LEVELS).map(([key, { name }]) => (
                <MenuItem key={key} value={key}>{name}</MenuItem>
              ))}
            </Select>
            <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
              {score} pts
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
              {streak} 🔥
            </Typography>
          </Box>
        </Box>

        {/* Timer */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={(timeLeft / DIFFICULTY_LEVELS[difficulty].timeLimit) * 100}
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: timeLeft < 60 ? 'error.main' : 'success.main'
              }
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 1, 
              textAlign: 'center',
              fontFamily: 'Fredoka One',
              color: timeLeft < 60 ? 'error.main' : 'text.secondary'
            }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Box>

        {!isGameActive && score > 0 ? (
          <GameCompletionCelebration 
            score={score}
            streak={streak}
            timeLeft={timeLeft}
            difficulty={difficulty}
            onPlayAgain={startGame}
          />
        ) : !isGameActive ? (
          // Start Screen
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Fredoka One' }}>
              Ready to Challenge Your Mind? 🧩
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              startIcon={<Psychology />}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Start Game
            </Button>
          </Box>
        ) : (
          // Game Content
          <>
            {/* Problem Display */}
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3,
                  fontFamily: 'Fredoka One',
                  color: 'text.primary'
                }}
              >
                Problem {currentProblemIndex + 1} of {DIFFICULTY_LEVELS[difficulty].problems.length}
              </Typography>

              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  fontFamily: 'Fredoka One',
                  color: 'text.primary'
                }}
              >
                {DIFFICULTY_LEVELS[difficulty].problems[currentProblemIndex].question}
              </Typography>

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                >
                  {DIFFICULTY_LEVELS[difficulty].problems[currentProblemIndex].options.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={
                        <Typography sx={{ fontFamily: 'Fredoka One' }}>
                          {option}
                        </Typography>
                      }
                      sx={{
                        mb: 2,
                        p: 2,
                        border: '2px solid',
                        borderColor: selectedAnswer === option ? 'primary.main' : 'transparent',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  startIcon={<Lightbulb />}
                  onClick={() => {
                    if (hintsRemaining > 0) {
                      setShowHint(true);
                      setHintsRemaining(prev => prev - 1);
                    }
                  }}
                  disabled={hintsRemaining === 0 || showHint || !hasAttempted}
                  sx={{ fontFamily: 'Fredoka One' }}
                >
                  Hint (H) {hasAttempted ? `(${hintsRemaining})` : '(Answer first)'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleAnswer}
                  disabled={!selectedAnswer}
                  sx={{ 
                    minWidth: 120,
                    fontFamily: 'Fredoka One'
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>

            {/* Hint Display */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Paper
                  sx={{ 
                    p: 3, 
                    mt: 2, 
                    bgcolor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'secondary.main'
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
                    Let's solve this step by step:
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    {DIFFICULTY_LEVELS[difficulty].problems[currentProblemIndex].explanation}
                  </Typography>
                </Paper>
              </motion.div>
            )}

            {/* Feedback Display */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Paper
                    sx={{ 
                      p: 2, 
                      mt: 3, 
                      bgcolor: feedback.type === 'success' ? 'success.light' : 'error.light',
                      color: 'white'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
                      {feedback.message}
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default BrainTeasers; 