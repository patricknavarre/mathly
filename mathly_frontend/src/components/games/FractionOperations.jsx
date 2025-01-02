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
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  Alert,
  Fade,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Add, Remove, Check, Close } from "@mui/icons-material";
import confetti from "canvas-confetti";

const FractionInput = ({ label, value, onChange, disabled = false }) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: "Fredoka One" }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <TextField
          type="number"
          value={value.numerator}
          onChange={(e) =>
            onChange({ ...value, numerator: parseInt(e.target.value) || 0 })
          }
          disabled={disabled}
          inputProps={{ min: 0, max: 99 }}
          sx={{ width: "70px" }}
        />
        <Typography variant="h5" sx={{ mx: 1 }}>
          /
        </Typography>
        <TextField
          type="number"
          value={value.denominator}
          onChange={(e) =>
            onChange({ ...value, denominator: parseInt(e.target.value) || 1 })
          }
          disabled={disabled}
          inputProps={{ min: 1, max: 99 }}
          sx={{ width: "70px" }}
        />
      </Box>
    </Box>
  );
};

const VisualFraction = ({ fraction, color }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        justifyContent: "center",
        my: 2,
      }}
    >
      {[...Array(fraction.denominator)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            backgroundColor: i < fraction.numerator ? color : "#f0f0f0",
          }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: "4px",
            border: "2px solid",
            borderColor: color,
          }}
        />
      ))}
    </Box>
  );
};

const FractionOperations = () => {
  const [operation, setOperation] = useState("add");
  const [fraction1, setFraction1] = useState({ numerator: 1, denominator: 2 });
  const [fraction2, setFraction2] = useState({ numerator: 1, denominator: 3 });
  const [userAnswer, setUserAnswer] = useState({
    numerator: 0,
    denominator: 1,
  });
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const calculateCorrectAnswer = () => {
    if (operation === "add") {
      const commonDenominator = fraction1.denominator * fraction2.denominator;
      const newNumerator1 = fraction1.numerator * fraction2.denominator;
      const newNumerator2 = fraction2.numerator * fraction1.denominator;
      return {
        numerator: newNumerator1 + newNumerator2,
        denominator: commonDenominator,
      };
    } else {
      const commonDenominator = fraction1.denominator * fraction2.denominator;
      const newNumerator1 = fraction1.numerator * fraction2.denominator;
      const newNumerator2 = fraction2.numerator * fraction1.denominator;
      return {
        numerator: newNumerator1 - newNumerator2,
        denominator: commonDenominator,
      };
    }
  };

  const checkAnswer = () => {
    const correctAnswer = calculateCorrectAnswer();
    const isAnswerCorrect =
      userAnswer.numerator * correctAnswer.denominator ===
      correctAnswer.numerator * userAnswer.denominator;

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);

    if (isAnswerCorrect) {
      setScore((prev) => prev + 100);
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

  const generateNewProblem = () => {
    const getRandomFraction = () => ({
      numerator: Math.floor(Math.random() * 5) + 1,
      denominator: Math.floor(Math.random() * 5) + 2,
    });

    setFraction1(getRandomFraction());
    setFraction2(getRandomFraction());
    setUserAnswer({ numerator: 0, denominator: 1 });
    setShowResult(false);
    setShowHint(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{ mb: 4, fontFamily: "Fredoka One" }}
      >
        Fraction {operation === "add" ? "Addition" : "Subtraction"}
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "24px",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        }}
      >
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} sx={{ mb: 2 }}>
            <ToggleButtonGroup
              value={operation}
              exclusive
              onChange={(_, newValue) => newValue && setOperation(newValue)}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ToggleButton value="add">
                <Add /> Addition
              </ToggleButton>
              <ToggleButton value="subtract">
                <Remove /> Subtraction
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12} md={4}>
            <FractionInput
              label="First Fraction"
              value={fraction1}
              onChange={setFraction1}
              disabled={showResult}
            />
            <VisualFraction fraction={fraction1} color="#FF6B6B" />
          </Grid>

          <Grid item xs={12} md={1}>
            <Typography variant="h4" align="center">
              {operation === "add" ? "+" : "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <FractionInput
              label="Second Fraction"
              value={fraction2}
              onChange={setFraction2}
              disabled={showResult}
            />
            <VisualFraction fraction={fraction2} color="#4ECDC4" />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h4" align="center" sx={{ my: 2 }}>
              =
            </Typography>
          </Grid>

          <Grid item xs={12} md={4} sx={{ mx: "auto" }}>
            <FractionInput
              label="Your Answer"
              value={userAnswer}
              onChange={setUserAnswer}
              disabled={showResult}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              onClick={checkAnswer}
              disabled={showResult}
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
                To {operation} fractions with different denominators:
                <ol>
                  <li>Find a common denominator (multiply the denominators)</li>
                  <li>
                    Convert each fraction to equivalent fractions with the
                    common denominator
                  </li>
                  <li>
                    {operation === "add" ? "Add" : "Subtract"} the numerators
                  </li>
                  <li>Simplify the result if possible</li>
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
                    onClick={generateNewProblem}
                  >
                    Try Another
                  </Button>
                }
              >
                {isCorrect
                  ? "Correct! Well done!"
                  : "Not quite right. Try again!"}
              </Alert>
            </Collapse>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontFamily: "Fredoka One" }}>
            Score: {score} | Streak: {streak}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default FractionOperations;
