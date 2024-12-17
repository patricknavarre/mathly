import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Grid
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Array of fun emoji objects to use
const visualObjects = [
  { emoji: '🐶', name: 'puppy' },
  { emoji: '🐱', name: 'kitten' },
  { emoji: '🐰', name: 'bunny' },
  { emoji: '🦊', name: 'fox' },
  { emoji: '🦁', name: 'lion' },
  { emoji: '🐼', name: 'panda' },
  { emoji: '🦄', name: 'unicorn' },
  { emoji: '🐸', name: 'frog' }
];

const VisualObject = ({ emoji, delay }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay * 0.1
      }}
      style={{
        fontSize: '3rem',
        display: 'inline-block',
        margin: '0.2rem',
        cursor: 'pointer'
      }}
      whileHover={{ scale: 1.2, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
    >
      {emoji}
    </motion.div>
  );
};

const VisualAddition = () => {
  const [problem, setProblem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentObject, setCurrentObject] = useState(visualObjects[0]);

  const generateProblem = () => {
    // Keep numbers small for young learners
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const answer = num1 + num2;

    // Generate 3 wrong answers that are close to the correct answer
    const wrongAnswers = [
      Math.max(1, answer - 1),
      answer + 1,
      Math.max(1, answer + 2)
    ].filter(a => a !== answer);

    // Randomly select the object to use
    const newObject = visualObjects[Math.floor(Math.random() * visualObjects.length)];
    setCurrentObject(newObject);

    return {
      num1,
      num2,
      answer,
      options: [...wrongAnswers, answer].sort(() => Math.random() - 0.5)
    };
  };

  useEffect(() => {
    setProblem(generateProblem());
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);

    if (answer === problem.answer) {
      // Celebration animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setScore(prev => prev + 100);
      setStreak(prev => prev + 1);
      setFeedback({
        type: 'success',
        message: '🎉 Wonderful job! Keep going!'
      });

      // Generate new problem after a short delay
      setTimeout(() => {
        setProblem(generateProblem());
        setSelectedAnswer(null);
        setFeedback(null);
      }, 2000);
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: 'Try again! You can do it! 💪'
      });
    }
  };

  if (!problem) return null;

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
        {/* Score Display */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
            Score: {score}
          </Typography>
          <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
            {streak} 🔥
          </Typography>
        </Box>

        {/* Problem Display */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 4, fontFamily: 'Fredoka One' }}>
            How many {currentObject.name}s are there in total?
          </Typography>

          {/* First Group */}
          <Box sx={{ mb: 4 }}>
            {[...Array(problem.num1)].map((_, i) => (
              <VisualObject key={`group1-${i}`} emoji={currentObject.emoji} delay={i} />
            ))}
          </Box>

          {/* Plus Sign */}
          <Typography variant="h2" sx={{ mb: 4, fontFamily: 'Fredoka One', color: 'primary.main' }}>
            +
          </Typography>

          {/* Second Group */}
          <Box sx={{ mb: 6 }}>
            {[...Array(problem.num2)].map((_, i) => (
              <VisualObject key={`group2-${i}`} emoji={currentObject.emoji} delay={i + problem.num1} />
            ))}
          </Box>

          {/* Answer Options */}
          <Grid container spacing={2} justifyContent="center">
            {problem.options.map((option, index) => (
              <Grid item key={option}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={selectedAnswer === option ? "contained" : "outlined"}
                    size="large"
                    onClick={() => handleAnswer(option)}
                    sx={{
                      minWidth: '100px',
                      minHeight: '100px',
                      borderRadius: '20px',
                      fontFamily: 'Fredoka One',
                      fontSize: '2rem'
                    }}
                  >
                    {option}
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Feedback Display */}
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
                  bgcolor: feedback.type === 'success' ? 'success.light' : 'warning.light',
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

export default VisualAddition; 