import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Button,
  Select,
  MenuItem,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const DIFFICULTY_LEVELS = {
  EASY: {
    name: 'Easy',
    digitRange: [1, 2],
    divisorRange: [2, 9],
    maxScore: 100
  },
  MEDIUM: {
    name: 'Medium',
    digitRange: [2, 3],
    divisorRange: [2, 12],
    maxScore: 200
  },
  HARD: {
    name: 'Hard',
    digitRange: [3, 4],
    divisorRange: [2, 20],
    maxScore: 300
  }
};

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateProblem = (difficulty) => {
  const { digitRange, divisorRange } = DIFFICULTY_LEVELS[difficulty];
  const numDigits = generateRandomNumber(...digitRange);
  const divisor = generateRandomNumber(...divisorRange);
  
  // Generate dividend that's guaranteed to be divisible by divisor
  let dividend;
  do {
    dividend = generateRandomNumber(
      Math.pow(10, numDigits - 1),
      Math.pow(10, numDigits) - 1
    );
  } while (dividend % divisor !== 0);

  return {
    dividend,
    divisor,
    steps: []
  };
};

// Add Confetti component at the top
const Confetti = ({ isActive }) => {
  const confettiCount = 50;
  
  if (!isActive) return null;
  
  return (
    <Box sx={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      pointerEvents: 'none',
      zIndex: 10 
    }}>
      {[...Array(confettiCount)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 0.5;
        const randomDuration = 1 + Math.random() * 2;
        const randomRotation = Math.random() * 360;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              y: -20,
              x: `${randomX}%`,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: '100vh',
              x: [`${randomX}%`, `${randomX + (Math.random() * 20 - 10)}%`],
              rotate: randomRotation,
              opacity: 0
            }}
            transition={{ 
              duration: randomDuration,
              delay: randomDelay,
              ease: [0.23, 0.51, 0.32, 0.95]
            }}
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0%'
            }}
          />
        );
      })}
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

// Add ClimbingCharacter component after other component definitions
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
          🧗
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

