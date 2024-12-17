import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Grid,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Lightbulb, Rocket } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import NumberPad from '../NumberPad';

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
  const { currentUser } = useAuth();
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

  const handleNumberClick = (number) => {
    setUserAnswer(prev => prev + number);
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!problem) return;

    const numAnswer = parseInt(userAnswer);
    if (numAnswer === problem.answer) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Update score and streak
      const streakMultiplier = Math.min(Math.floor(streak / 5) + 1, 5);
      const points = 100 * streakMultiplier;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setShowStreakMultiplier(true);
      setTimeout(() => setShowStreakMultiplier(false), 1500);

      // Show success feedback
      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${points} points!`
      });

      // Progress tracking
      setProblemsCompleted(prev => {
        const newCompleted = prev + 1;
        if (newCompleted >= PROBLEMS_PER_LEVEL) {
          setLevel(prevLevel => Math.min(prevLevel + 1, 4));
          return 0;
        }
        return newCompleted;
      });

      // Reset for next problem
      setTimeout(() => {
        setProblem(generateProblem(level));
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
        setWorkingSteps([]);
      }, 1500);
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: 'Not quite right. Try again! 💪'
      });
    }
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
      if (problem) {
        const steps = generateHint(problem.num1, problem.num2);
        setWorkingSteps(steps);
      }
    }
  };

  // Load user's progress when component mounts
  useEffect(() => {
    if (currentUser) {
      try {
        fetch(`/api/progress/${currentUser.uid}/multiplication`)
          .then(res => res.json())
          .then(data => {
            if (data) {
              setLevel(data.level || 1);
              setScore(data.score || 0);
              setProblemsCompleted(data.problemsCompleted || 0);
            }
          });
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [currentUser]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Add user info display */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Typography variant="h6" sx={{ fontFamily: 'Fredoka One', color: 'text.secondary' }}>
          {currentUser?.displayName || currentUser?.email}
        </Typography>
      </Box>

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
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ fontFamily: 'Fredoka One', mb: 2 }}>
            {problem?.num1} × {problem?.num2}
          </Typography>

          {/* Answer Display */}
          <Box sx={{ 
            width: '200px',
            height: '60px',
            margin: '0 auto',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            backgroundColor: 'white'
          }}>
            <Typography variant="h3" sx={{ fontFamily: 'Fredoka One' }}>
              {userAnswer || ' '}
            </Typography>
          </Box>

          {/* Number Pad */}
          <NumberPad
            onNumberClick={handleNumberClick}
            onBackspace={handleBackspace}
            onEnter={handleSubmit}
            onHint={handleHint}
            userAnswer={userAnswer}
            hintsRemaining={hintsRemaining}
            showHint={showHint}
          />
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