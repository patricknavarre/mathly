import { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Lightbulb, Speed } from '@mui/icons-material';

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
          ⚡
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
    operations: ['+', '-'],
    numberRange: [1, 20],
    timeLimit: 60,
    maxScore: 100
  },
  MEDIUM: {
    name: 'Medium',
    operations: ['+', '-', '*'],
    numberRange: [1, 50],
    timeLimit: 45,
    maxScore: 200
  },
  HARD: {
    name: 'Hard',
    operations: ['+', '-', '*', '/'],
    numberRange: [1, 100],
    timeLimit: 30,
    maxScore: 300
  }
};

const SpeedMath = () => {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState('EASY');
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_LEVELS.EASY.timeLimit);
  const [isGameActive, setIsGameActive] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [showStreakMultiplier, setShowStreakMultiplier] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const timerRef = useRef(null);

  const generateProblem = (level) => {
    const { operations, numberRange } = DIFFICULTY_LEVELS[level];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    do {
      num1 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];
      num2 = Math.floor(Math.random() * (numberRange[1] - numberRange[0] + 1)) + numberRange[0];

      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          // Ensure positive result
          if (num1 < num2) [num1, num2] = [num2, num1];
          answer = num1 - num2;
          break;
        case '*':
          answer = num1 * num2;
          break;
        case '/':
          // Ensure clean division
          answer = num1;
          num1 = answer * num2;
          break;
      }
    } while (answer < 0 || answer > numberRange[1] * 2);

    return {
      num1,
      num2,
      operation,
      answer
    };
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    setIsGameActive(true);
    setProblemsCompleted(0);
    setHintsRemaining(3);
    setProblem(generateProblem(difficulty));
  };

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
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameActive]);

  const handleAnswer = (answer) => {
    const numAnswer = parseInt(answer);
    if (numAnswer === problem.answer) {
      // Show streak multiplier
      setShowStreakMultiplier(true);
      setTimeout(() => setShowStreakMultiplier(false), 1000);

      const basePoints = Math.floor(DIFFICULTY_LEVELS[difficulty].maxScore / 10);
      const timeBonus = Math.floor((timeLeft / DIFFICULTY_LEVELS[difficulty].timeLimit) * basePoints);
      const points = (basePoints + timeBonus) * (streak + 1);

      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setProblemsCompleted(prev => prev + 1);

      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${points} points!`
      });

      // Generate new problem after delay
      setTimeout(() => {
        setProblem(generateProblem(difficulty));
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
      }, 1000);
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: 'Not quite right. Try again! 💪'
      });
    }
  };

  // Add keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameActive) return;

      // Handle number keys
      if (/^[0-9]$/.test(e.key)) {
        setUserAnswer(prev => prev + e.key);
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        setUserAnswer(prev => prev.slice(0, -1));
      }
      // Handle enter
      else if (e.key === 'Enter' && userAnswer) {
        handleAnswer(userAnswer);
      }
      // Handle hint
      else if (e.key.toLowerCase() === 'h' && hintsRemaining > 0 && !showHint) {
        setShowHint(true);
        setHintsRemaining(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userAnswer, isGameActive, hintsRemaining, showHint]);

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
        <ClimbingCharacter progress={(problemsCompleted / 10) * 100} />

        {/* Add Streak Multiplier */}
        <AnimatePresence>
          {showStreakMultiplier && (
            <StreakMultiplier streak={streak + 1} isVisible={showStreakMultiplier} />
          )}
        </AnimatePresence>

        {/* Game Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontFamily: 'Fredoka One', color: 'primary.main' }}>
            Speed Math
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
                backgroundColor: timeLeft < 10 ? 'error.main' : 'success.main'
              }
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 1, 
              textAlign: 'center',
              fontFamily: 'Fredoka One',
              color: timeLeft < 10 ? 'error.main' : 'text.secondary'
            }}
          >
            {timeLeft}s
          </Typography>
        </Box>

        {!isGameActive ? (
          // Start Screen
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontFamily: 'Fredoka One' }}>
              Ready to Challenge Your Speed? ⚡
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startGame}
              startIcon={<Speed />}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Start Game
            </Button>
          </Box>
        ) : (
          // Game Content
          <>
            {/* Problem Display */}
            {problem && (
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontFamily: 'Fredoka One',
                    mb: 2
                  }}
                >
                  {problem.num1} {problem.operation} {problem.num2}
                </Typography>

                {/* Input Area */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <TextField
                    value={userAnswer}
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    size="large"
                    sx={{ 
                      width: 200,
                      '& input': {
                        fontSize: '2rem',
                        textAlign: 'center',
                        fontFamily: 'Fredoka One'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAnswer(userAnswer)}
                    sx={{ 
                      py: 2,
                      px: 4,
                      fontFamily: 'Fredoka One'
                    }}
                  >
                    Enter ↵
                  </Button>
                </Box>

                {/* Hint Button */}
                <Button
                  variant="outlined"
                  startIcon={<Lightbulb />}
                  onClick={() => {
                    if (hintsRemaining > 0) {
                      setShowHint(true);
                      setHintsRemaining(prev => prev - 1);
                    }
                  }}
                  disabled={hintsRemaining === 0 || showHint}
                  sx={{ mt: 2, fontFamily: 'Fredoka One' }}
                >
                  Hint (H) ({hintsRemaining})
                </Button>
              </Box>
            )}

            {/* Keyboard Instructions */}
            <Box sx={{ 
              mt: 4, 
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography sx={{ fontFamily: 'Fredoka One' }}>
                Use number keys to type • Enter ↵ to check • Backspace to delete • H for hint
              </Typography>
            </Box>

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
                  <Box sx={{ mt: 2 }}>
                    {problem.operation === '+' && (
                      <Typography>
                        Add the numbers: {problem.num1} + {problem.num2} = {problem.answer}
                      </Typography>
                    )}
                    {problem.operation === '-' && (
                      <Typography>
                        Subtract: {problem.num1} - {problem.num2} = {problem.answer}
                      </Typography>
                    )}
                    {problem.operation === '*' && (
                      <Typography>
                        Multiply: {problem.num1} × {problem.num2} = {problem.answer}
                      </Typography>
                    )}
                    {problem.operation === '/' && (
                      <Typography>
                        Divide: {problem.num1} ÷ {problem.num2} = {problem.answer}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SpeedMath; 