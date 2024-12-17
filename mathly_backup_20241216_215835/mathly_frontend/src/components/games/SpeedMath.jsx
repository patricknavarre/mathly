import { useState, useEffect } from 'react';
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

const SpeedMath = () => {
  const [problem, setProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState('EASY');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameActive, setIsGameActive] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const generateProblem = () => {
    const operations = {
      EASY: ['+', '-'],
      MEDIUM: ['+', '-', '*'],
      HARD: ['+', '-', '*', '/']
    };
    const ranges = {
      EASY: [1, 20],
      MEDIUM: [1, 50],
      HARD: [1, 100]
    };

    const operation = operations[difficulty][Math.floor(Math.random() * operations[difficulty].length)];
    const range = ranges[difficulty];
    let num1 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    let num2 = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    let answer;

    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        answer = num1;
        num1 = answer * num2;
        break;
      default:
        answer = num1 + num2;
    }

    return { num1, num2, operation, answer };
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(60);
    setIsGameActive(true);
    setHintsRemaining(3);
    setProblem(generateProblem());
  };

  const handleAnswer = () => {
    if (!problem) return;

    const numAnswer = parseInt(userAnswer);
    if (numAnswer === problem.answer) {
      const basePoints = 100;
      const timeBonus = Math.floor((timeLeft / 60) * 50);
      const streakBonus = streak * 10;
      const points = basePoints + timeBonus + streakBonus;

      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${points} points!`
      });

      setTimeout(() => {
        setProblem(generateProblem());
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          position: 'relative'
        }}
      >
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
              <MenuItem value="EASY">Easy</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HARD">Hard</MenuItem>
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
            value={(timeLeft / 60) * 100}
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
            {formatTime(timeLeft)}
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
                    onChange={(e) => setUserAnswer(e.target.value)}
                    variant="outlined"
                    type="number"
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
                    onClick={handleAnswer}
                    sx={{
                      py: 2,
                      px: 4,
                      fontFamily: 'Fredoka One'
                    }}
                  >
                    Check Answer
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
                  Hint ({hintsRemaining})
                </Button>
              </Box>
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
                  <Typography variant="body1" sx={{ fontFamily: 'Fredoka One' }}>
                    💡 Let's solve this step by step:
                    {problem.operation === '+' && (
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        Add the numbers: {problem.num1} + {problem.num2} = {problem.answer}
                      </Box>
                    )}
                    {problem.operation === '-' && (
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        Subtract: {problem.num1} - {problem.num2} = {problem.answer}
                      </Box>
                    )}
                    {problem.operation === '*' && (
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        Multiply: {problem.num1} × {problem.num2} = {problem.answer}
                      </Box>
                    )}
                    {problem.operation === '/' && (
                      <Box component="span" sx={{ display: 'block', mt: 1 }}>
                        Divide: {problem.num1} ÷ {problem.num2} = {problem.answer}
                      </Box>
                    )}
                  </Typography>
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