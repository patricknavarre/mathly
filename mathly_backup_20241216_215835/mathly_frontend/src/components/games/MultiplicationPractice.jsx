import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Grid,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Lightbulb, Rocket } from '@mui/icons-material';

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
          🧮
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

const MultiplicationPractice = () => {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [workingSteps, setWorkingSteps] = useState([]);
  const [level, setLevel] = useState(1); // 1: 1-digit, 2: 2-digit, etc.
  const [showStreakMultiplier, setShowStreakMultiplier] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const PROBLEMS_PER_LEVEL = 5;

  const generateProblem = (level) => {
    const getRandomNumber = (digits) => {
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let num1, num2;
    switch(level) {
      case 1:
        num1 = getRandomNumber(1);
        num2 = getRandomNumber(1);
        break;
      case 2:
        num1 = getRandomNumber(2);
        num2 = getRandomNumber(1);
        break;
      case 3:
        num1 = getRandomNumber(3);
        num2 = getRandomNumber(1);
        break;
      case 4:
        num1 = getRandomNumber(4);
        num2 = getRandomNumber(1);
        break;
      default:
        num1 = getRandomNumber(1);
        num2 = getRandomNumber(1);
    }

    return {
      num1,
      num2,
      answer: num1 * num2
    };
  };

  const generateHint = (num1, num2) => {
    const steps = [];
    const num1Str = num1.toString();
    let totalSum = 0;
    
    // Break down the multiplication into steps
    for (let i = num1Str.length - 1; i >= 0; i--) {
      const digit = parseInt(num1Str[i]);
      const placeValue = Math.pow(10, num1Str.length - 1 - i);
      const stepResult = digit * num2 * placeValue;
      totalSum += stepResult;
      
      steps.push({
        explanation: `${digit} × ${num2} × ${placeValue} = ${stepResult}`,
        result: stepResult
      });
    }
    
    return steps;
  };

  useEffect(() => {
    setProblem(generateProblem(level));
  }, [level]);

  // Calculate progress for climbing character
  const calculateProgress = () => {
    return (problemsCompleted % PROBLEMS_PER_LEVEL) * (100 / PROBLEMS_PER_LEVEL);
  };

  // Modify handleAnswer to include new animations and progress
  const handleAnswer = (answer) => {
    const numAnswer = parseInt(answer);
    if (numAnswer === problem.answer) {
      // Show streak multiplier
      setShowStreakMultiplier(true);
      setTimeout(() => setShowStreakMultiplier(false), 1000);

      setScore(prev => prev + (level * 10 * (streak + 1)));
      setStreak(prev => prev + 1);
      setProblemsCompleted(prev => prev + 1);

      // Level up check
      if (problemsCompleted > 0 && (problemsCompleted + 1) % PROBLEMS_PER_LEVEL === 0 && level < 4) {
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setFeedback({
            type: 'success',
            message: '🌟 Level Up! Ready for bigger numbers?'
          });
        }, 1000);
      }

      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${level * 10 * (streak + 1)} points!`
      });

      // Generate new problem after delay
      setTimeout(() => {
        setProblem(generateProblem(level));
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
        setWorkingSteps([]);
      }, 2000);
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
  }, [userAnswer, hintsRemaining, showHint]);

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
        <ClimbingCharacter progress={calculateProgress()} />

        {/* Add Streak Multiplier */}
        <AnimatePresence>
          {showStreakMultiplier && (
            <StreakMultiplier streak={streak + 1} isVisible={showStreakMultiplier} />
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress()}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {/* Score Display */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
            Score: {score}
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
            Level: {level}
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
            {streak} 🔥
          </Typography>
        </Box>

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
              {problem.num1} × {problem.num2}
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
                  mb: 3, 
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
        {showHint && problem && (
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
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'Fredoka One' }}>
                Let's break it down! 🔢
              </Typography>
              {generateHint(problem.num1, problem.num2).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 }}
                >
                  <Typography 
                    sx={{ 
                      mb: 1,
                      py: 1,
                      px: 2,
                      bgcolor: index % 2 === 0 ? 'background.default' : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    {step.explanation}
                  </Typography>
                </motion.div>
              ))}
            </Paper>
          </motion.div>
        )}
      </Paper>
    </Container>
  );
};

export default MultiplicationPractice; 