import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
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
import NumberPad from '../NumberPad';

// Problem Templates
const PROBLEM_TEMPLATES = [
  {
    template: "NAME has TOTAL_ITEMS ITEMS. They want to share them equally among NUM_FRIENDS friends. How many ITEMS will each friend get?",
    generateProblem: () => {
      const friends = Math.floor(Math.random() * 8) + 2; // 2-9 friends
      const itemsPerFriend = Math.floor(Math.random() * 8) + 2; // 2-9 items per friend
      const total = friends * itemsPerFriend;
      const items = ['cookies', 'candies', 'stickers', 'marbles', 'toys'][Math.floor(Math.random() * 5)];
      const name = ['Sarah', 'Tom', 'Emma', 'Jack', 'Lily'][Math.floor(Math.random() * 5)];
      return {
        question: `${name} has ${total} ${items}. They want to share them equally among ${friends} friends. How many ${items} will each friend get?`,
        answer: itemsPerFriend,
        hint: `To find out how many ${items} each friend gets, divide the total number of ${items} by the number of friends.`,
        explanation: `Since ${name} has ${total} ${items} and wants to share them equally among ${friends} friends, we divide ${total} by ${friends}: ${total} ÷ ${friends} = ${itemsPerFriend} ${items} per friend.`
      };
    }
  },
  {
    template: "A store has ROWS rows of ITEMS. Each row has ITEMS_PER_ROW items. How many ITEMS can the store display in total?",
    generateProblem: () => {
      const rows = Math.floor(Math.random() * 7) + 2; // 2-8 rows
      const itemsPerRow = Math.floor(Math.random() * 7) + 2; // 2-8 items per row
      const total = rows * itemsPerRow;
      const items = ['action figures', 'books', 'games', 'puzzles', 'toys'][Math.floor(Math.random() * 5)];
      return {
        question: `A store has ${rows} rows of ${items}. Each row has ${itemsPerRow} ${items}. How many ${items} can the store display in total?`,
        answer: total,
        hint: `To find the total number of ${items}, multiply the number of rows by the number of ${items} in each row.`,
        explanation: `With ${rows} rows and ${itemsPerRow} ${items} per row, we multiply: ${rows} × ${itemsPerRow} = ${total} total ${items}.`
      };
    }
  },
  {
    template: "NAME has MONEY dollars. They want to buy ITEMS that cost COST dollars each. How many ITEMS can they buy?",
    generateProblem: () => {
      const itemCost = Math.floor(Math.random() * 8) + 2; // $2-9 per item
      const numItems = Math.floor(Math.random() * 7) + 2; // 2-8 items
      const total = itemCost * numItems;
      const items = ['notebooks', 'pencils', 'erasers', 'markers', 'books'][Math.floor(Math.random() * 5)];
      const name = ['Tom', 'Lisa', 'Alex', 'Maya', 'Noah'][Math.floor(Math.random() * 5)];
      return {
        question: `${name} has $${total}. They want to buy ${items} that cost $${itemCost} each. How many ${items} can they buy?`,
        answer: numItems,
        hint: `To find how many ${items} ${name} can buy, divide their money by the cost of each ${items.slice(0, -1)}.`,
        explanation: `Since ${name} has $${total} and each ${items.slice(0, -1)} costs $${itemCost}, we divide: $${total} ÷ $${itemCost} = ${numItems} ${items}.`
      };
    }
  }
];

const generateRandomProblem = () => {
  const template = PROBLEM_TEMPLATES[Math.floor(Math.random() * PROBLEM_TEMPLATES.length)];
  return template.generateProblem();
};

const BrainTeasers = () => {
  const [currentProblem, setCurrentProblem] = useState(null);
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

  const handleNumberClick = (number) => {
    setUserAnswer(prev => prev + number);
  };

  const handleBackspace = () => {
    setUserAnswer(prev => prev.slice(0, -1));
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      setShowHint(true);
      setHintsRemaining(prev => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault(); // Make parameter optional
    if (userAnswer) {
      handleAnswer();
    }
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setStreak(0);
    setTimeLeft(300);
    setHintsRemaining(3);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setShowExplanation(false);
    setCurrentProblem(generateRandomProblem());
  };

  const handleAnswer = () => {
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

      // Move to next problem after delay
      setTimeout(() => {
        setCurrentProblem(generateRandomProblem());
        setUserAnswer('');
        setFeedback(null);
        setShowHint(false);
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
              {Math.ceil(score)} pts
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
                {currentProblem?.question}
              </Typography>

              {/* Hint Display */}
              {showHint && (
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: 'info.main',
                    fontFamily: 'Fredoka One'
                  }}
                >
                  💡 {currentProblem?.hint}
                </Typography>
              )}

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

              {/* Show Solution Button */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowExplanation(true)}
                  startIcon={<Lightbulb />}
                  sx={{ 
                    fontFamily: 'Fredoka One',
                    color: 'info.main',
                    borderColor: 'info.main',
                    '&:hover': {
                      borderColor: 'info.dark',
                      backgroundColor: 'info.light'
                    }
                  }}
                >
                  Show Solution
                </Button>
              </Box>
            </Box>
          </>
        )}

        {/* Explanation Dialog */}
        <Dialog
          open={showExplanation}
          onClose={() => setShowExplanation(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontFamily: 'Fredoka One' }}>
                Solution Explanation 💡
              </Typography>
              <IconButton onClick={() => setShowExplanation(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ fontFamily: 'Fredoka One' }}>
              {currentProblem?.explanation}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowExplanation(false)}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Got it!
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default BrainTeasers; 