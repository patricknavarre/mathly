import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { School, EmojiEvents, Timeline, Speed } from "@mui/icons-material";
import confetti from "canvas-confetti";

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: 4,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-10px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {icon}
          <Typography
            variant="h6"
            sx={{ fontFamily: "Fredoka One", textAlign: "center" }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            {description}
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

const FloatingElement = ({ emoji, delay, top, left }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        fontSize: "2rem",
        zIndex: -1,
        top: `${top}%`,
        left: `${left}%`,
        opacity: 0.5,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {emoji}
    </motion.div>
  );
};

const Landing = () => {
  const theme = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showConfetti) {
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

      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  const features = [
    {
      icon: <School sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Interactive Learning",
      description:
        "Engaging games and activities that make learning math fun and memorable",
      delay: 0.2,
    },
    {
      icon: (
        <EmojiEvents
          sx={{ fontSize: 40, color: theme.palette.secondary.main }}
        />
      ),
      title: "Track Progress",
      description:
        "Earn points, unlock achievements, and watch your skills grow",
      delay: 0.4,
    },
    {
      icon: (
        <Timeline sx={{ fontSize: 40, color: theme.palette.success.main }} />
      ),
      title: "Visual Math",
      description:
        "See math concepts come to life with beautiful visualizations",
      delay: 0.6,
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.error.main }} />,
      title: "Speed Challenges",
      description:
        "Test your skills with exciting timed challenges and competitions",
      delay: 0.8,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Floating Elements */}
      <FloatingElement emoji="🚀" delay={0} top={10} left={5} />
      <FloatingElement emoji="⭐" delay={0.5} top={15} left={80} />
      <FloatingElement emoji="🎯" delay={1} top={40} left={8} />
      <FloatingElement emoji="🎨" delay={1.5} top={35} left={92} />
      <FloatingElement emoji="🎮" delay={2} top={60} left={85} />
      <FloatingElement emoji="➕" delay={2.5} top={75} left={15} />
      <FloatingElement emoji="✖️" delay={3} top={25} left={95} />
      <FloatingElement emoji="🔢" delay={3.5} top={85} left={90} />
      <FloatingElement emoji="🎲" delay={4} top={50} left={3} />
      <FloatingElement emoji="🧮" delay={4.5} top={20} left={40} />

      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            align="center"
            sx={{
              mb: 2,
              fontFamily: "Fredoka One",
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
            }}
          >
            Make Math Fun!
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: "800px", mx: "auto" }}
          >
            Interactive games and challenges to boost your math skills while
            having a blast! Perfect for students of all ages.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 2,
              fontSize: "1.25rem",
              fontFamily: "Fredoka One",
              borderRadius: "50px",
              background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
              boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 10px 4px rgba(255, 105, 135, .3)",
              },
            }}
          >
            Start Learning! 🚀
          </Button>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Box
            sx={{
              mt: 8,
              p: 4,
              borderRadius: 4,
              background:
                "linear-gradient(145deg, rgba(255,107,107,0.1) 0%, rgba(78,205,196,0.1) 100%)",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontFamily: "Fredoka One" }}>
              Ready to Begin? 🎯
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Start your journey to math mastery today!
            </Typography>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                fontFamily: "Fredoka One",
                borderRadius: "50px",
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Login to Continue
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Landing;
