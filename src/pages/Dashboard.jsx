import { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Avatar,
  LinearProgress,
  Button,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  EmojiEvents, 
  Stars, 
  Psychology,
  Speed,
  School,
  Timeline,
  Calculate
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock user data - will be replaced with real data from context/API
  const user = {
    username: "Math Wizard",
    avatar: "🦄",
    grade: 4,
    level: 5,
    xp: 750,
    streak: 7,
    achievements: [
      { id: 1, title: "First Victory", description: "Completed your first problem!", icon: "🎯" },
      { id: 2, title: "Speed Demon", description: "Solved 5 problems in under 2 minutes!", icon: "⚡" },
      { id: 3, title: "Perfect Score", description: "Got all answers correct!", icon: "🌟" }
    ],
    recentGames: [
      { type: "Long Division", score: 500, date: new Date() },
      { type: "Multiplication", score: 750, date: new Date() }
    ]
  };

  const challenges = [
    {
      title: "Long Division",
      description: "Master the art of division",
      icon: <School />,
      path: "/learn/division/long"
    },
    {
      title: "Multiplication Practice",
      description: "Practice multiplication with numbers up to 4 digits",
      icon: <Calculate />,
      path: "/learn/multiplication"
    },
    {
      title: "Speed Math",
      description: "Test your quick thinking",
      icon: <Speed />,
      path: "/learn/speed-math"
    },
    {
      title: "Brain Teasers",
      description: "Challenge your mind with word problems",
      icon: <Psychology />,
      path: "/learn/brain-teasers"
    }
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* User Profile Card */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      fontSize: '3rem',
                      margin: '0 auto 1rem',
                      backgroundColor: 'primary.light'
                    }}
                  >
                    {user.avatar}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontFamily: 'Fredoka One' }}>
                    {user.username}
                  </Typography>
                  <Typography color="text.secondary">
                    Grade {user.grade}
                  </Typography>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Level Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={(user.xp % 1000) / 10}
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        backgroundColor: 'rgba(255,107,107,0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main',
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Level {user.level} • {user.xp % 1000}/1000 XP
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Chip
                      icon={<Stars />}
                      label={`${user.streak} Day Streak! 🔥`}
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Game Categories */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Fredoka One' }}>
              Choose Your Challenge! 🎮
            </Typography>
            <Grid container spacing={2}>
              {challenges.map((challenge, index) => (
                <Grid item xs={12} sm={6} key={challenge.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                      onClick={() => navigate(challenge.path)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {challenge.icon}
                        <Typography
                          variant="h6"
                          sx={{ ml: 2, fontFamily: 'Fredoka One' }}
                        >
                          {challenge.title}
                        </Typography>
                      </Box>
                      <Typography color="text.secondary">
                        {challenge.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Achievements */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontFamily: 'Fredoka One' }}>
                Your Achievements 🏆
              </Typography>
              <Grid container spacing={2}>
                {user.achievements.map((achievement, index) => (
                  <Grid item xs={12} sm={4} key={achievement.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        <Typography fontSize="2rem">{achievement.icon}</Typography>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {achievement.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 