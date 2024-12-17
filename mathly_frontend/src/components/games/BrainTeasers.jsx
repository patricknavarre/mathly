import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Psychology, Lightbulb, Close as CloseIcon } from '@mui/icons-material';

const WORD_PROBLEMS = [
  {
    question: "Sarah has 24 cookies. She wants to share them equally among 6 friends. How many cookies will each friend get?",
    answer: 4,
    hint: "To find out how many cookies each friend gets, divide the total number of cookies by the number of friends.",
    explanation: "Since Sarah has 24 cookies and wants to share them equally among 6 friends, we divide 24 by 6: 24 ÷ 6 = 4 cookies per friend."
  },
  {
    question: "A toy store has 3 shelves of action figures. Each shelf can hold 8 figures. How many action figures can the store display in total?",
    answer: 24,
    hint: "To find the total number of action figures, multiply the number of shelves by how many figures each shelf can hold.",
    explanation: "With 3 shelves that can each hold 8 figures, we multiply: 3 × 8 = 24 total action figures."
  },
  {
    question: "Tom has $15. He wants to buy notebooks that cost $3 each. How many notebooks can he buy?",
    answer: 5,
    hint: "To find how many notebooks Tom can buy, divide his money by the cost of each notebook.",
    explanation: "Since Tom has $15 and each notebook costs $3, we divide: $15 ÷ $3 = 5 notebooks."
  },
  {
    question: "A garden has 7 rows of flowers. Each row has 6 flowers. How many flowers are there in total?",
    answer: 42,
    hint: "To find the total number of flowers, multiply the number of rows by the number of flowers in each row.",
    explanation: "With 7 rows and 6 flowers per row, we multiply: 7 × 6 = 42 total flowers."
  },
  {
    question: "Emma has 32 stickers. She gives 4 stickers to each of her friends. How many friends can she give stickers to?",
    answer: 8,
    hint: "To find how many friends can get stickers, divide the total number of stickers by stickers per friend.",
    explanation: "Since Emma has 32 stickers and gives 4 to each friend, we divide: 32 ÷ 4 = 8 friends."
  }
];

const BrainTeasers = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

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
        handleAnswer();
      }
      // Handle hint
      else if (e.key.toLowerCase() === 'h' && hintsRemaining > 0 && !showHint) {
        handleShowHint();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userAnswer, isGameActive, hintsRemaining, showHint]);

  const handleShowHint = () => {
    if (hintsRemaining > 0 && !showHint) {
      setHintsRemaining(prev => prev - 1);
      setShowHint(true);
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(300);
    setCurrentProblemIndex(0);
    setHintsRemaining(3);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowExplanation(false);
  };

  const handleAnswer = () => {
    const currentProblem = WORD_PROBLEMS[currentProblemIndex];
    const numAnswer = parseInt(userAnswer);

    if (numAnswer === currentProblem.answer) {
      const basePoints = 100;
      const timeBonus = Math.floor((timeLeft / 300) * 50);
      const streakBonus = streak * 10;
      const points = basePoints + timeBonus + streakBonus;

      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setFeedback({
        type: 'success',
        message: `🎉 Correct! +${points} points!`
      });

      // Show explanation dialog
      setShowExplanation(true);

      // Move to next problem after delay
      setTimeout(() => {
        if (currentProblemIndex < WORD_PROBLEMS.length - 1) {
          setCurrentProblemIndex((prev) => prev + 1);
          setUserAnswer('');
          setFeedback(null);
          setShowHint(false);
        } else {
          setIsGameActive(false);
        }
      }, 2000);
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
            Brain Teasers
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
            value={(timeLeft / 300) * 100}
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

        {!isGameActive ? (
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Fredoka One',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                {WORD_PROBLEMS[currentProblemIndex].question}
              </Typography>

              {/* Input Area */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                <TextField
                  value={userAnswer}
                  inputProps={{ 
                    readOnly: true,
                    style: {
                      fontSize: '2rem',
                      textAlign: 'center',
                      fontFamily: 'Fredoka One'
                    }
                  }}
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
                onClick={handleShowHint}
                disabled={hintsRemaining === 0 || showHint}
                sx={{ 
                  minWidth: '120px',
                  fontFamily: 'Fredoka One'
                }}
              >
                Hint (H)
              </Button>
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
                  <Typography variant="body1" sx={{ fontFamily: 'Fredoka One' }}>
                    💡 {WORD_PROBLEMS[currentProblemIndex].hint}
                  </Typography>
                </Paper>
              </motion.div>
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
          </>
        )}
      </Paper>

      {/* Explanation Dialog */}
      <Dialog
        open={showExplanation}
        onClose={() => setShowExplanation(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
              Solution Explanation
            </Typography>
            <IconButton onClick={() => setShowExplanation(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {WORD_PROBLEMS[currentProblemIndex].explanation}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowExplanation(false)}
            variant="contained"
            sx={{ fontFamily: 'Fredoka One' }}
          >
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BrainTeasers; 