const LongDivision = () => {
  // Game state
  const [problem, setProblem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [workingSteps, setWorkingSteps] = useState([]);
  const [difficulty, setDifficulty] = useState('EASY');
  const [problemCount, setProblemCount] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStreakMultiplier, setShowStreakMultiplier] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewProblem();
  }, [difficulty]);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle key presses when not game complete
      if (isGameComplete) return;

      // Handle number keys (both main keyboard and numpad)
      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(parseInt(e.key));
      }
      // Handle backspace/delete
      else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      }
      // Handle enter/return for checking answer
      else if (e.key === 'Enter' && userAnswer) {
        handleCheckAnswer();
      }
      // Handle 'h' key for hint
      else if (e.key.toLowerCase() === 'h' && hintsRemaining > 0 && !showHint) {
        handleShowHint();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userAnswer, isGameComplete, hintsRemaining, showHint]); // Add dependencies

  const startNewProblem = () => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setCurrentStep(0);
    setUserAnswer('');
    setWorkingSteps([]);
    setShowHint(false);
    setProblemCount(prev => prev + 1);
    generateSteps(newProblem);
  };

  // Generate steps for the division process
  const generateSteps = (currentProblem = problem) => {
    if (!currentProblem) return;
    
    const steps = [];
    const dividendStr = currentProblem.dividend.toString();
    let currentNumber = '';
    let position = 0;
    let quotientSoFar = '';

    for (let i = 0; i < dividendStr.length; i++) {
      currentNumber += dividendStr[i];
      let currentValue = parseInt(currentNumber);

      if (currentValue < currentProblem.divisor && i < dividendStr.length - 1) {
        currentNumber += dividendStr[i + 1];
        currentValue = parseInt(currentNumber);
        i++;
      }

      const quotientDigit = Math.floor(currentValue / currentProblem.divisor);
      const product = quotientDigit * currentProblem.divisor;
      const remainder = currentValue - product;

      steps.push({
        type: 'divide',
        instruction: `How many times does ${currentProblem.divisor} go into ${currentValue}?`,
        currentValue,
        expectedAnswer: quotientDigit.toString(),
        position,
        quotientSoFar,
        hint: `${currentValue} ÷ ${currentProblem.divisor} = ${quotientDigit}`
      });

      quotientSoFar += quotientDigit.toString();

      steps.push({
        type: 'multiply',
        instruction: `Multiply ${currentProblem.divisor} × ${quotientDigit} and subtract from ${currentValue}`,
        currentValue,
        product,
        remainder,
        expectedAnswer: remainder.toString(),
        quotientSoFar,
        position,
        hint: `${currentValue} - ${product} = ${remainder}`
      });

      currentNumber = remainder.toString();
      position++;
    }

    setProblem(prev => ({ ...prev, steps }));
  };

  const handleNumberClick = (number) => {
    const newAnswer = userAnswer + number.toString();
    setUserAnswer(newAnswer);
  };

  const handleCheckAnswer = () => {
    if (!userAnswer || !problem?.steps[currentStep]) return;

    const currentStepData = problem.steps[currentStep];
    if (userAnswer === currentStepData.expectedAnswer) {
      const basePoints = DIFFICULTY_LEVELS[difficulty].maxScore / (problem.steps.length / 2);
      const points = showHint ? Math.floor(basePoints / 2) : basePoints;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      
      // Show streak multiplier animation
      setShowStreakMultiplier(true);
      setTimeout(() => setShowStreakMultiplier(false), 1000);

      setFeedback({ 
        type: 'success', 
        message: `Correct! +${points} points${streak > 0 ? ` (${streak + 1}x streak!)` : ''}`
      });

      if (currentStepData.type === 'multiply') {
        setWorkingSteps(prev => [...prev, {
          ...currentStepData,
          value: userAnswer,
          position: Math.floor(currentStep / 2)
        }]);
      }

      if (currentStep === problem.steps.length - 1) {
        setIsGameComplete(true);
        // Show confetti on problem completion
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        setFeedback({ 
          type: 'success', 
          message: `Problem Complete! +${Math.floor(basePoints * 1.5)} bonus points!` 
        });
        setScore(prev => prev + Math.floor(basePoints * 1.5));
      } else {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setUserAnswer('');
          setFeedback(null);
          setShowHint(false);
        }, 1000);
      }
    } else {
      setStreak(0);
      setFeedback({ type: 'error', message: 'Try again!' });
    }
  };

  const handleShowHint = () => {
    if (hintsRemaining > 0 && !showHint) {
      setHintsRemaining(prev => prev - 1);
      setShowHint(true);
    }
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  // Calculate overall progress for the climbing character
  const calculateProgress = () => {
    if (!problem?.steps.length) return 0;
    return (currentStep / problem.steps.length) * 100;
  };

  if (!problem) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Add Confetti */}
      <Confetti isActive={showConfetti} />
      
      {/* Game Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontFamily: 'Fredoka One', color: 'primary.main' }}>
          Long Division
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
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

      {/* Progress Bar */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={(currentStep / problem.steps.length) * 100}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Game Area */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 4, 
        bgcolor: 'background.paper', 
        position: 'relative',
        overflow: 'hidden' // Add this to contain the climbing character
      }}>
        {/* Add Climbing Character */}
        <ClimbingCharacter progress={calculateProgress()} />

        {/* Add Streak Multiplier */}
        <AnimatePresence>
          {showStreakMultiplier && <StreakMultiplier streak={streak + 1} isVisible={showStreakMultiplier} />}
        </AnimatePresence>

        {/* Division Problem */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          {/* Quotient Display */}
          <Box sx={{ 
            position: 'absolute',
            top: '-40px',
            left: '80px',
            display: 'flex',
            gap: '1.5rem'
          }}>
            {problem.steps[currentStep]?.quotientSoFar.split('').map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Typography sx={{
                  fontSize: '2.5rem',
                  fontFamily: 'Fredoka One',
                  color: '#2196f3'
                }}>
                  {digit}
                </Typography>
              </motion.div>
            ))}
          </Box>

          {/* Division Layout */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography sx={{ 
              fontSize: '2.5rem',
              fontFamily: 'Fredoka One',
              color: '#f44336',
              mr: 2
            }}>
              {problem.divisor}
            </Typography>
            <Box sx={{ 
              borderLeft: '3px solid #666',
              borderTop: '3px solid #666',
              height: '100%',
              minHeight: '200px',
              width: '25px',
              borderRadius: '8px 0 0 0',
              mr: 3
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ 
                fontSize: '2.5rem',
                fontFamily: 'Fredoka One',
                mb: 3
              }}>
                {problem.dividend}
              </Typography>

              {/* Working Steps */}
              <Box sx={{ position: 'relative', minHeight: '150px' }}>
                <AnimatePresence>
                  {workingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        left: `${step.position * 60}px`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end'
                      }}
                    >
                      <Typography sx={{ 
                        fontSize: '2rem',
                        fontFamily: 'Fredoka One',
                        color: '#f44336'
                      }}>
                        -{step.product}
                      </Typography>
                      <Box sx={{ 
                        width: '100%',
                        height: '2px',
                        bgcolor: '#666',
                        my: 1
                      }} />
                      <Typography sx={{ 
                        fontSize: '2rem',
                        fontFamily: 'Fredoka One',
                        color: '#4caf50'
                      }}>
                        {step.remainder}
                      </Typography>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Current Step Instruction */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 1,
              fontFamily: 'Fredoka One',
              color: 'text.secondary'
            }}
          >
            {problem.steps[currentStep]?.instruction}
          </Typography>
          {showHint && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'info.main',
                fontFamily: 'Fredoka One'
              }}
            >
              Hint: {problem.steps[currentStep]?.hint}
            </Typography>
          )}
        </Box>

        {/* User Input Display */}
        <Box sx={{ 
          minHeight: '60px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography sx={{ 
            fontSize: '2.5rem',
            fontFamily: 'Fredoka One',
            color: userAnswer ? '#333' : '#666'
          }}>
            {userAnswer || '_'}
          </Typography>
        </Box>

        {isGameComplete ? (
          // Next Problem Button
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={startNewProblem}
              sx={{ 
                minWidth: '200px',
                fontFamily: 'Fredoka One'
              }}
            >
              Next Problem
            </Button>
          </Box>
        ) : (
          // Controls
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}>
            <Button
              variant="outlined"
              onClick={handleBackspace}
              disabled={!userAnswer}
              sx={{ 
                minWidth: '120px',
                fontFamily: 'Fredoka One'
              }}
            >
              Backspace
            </Button>
            <Button
              variant="outlined"
              onClick={handleShowHint}
              disabled={hintsRemaining === 0 || showHint}
              sx={{ 
                minWidth: '120px',
                fontFamily: 'Fredoka One'
              }}
            >
              Hint (H)
            </Button>
            <Button
              variant="contained"
              onClick={handleCheckAnswer}
              disabled={!userAnswer}
              sx={{ 
                minWidth: '120px',
                fontFamily: 'Fredoka One'
              }}
            >
              Enter ↵
            </Button>
          </Box>
        )}

        {/* Keyboard Instructions */}
        {!isGameComplete && (
          <Box sx={{ 
            mt: 4, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <Typography sx={{ fontFamily: 'Fredoka One' }}>
              Use number keys to type • Enter ↵ to check • Backspace to delete • H for hint
            </Typography>
          </Box>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Paper
                sx={{ 
                  p: 2,
                  mt: 3,
                  textAlign: 'center',
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
      </Paper>
    </Container>
  );
};

export default LongDivision; 