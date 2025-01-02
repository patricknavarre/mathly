import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Speed,
  Psychology,
  Functions as DivideIcon,
  Close as MultiplyIcon,
  ArrowForward,
  Add,
  Remove,
  PieChart,
  Functions,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CategoryCard = ({ topic, delay }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay * 0.1,
        duration: 0.5,
        ease: [0.23, 0.01, 0.32, 1],
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          cursor: "pointer",
          background: `linear-gradient(135deg, ${topic.colors[0]}, ${topic.colors[1]})`,
          color: "white",
          borderRadius: "24px",
          transition: "all 0.4s cubic-bezier(0.23, 0.01, 0.32, 1)",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 20px 60px ${topic.colors[1]}40`,
            "& .arrow-icon": {
              transform: "translateX(4px)",
              opacity: 1,
            },
            "& .hover-overlay": {
              opacity: 1,
            },
            "& .icon-container": {
              transform: "scale(1.1) rotate(5deg)",
            },
          },
        }}
        onClick={() => navigate(topic.path)}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background: `
              radial-gradient(circle at 0% 0%, transparent 50%, ${topic.colors[1]} 100%),
              linear-gradient(45deg, ${topic.colors[0]}20 25%, transparent 25%, transparent 75%, ${topic.colors[1]}20 75%),
              linear-gradient(-45deg, ${topic.colors[0]}20 25%, transparent 25%, transparent 75%, ${topic.colors[1]}20 75%)
            `,
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
            zIndex: 0,
          }}
        />

        {/* Hover Overlay */}
        <Box
          className="hover-overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0,
            background: "rgba(255,255,255,0.1)",
            transition: "opacity 0.4s ease",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              className="icon-container"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                p: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "transform 0.3s ease",
                backdropFilter: "blur(4px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              }}
            >
              {topic.icon}
            </Box>
            <Typography
              variant="h5"
              sx={{
                ml: 2,
                fontFamily: "Fredoka One",
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "1.5rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {topic.title}
              <ArrowForward
                className="arrow-icon"
                sx={{
                  fontSize: 24,
                  opacity: 0,
                  transition: "all 0.3s ease",
                  transform: "translateX(-8px)",
                }}
              />
            </Typography>
          </Box>
          <Typography
            sx={{
              mb: 3,
              opacity: 0.95,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {topic.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              sx={{
                display: "inline-flex",
                px: 2.5,
                py: 0.75,
                bgcolor: "rgba(255,255,255,0.2)",
                borderRadius: "20px",
                fontSize: "0.95rem",
                fontWeight: 600,
                backdropFilter: "blur(4px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {topic.level}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

const Learn = () => {
  const theme = useTheme();

  const mathCategories = [
    {
      category: "Interactive Games",
      topics: [
        {
          title: "Word Problems",
          description:
            "Challenge your problem-solving skills with engaging word problems that make math fun and practical!",
          icon: <Psychology sx={{ fontSize: 40 }} />,
          path: "/learn/brain-teasers",
          colors: ["#9C27B0", "#6A1B9A"],
          level: "All Grades",
        },
        {
          title: "Speed Math",
          description:
            "Test your math skills against the clock! Race against time while solving fun math problems.",
          icon: <Speed sx={{ fontSize: 40 }} />,
          path: "/learn/speed-math",
          colors: ["#4CAF50", "#2E7D32"],
          level: "All Grades",
        },
      ],
    },
    {
      category: "Division",
      topics: [
        {
          title: "Long Division",
          description:
            "Master 4-digit division step by step with our interactive learning experience. Break down complex problems into simple steps!",
          icon: <DivideIcon sx={{ fontSize: 40 }} />,
          path: "/learn/division/long",
          colors: ["#FFB300", "#FF8F00"],
          level: "Grade 4-5",
        },
      ],
    },
    {
      category: "Multiplication",
      topics: [
        {
          title: "Multiplication Practice",
          description:
            "Practice multiplication with numbers up to 4 digits. Build confidence with progressive difficulty levels!",
          icon: <MultiplyIcon sx={{ fontSize: 40 }} />,
          path: "/learn/multiplication",
          colors: ["#FF5252", "#D32F2F"],
          level: "Grade 3-4",
        },
      ],
    },
    {
      category: "Fractions",
      topics: [
        {
          title: "Fraction Explorer",
          description:
            "Visualize and compare fractions using interactive bar models, pie charts, and number lines!",
          icon: <PieChart sx={{ fontSize: 40 }} />,
          path: "/learn/fractions",
          colors: ["#2196F3", "#1976D2"],
          level: "Grade 3-4",
        },
        {
          title: "Fraction Operations",
          description:
            "Practice adding and subtracting fractions with step-by-step visual guidance!",
          icon: <Add sx={{ fontSize: 40 }} />,
          path: "/learn/fraction-operations",
          colors: ["#00BCD4", "#0097A7"],
          level: "Grade 4-5",
        },
      ],
    },
    {
      category: "Number Theory",
      topics: [
        {
          title: "Factor Fun",
          description:
            "Discover factors through interactive games and challenges. Learn to find all factors of a number!",
          icon: <Functions sx={{ fontSize: 40 }} />,
          path: "/learn/factors",
          colors: ["#9575CD", "#5E35B1"],
          level: "Grade 4-6",
        },
      ],
    },
    {
      category: "Elementary",
      topics: [
        {
          title: "Visual Addition",
          description:
            "Learn addition with fun animations! Count animals, blocks, and other cool objects.",
          icon: <Add sx={{ fontSize: 40 }} />,
          path: "/learn/elementary/addition",
          colors: ["#FF9800", "#F57C00"],
          level: "Grade 1-2",
        },
        {
          title: "Visual Subtraction",
          description:
            "Master subtraction by playing with animated objects. Watch them disappear like magic!",
          icon: <Remove sx={{ fontSize: 40 }} />,
          path: "/learn/elementary/subtraction",
          colors: ["#9C27B0", "#7B1FA2"],
          level: "Grade 1-2",
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 1,
            fontFamily: "Fredoka One",
            background: "linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
          }}
        >
          What Would You Like to Learn?
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "800px", mx: "auto" }}
        >
          Choose your adventure and start learning! 🎯
        </Typography>
      </motion.div>

      {mathCategories.map((category, categoryIndex) => (
        <Box key={category.category} sx={{ mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontFamily: "Fredoka One",
                color: "text.primary",
                opacity: 0.9,
              }}
            >
              {category.category}
            </Typography>
          </motion.div>
          <Grid container spacing={3}>
            {category.topics.map((topic, topicIndex) => (
              <Grid item xs={12} md={6} key={topic.title}>
                <CategoryCard
                  topic={topic}
                  delay={categoryIndex * 4 + topicIndex}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  );
};

export default Learn;
