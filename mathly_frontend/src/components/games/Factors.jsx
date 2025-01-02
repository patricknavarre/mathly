/**
 * Copyright (c) 2024 Patrick Navarre
 *
 * This source code is licensed under the MIT License - see the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Chip,
  Collapse,
  Alert,
  Fade,
  CircularProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Close, Star } from "@mui/icons-material";
import confetti from "canvas-confetti";

const Factors = () => {
  const [number, setNumber] = useState(0);
  const [userFactors, setUserFactors] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [correctFactors, setCorrectFactors] = useState([]);

  const calculateFactors = (num) => {
    const factors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        factors.push(i);
      }
    }
    return factors;
  };

  const generateNewNumber = () => {
    const ranges = {
      easy: { min: 1, max: 20 },
      medium: { min: 20, max: 50 },
      hard: { min: 50, max: 100 },
    };
    const range = ranges[difficulty];
    const newNumber =
      Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    setNumber(newNumber);
    setCorrectFactors(calculateFactors(newNumber));
    setUserFactors([]);
    setShowResult(false);
    setShowHint(false);
    setInputValue("");
  };

  useEffect(() => {
    generateNewNumber();
  }, [difficulty]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseInt(value) > 0)) {
      setInputValue(value);
    }
  };

  const handleFactorSubmit = () => {
    const factor = parseInt(inputValue);
    if (!factor) return;

    if (!userFactors.includes(factor)) {
      if (number % factor === 0) {
        setUserFactors([...userFactors, factor].sort((a, b) => a - b));
        setInputValue("");
      } else {
        // Visual feedback for incorrect factor
        const input = document.getElementById("factor-input");
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 500);
      }
    }
  };

  const checkAnswer = () => {
    const isAnswerCorrect =
      userFactors.length === correctFactors.length &&
      userFactors.every((factor, index) => factor === correctFactors[index]);

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      const points =
        difficulty === "easy" ? 100 : difficulty === "medium" ? 200 : 300;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setStreak(0);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 4, fontFamily: "Fredoka One" }}
      >
        Factor Fun!
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "24px",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 2, fontFamily: "Fredoka One" }}>
              Find all factors of:
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Fredoka One",
                color: "primary.main",
                mb: 3,
              }}
            >
              {number}
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                id="factor-input"
                label="Enter a factor"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleFactorSubmit();
                  }
                }}
                disabled={showResult}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  min: 1,
                  max: number,
                  style: { fontSize: "1.2rem" },
                }}
                sx={{
                  width: { xs: "120px", sm: "150px" },
                  "& .MuiInputBase-root": {
                    height: { xs: "48px", sm: "56px" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  },
                  "& .shake": {
                    animation: "shake 0.5s",
                  },
                  "@keyframes shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "10%, 30%, 50%, 70%, 90%": {
                      transform: "translateX(-5px)",
                    },
                    "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleFactorSubmit}
                disabled={!inputValue || showResult}
                sx={{
                  ml: { xs: 1, sm: 2 },
                  height: { xs: "48px", sm: "56px" },
                  minWidth: { xs: "100px", sm: "120px" },
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                }}
              >
                Add Factor
              </Button>
            </Box>

            <Box sx={{ mb: 3, minHeight: "60px" }}>
              <AnimatePresence>
                {userFactors.map((factor) => (
                  <motion.div
                    key={factor}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    style={{ display: "inline-block", margin: "4px" }}
                  >
                    <Chip
                      label={factor}
                      color="primary"
                      sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={checkAnswer}
              disabled={showResult || userFactors.length === 0}
              sx={{
                mr: 2,
                background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
                color: "white",
                fontFamily: "Fredoka One",
              }}
            >
              Check Answer
            </Button>
            <Button
              variant="outlined"
              onClick={() => setShowHint(true)}
              disabled={showResult || showHint}
            >
              Need a Hint?
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Collapse in={showHint}>
              <Alert severity="info" sx={{ mt: 2 }}>
                Tips for finding factors:
                <ol>
                  <li>
                    A factor is a number that divides evenly into another number
                    (no remainder)
                  </li>
                  <li>1 and the number itself are always factors</li>
                  <li>Try dividing by small numbers first (2, 3, 4, etc.)</li>
                  <li>
                    If a number is a factor, its pair is also a factor (e.g., if
                    3 is a factor of 12, 4 is also a factor because 3 × 4 = 12)
                  </li>
                </ol>
              </Alert>
            </Collapse>

            <Collapse in={showResult}>
              <Alert
                severity={isCorrect ? "success" : "error"}
                sx={{ mt: 2 }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={generateNewNumber}
                  >
                    Try Another
                  </Button>
                }
              >
                {isCorrect ? (
                  "Correct! You found all the factors!"
                ) : (
                  <span>
                    Not quite! The factors of {number} are:{" "}
                    {correctFactors.join(", ")}
                  </span>
                )}
              </Alert>
            </Collapse>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontFamily: "Fredoka One" }}>
            Score: {score} | Streak: {streak}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant={difficulty === "easy" ? "contained" : "outlined"}
              onClick={() => setDifficulty("easy")}
              sx={{ mr: 1 }}
            >
              Easy (1-20)
            </Button>
            <Button
              variant={difficulty === "medium" ? "contained" : "outlined"}
              onClick={() => setDifficulty("medium")}
              sx={{ mr: 1 }}
            >
              Medium (20-50)
            </Button>
            <Button
              variant={difficulty === "hard" ? "contained" : "outlined"}
              onClick={() => setDifficulty("hard")}
            >
              Hard (50-100)
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Factors;
