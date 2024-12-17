import { useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

// NumberButton component for the number pad
const NumberButton = ({ number, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#4ECDC4',
        color: 'white',
        fontSize: '1.5rem',
        fontFamily: 'Fredoka One',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'background-color 0.3s ease'
      }}
      onClick={() => onClick(number)}
    >
      {number}
    </motion.button>
  );
};

const NumberPad = ({ 
  onNumberClick, 
  onBackspace, 
  onEnter, 
  onHint,
  userAnswer = '',
  hintsRemaining = 0,
  showHint = false,
  maxLength = 5 
}) => {
  // Keyboard input handling
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Handle number keys (0-9)
      if (/^[0-9]$/.test(e.key)) {
        if (userAnswer.length < maxLength) {
          onNumberClick(parseInt(e.key));
        }
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        onBackspace();
      }
      // Handle enter for submit
      else if (e.key === 'Enter' && userAnswer) {
        onEnter();
      }
      // Handle 'h' key for hint
      else if (e.key.toLowerCase() === 'h' && hintsRemaining > 0 && !showHint) {
        onHint();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userAnswer, hintsRemaining, showHint, onNumberClick, onBackspace, onEnter, onHint, maxLength]);

  return (
    <>
      {/* Number Pad */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 2,
        maxWidth: '400px',
        margin: '0 auto',
        mb: 3
      }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={onNumberClick}
          />
        ))}
      </Box>

      {/* Control Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={onBackspace}
          disabled={!userAnswer}
          sx={{ fontFamily: 'Fredoka One' }}
        >
          ⌫
        </Button>
        <Button
          variant="contained"
          onClick={onEnter}
          disabled={!userAnswer}
          sx={{ fontFamily: 'Fredoka One', minWidth: '120px' }}
        >
          Check
        </Button>
        <Button
          variant="outlined"
          onClick={onHint}
          disabled={hintsRemaining === 0 || showHint}
          sx={{ fontFamily: 'Fredoka One' }}
        >
          Hint ({hintsRemaining})
        </Button>
      </Box>
    </>
  );
};

export default NumberPad; 