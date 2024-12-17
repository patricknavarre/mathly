import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Grid,
  LinearProgress,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import NumberPad from '../NumberPad';

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

const LongDivision = () => {
  const [problem, setProblem] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [workingSteps, setWorkingSteps] = useState([]);
  const [difficulty, setDifficulty] = useState('EASY');
  const [showStreakMultiplier, setShowStreakMultiplier] = useState(false);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [isGameComplete, setIsGameComplete] = useState(false);

  useEffect(() => {
    startNewProblem();
  }, [difficulty]);

  const startNewProblem = () => {
    const newProblem = generateProblem(difficulty);
    setProblem(newProblem);
    setCurrentStep(0);
    setUserAnswer('');
    setWorkingSteps([]);
    setShowHint(false);
    setProblemsCompleted(prev => prev + 1);
    setIsGameComplete(false);
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
        instruction: `What is ${currentProblem.divisor} × ${quotientDigit}?`,
        currentValue,
        product,
        remainder,
        expectedAnswer: product.toString(),
        quotientSoFar,
        position,
        hint: `${currentProblem.divisor} × ${quotientDigit} = ${product}`
      });

      steps.push({
        type: 'subtract',
        instruction: `What is ${currentValue} - ${product}?`,
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
    setUserAnswer(prev => prev + number);
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!userAnswer || !problem?.steps[currentStep]) return;

    const currentStepData = problem.steps[currentStep];
    if (userAnswer === currentStepData.expectedAnswer) {
      const basePoints = DIFFICULTY_LEVELS[difficulty].maxScore / problem.steps.length;
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

      if (currentStepData.type === 'subtract') {
        setWorkingSteps(prev => [...prev, {
          ...currentStepData,
          value: userAnswer,
          position: Math.floor(currentStep / 3)
        }]);
      }

      // Only set isGameComplete when we're at the last step AND the answer is correct
      if (currentStep === problem.steps.length - 1) {
        setTimeout(() => {
          setIsGameComplete(true);
          setFeedback({ 
            type: 'success', 
            message: `Problem Complete! +${Math.floor(basePoints * 1.5)} bonus points!` 
          });
          setScore(prev => prev + Math.floor(basePoints * 1.5));
        }, 1000);
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

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  if (!problem) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            {Math.ceil(score)} pts
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
            {streak} 🔥
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          position: 'relative'
        }}
      >
        {/* Current Step Instruction */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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

        {/* Division Problem Display */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ 
            display: 'inline-flex',
            position: 'relative',
            mb: 3,
            alignItems: 'flex-start'
          }}>
            {/* Divisor */}
            <Typography variant="h2" sx={{ 
              fontFamily: 'Fredoka One',
              mr: 2,
              color: '#f44336'
            }}>
              {problem.divisor}
            </Typography>

            {/* Division Symbol and Dividend */}
            <Box>
              <Typography variant="h2" sx={{ 
                fontFamily: 'Fredoka One',
                borderLeft: '4px solid #666',
                borderTop: '4px solid #666',
                paddingLeft: 2,
                minWidth: '150px',
                textAlign: 'left',
                borderRadius: '8px 0 0 0'
              }}>
                {problem.dividend}
              </Typography>

              {/* Quotient Display */}
              <Box sx={{ 
                position: 'absolute',
                top: '-40px',
                left: '20px'
              }}>
                <Typography variant="h3" sx={{ 
                  fontFamily: 'Fredoka One',
                  color: '#2196f3'
                }}>
                  {problem.steps[currentStep]?.quotientSoFar}
                </Typography>
              </Box>

              {/* Working Steps */}
              <Box sx={{ 
                position: 'relative',
                minHeight: '100px',
                textAlign: 'left',
                pl: 2
              }}>
                {workingSteps.map((step, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography sx={{ 
                      fontFamily: 'Fredoka One',
                      color: '#f44336'
                    }}>
                      -{step.product}
                    </Typography>
                    <Box sx={{ 
                      width: '100%',
                      height: '2px',
                      bgcolor: '#666',
                      my: 0.5
                    }} />
                    <Typography sx={{ 
                      fontFamily: 'Fredoka One',
                      color: '#4caf50'
                    }}>
                      {step.remainder}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

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

        {isGameComplete && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
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
        )}
      </Paper>
    </Container>
  );
};

export default LongDivision; 