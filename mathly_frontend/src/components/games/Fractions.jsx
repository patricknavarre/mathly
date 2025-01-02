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
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  LinearProgress,
  Badge,
  Chip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Timeline,
  LinearScale,
  Star,
  EmojiEvents,
  Whatshot,
} from "@mui/icons-material";

// Bar Model Component
const BarModel = ({ numerator, denominator, color = "#FF6B6B" }) => {
  return (
    <Box sx={{ display: "flex", width: "100%", gap: "2px", mb: 2 }}>
      {[...Array(denominator)].map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            backgroundColor: i < numerator ? color : "#FFE0E0",
            scale: i < numerator ? 1 : 0.85,
            boxShadow:
              i < numerator
                ? "0 4px 8px rgba(255,107,107,0.3)"
                : "inset 0 0 0 2px rgba(255,107,107,0.2)",
            filter: i < numerator ? "brightness(1.1)" : "brightness(1)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            backgroundColor: { duration: 0.2 },
          }}
          style={{
            height: "50px",
            flex: 1,
            margin: "0 2px",
            borderRadius: "8px",
          }}
        />
      ))}
    </Box>
  );
};

// Pie Chart Component
const PieChartModel = ({ numerator, denominator, color = "#4ECDC4" }) => {
  const inactiveColor = color === "#FF6B6B" ? "#FFE0E0" : "#E0F5F3";
  const segmentAngle = 360 / denominator;
  const activeAngle = (numerator / denominator) * 360;

  // Create the conic gradient string for the pie segments
  const createConicGradient = () => {
    let gradient = [];
    let currentAngle = 0;

    for (let i = 0; i < denominator; i++) {
      const isHighlighted = i < numerator;
      const startAngle = currentAngle;
      currentAngle += segmentAngle;

      gradient.push(
        `${
          isHighlighted ? color : inactiveColor
        } ${startAngle}deg ${currentAngle}deg`
      );
    }

    return `conic-gradient(${gradient.join(", ")})`;
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        margin: "0 auto",
        border: "3px solid",
        borderColor: color === "#FF6B6B" ? "#FFE0E0" : "#E0F5F3",
        boxShadow: `0 4px 12px ${
          color === "#FF6B6B" ? "rgba(255,107,107,0.2)" : "rgba(78,205,196,0.2)"
        }`,
        background: createConicGradient(),
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-3px",
          left: "-3px",
          right: "-3px",
          bottom: "-3px",
          borderRadius: "50%",
          background: `repeating-conic-gradient(
            from 0deg,
            transparent 0deg ${segmentAngle}deg,
            rgba(0,0,0,0.05) ${segmentAngle}deg ${segmentAngle + 1}deg
          )`,
          zIndex: 1,
          pointerEvents: "none",
        },
      }}
    />
  );
};

