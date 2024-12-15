import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  CircularProgress,
  Container,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const GameArena = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const answer = num1 * num2;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const wrongAnswer = (Math.floor(Math.random() * 144) + 1);
      if (wrongAnswer !== answer && !wrongOptions.includes(wrongAnswer)) {
        wrongOptions.push(wrongAnswer);
      }
    }

    const allOptions = [...wrongOptions, answer];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setProblem({ num1, num2, answer });
    setOptions(shuffledOptions);
  };

  const handleAnswer = (selectedAnswer) => {
    const correct = selectedAnswer === problem.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 100);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      setIsCorrect(null);
      generateProblem();
    }, 1000);
  };

  useEffect(() => {
    generateProblem();
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="gameScore" color="primary">
            Score: {score}
          </Typography>
          <Typography variant="gameScore" color={timeLeft < 10 ? 'error' : 'primary'}>
            Time: {timeLeft}s
          </Typography>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={problem?.num1}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper
              variant="game-card"
              sx={{ 
                p: 4, 
                mb: 4,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
                color: 'white',
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
                {problem?.num1} × {problem?.num2} = ?
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              {options.map((option, index) => (
                <Grid item xs={6} key={option}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="game"
                      fullWidth
                      size="large"
                      onClick={() => handleAnswer(option)}
                      sx={{ 
                        height: 80,
                        fontSize: '1.5rem',
                        backgroundColor: isCorrect === null ? 'white' : 
                          (isCorrect && option === problem.answer ? 'success.main' : 
                          (!isCorrect && option === problem.answer ? 'error.main' : 'white'))
                      }}
                    >
                      {option}
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Container>
  );
};

export default GameArena; 