// Number Line Component
const NumberLine = ({ fractions, highlightIndex }) => {
  return (
    <Box sx={{ position: "relative", height: "100px", width: "100%" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "2px",
          bgcolor: "grey.300",
        }}
      />
      {fractions.map((fraction, index) => {
        const position = (fraction.numerator / fraction.denominator) * 100;
        return (
          <motion.div
            key={index}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            style={{
              position: "absolute",
              left: `${position}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Box
              sx={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                bgcolor:
                  index === highlightIndex ? "secondary.main" : "primary.main",
                mb: 1,
              }}
            />
            <Typography
              sx={{
                transform: "translateX(-50%)",
                fontFamily: "Fredoka One",
                color:
                  index === highlightIndex ? "secondary.main" : "primary.main",
              }}
            >
              {fraction.numerator}/{fraction.denominator}
            </Typography>
          </motion.div>
        );
      })}
    </Box>
  );
};

const Fractions = () => {
  const [visualization, setVisualization] = useState("bar");
  const [fraction1, setFraction1] = useState({ numerator: 1, denominator: 2 });
  const [fraction2, setFraction2] = useState({ numerator: 2, denominator: 4 });
  const [showEquivalence, setShowEquivalence] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [showNextButton, setShowNextButton] = useState(false);

  // Points calculation based on streak and difficulty
  const calculatePoints = (isCorrect) => {
    if (!isCorrect) return 0;
    const basePoints = {
      easy: 100,
      medium: 200,
      hard: 300,
    }[difficulty];
    const streakMultiplier = Math.min(Math.floor(streak / 3) + 1, 5);
    return basePoints * streakMultiplier;
  };

  // Generate fractions based on difficulty
  const generateFractionsByDifficulty = () => {
    const ranges = {
      easy: { min: 2, max: 6 },
      medium: { min: 3, max: 9 },
      hard: { min: 4, max: 12 },
    }[difficulty];

    const denominator =
      Math.floor(Math.random() * (ranges.max - ranges.min + 1)) + ranges.min;
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    return { numerator, denominator };
  };

  const handleVisualizationChange = (_, newValue) => {
    if (newValue !== null) {
      setVisualization(newValue);
    }
  };

  const checkEquivalence = () => {
    setIsChecking(true);
    setShowEquivalence(true);
    setShowNextButton(true);

    const isEqual =
      fraction1.numerator / fraction1.denominator ===
      fraction2.numerator / fraction2.denominator;
    const points = calculatePoints(isEqual);

    if (isEqual) {
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setProgress((prev) => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          setShowLevelUp(true);
          setLevel((prevLevel) => prevLevel + 1);
          if (level % 3 === 0) {
            setDifficulty((prev) =>
              prev === "easy" ? "medium" : prev === "medium" ? "hard" : "hard"
            );
          }
          return 0;
        }
        return newProgress;
      });

      // Celebration animation
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    } else {
      setStreak(0);
    }

    setIsChecking(false);
  };

  const handleNextProblem = () => {
    const newFraction1 = generateFractionsByDifficulty();
    const shouldBeEquivalent = Math.random() < 0.3;

    let newFraction2;
    if (shouldBeEquivalent) {
      const multiplier = Math.floor(Math.random() * 2) + 2;
      newFraction2 = {
        numerator: newFraction1.numerator * multiplier,
        denominator: newFraction1.denominator * multiplier,
      };
    } else {
      newFraction2 = generateFractionsByDifficulty();
    }

    setFraction1(newFraction1);
    setFraction2(newFraction2);
    setShowEquivalence(false);
    setShowNextButton(false);
    setShowLevelUp(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Game Stats Bar */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          icon={<Star sx={{ color: "#FFD700" }} />}
          label={`Score: ${score}`}
          sx={{
            fontFamily: "Fredoka One",
            bgcolor: "#FFF9C4",
            "& .MuiChip-label": { color: "#FFA000" },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Badge
            badgeContent={level}
            color="primary"
            sx={{ "& .MuiBadge-badge": { fontFamily: "Fredoka One" } }}
          >
            <EmojiEvents sx={{ color: "#FFD700", fontSize: 28 }} />
          </Badge>
          <Box sx={{ width: 200 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "#E0E0E0",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#4CAF50",
                },
              }}
            />
          </Box>
        </Box>
        <Chip
          icon={<Whatshot sx={{ color: streak > 0 ? "#FF3D00" : "#9E9E9E" }} />}
          label={`Streak: ${streak}`}
          sx={{
            fontFamily: "Fredoka One",
            bgcolor: streak > 0 ? "#FFEBEE" : "#F5F5F5",
            "& .MuiChip-label": { color: streak > 0 ? "#FF3D00" : "#9E9E9E" },
          }}
        />
      </Box>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: -50 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
            }}
          >
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "#FFF9C4",
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontFamily: "Fredoka One", color: "#FFA000" }}
              >
                🎉 Level Up! 🎉
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Fredoka One", color: "#FF6B6B" }}
              >
                Level {level}
              </Typography>
              {difficulty !== "easy" && level % 3 === 0 && (
                <Typography
                  sx={{ mt: 2, fontFamily: "Fredoka One", color: "#4CAF50" }}
                >
                  Difficulty increased to {difficulty}!
                </Typography>
              )}
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 4, fontFamily: "Fredoka One", textAlign: "center" }}
        >
          Explore Fractions! 🎨
        </Typography>

        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={visualization}
            exclusive
            onChange={handleVisualizationChange}
            aria-label="visualization type"
          >
            <ToggleButton value="bar" aria-label="bar model">
              <LinearScale />
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              <PieChart />
            </ToggleButton>
            <ToggleButton value="number-line" aria-label="number line">
              <Timeline />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={4}>
          {/* First Fraction */}
          <Grid item xs={12} md={6}>
            <motion.div
              animate={isChecking ? { scale: [1, 0.95, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontFamily: "Fredoka One" }}
                >
                  First Fraction: {fraction1.numerator}/{fraction1.denominator}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography>Numerator</Typography>
                  <Slider
                    value={fraction1.numerator}
                    min={1}
                    max={fraction1.denominator}
                    onChange={(_, value) =>
                      setFraction1((prev) => ({ ...prev, numerator: value }))
                    }
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography>Denominator</Typography>
                  <Slider
                    value={fraction1.denominator}
                    min={2}
                    max={12}
                    onChange={(_, value) =>
                      setFraction1((prev) => ({
                        denominator: value,
                        numerator: Math.min(prev.numerator, value),
                      }))
                    }
                  />
                </Box>

                {visualization === "bar" && <BarModel {...fraction1} />}
                {visualization === "pie" && <PieChartModel {...fraction1} />}
              </Paper>
            </motion.div>
          </Grid>

          {/* Second Fraction */}
          <Grid item xs={12} md={6}>
            <motion.div
              animate={isChecking ? { scale: [1, 0.95, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontFamily: "Fredoka One" }}
                >
                  Second Fraction: {fraction2.numerator}/{fraction2.denominator}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography>Numerator</Typography>
                  <Slider
                    value={fraction2.numerator}
                    min={1}
                    max={fraction2.denominator}
                    onChange={(_, value) =>
                      setFraction2((prev) => ({ ...prev, numerator: value }))
                    }
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography>Denominator</Typography>
                  <Slider
                    value={fraction2.denominator}
                    min={2}
                    max={12}
                    onChange={(_, value) =>
                      setFraction2((prev) => ({
                        denominator: value,
                        numerator: Math.min(prev.numerator, value),
                      }))
                    }
                  />
                </Box>

                {/* Only show visualization after checking */}
                {showEquivalence && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {visualization === "bar" && (
                      <BarModel {...fraction2} color="secondary.main" />
                    )}
                    {visualization === "pie" && (
                      <PieChartModel {...fraction2} color="secondary.main" />
                    )}
                  </motion.div>
                )}

                {!showEquivalence && (
                  <Box
                    sx={{
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px dashed",
                      borderColor: "rgba(0,0,0,0.1)",
                      borderRadius: 2,
                      bgcolor: "rgba(0,0,0,0.02)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontFamily: "Fredoka One",
                      }}
                    >
                      Check if Equal to See Visualization
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {visualization === "number-line" && (
          <Box sx={{ mt: 4 }}>
            <NumberLine
              fractions={[fraction1, fraction2]}
              highlightIndex={showEquivalence ? 0 : null}
            />
          </Box>
        )}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          {!showEquivalence ? (
            <Button
              variant="contained"
              size="large"
              onClick={checkEquivalence}
              disabled={isChecking}
              sx={{ fontFamily: "Fredoka One" }}
            >
              {isChecking ? "Checking..." : "Check if Equal"}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={handleNextProblem}
              sx={{
                fontFamily: "Fredoka One",
                bgcolor: "success.main",
                "&:hover": { bgcolor: "success.dark" },
              }}
            >
              Next Problem →
            </Button>
          )}

          {showEquivalence && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Typography
                variant="h5"
                sx={{
                  mt: 3,
                  fontFamily: "Fredoka One",
                  color:
                    fraction1.numerator / fraction1.denominator ===
                    fraction2.numerator / fraction2.denominator
                      ? "success.main"
                      : "error.main",
                }}
              >
                {fraction1.numerator / fraction1.denominator ===
                fraction2.numerator / fraction2.denominator
                  ? "🎉 These fractions are equivalent!"
                  : "🤔 These fractions are different"}
              </Typography>
            </motion.div>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Fractions;
