import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Add as AddIcon,
  Remove as SubtractIcon,
  Close as MultiplyIcon,
  Functions as DivideIcon,
  Speed,
  EmojiEvents,
  Psychology,
  Timer,
  Star,
  TrendingUp,
  Whatshot,
  EmojiObjects
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ icon: Icon, title, value, trend, color }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 4,
      background: `linear-gradient(135deg, ${color}20, ${color}10)`,
      border: '1px solid',
      borderColor: `${color}30`,
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Icon sx={{ color: color, fontSize: 24 }} />
        <Typography sx={{ color: 'text.secondary', fontFamily: 'Fredoka One' }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontFamily: 'Fredoka One', color: 'text.primary' }}>
        {value}
      </Typography>
      {trend && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <TrendingUp sx={{ color: '#4caf50', fontSize: 16 }} />
          <Typography variant="body2" sx={{ color: '#4caf50', fontFamily: 'Fredoka One' }}>
            {trend}
          </Typography>
        </Box>
      )}
    </Box>
    <Box
      sx={{
        position: 'absolute',
        right: -20,
        bottom: -20,
        opacity: 0.1,
      }}
    >
      <Icon sx={{ fontSize: 100, color: color }} />
    </Box>
  </Paper>
);

const CategoryHeader = ({ title, icon: Icon, description }) => {
  const IconComponent = Icon?.type || Icon || Psychology;
  
  return (
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Paper
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
        }}
      >
        <IconComponent sx={{ fontSize: 30, color: 'white' }} />
      </Paper>
      <Box>
        <Typography variant="h4" sx={{ fontFamily: 'Fredoka One', color: 'text.primary' }}>
          {title}
        </Typography>
        {description && (
          <Typography sx={{ color: 'text.secondary', fontFamily: 'Fredoka One' }}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const UserAvatar = ({ level, xp, streak }) => {
  return (
    <Box sx={{ 
      textAlign: 'center',
      mb: 6,
      position: 'relative'
    }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          bgcolor: '#FF8E8E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          mb: 2,
          fontSize: '3rem'
        }}
      >
        🦄
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontFamily: 'Fredoka One',
          color: 'text.primary',
          mb: 1
        }}
      >
        Math Wizard
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 2,
          fontFamily: 'Fredoka One'
        }}
      >
        Grade {level}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 1,
          fontFamily: 'Fredoka One'
        }}
      >
        Level Progress
      </Typography>

      <Box sx={{ 
        width: '100%', 
        height: 8, 
        bgcolor: 'rgba(255,99,99,0.2)', 
        borderRadius: 4,
        mb: 2,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${(xp % 1000) / 10}%`,
          bgcolor: '#FF6363',
          borderRadius: 4
        }} />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontFamily: 'Fredoka One'
        }}
      >
        Level {Math.floor(xp / 1000) + 1} • {xp % 1000}/1000 XP
      </Typography>

      {streak > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: 'black',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Star sx={{ color: '#FFD700' }} />
          <Typography sx={{ fontFamily: 'Fredoka One' }}>
            {streak} Day Streak! 🔥
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

const Learn = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Whatshot,
      title: 'Current Streak',
      value: '7 Days',
      trend: '+2 from last week',
      color: '#f44336'
    },
    {
      icon: EmojiEvents,
      title: 'Total Score',
      value: '2,450',
      trend: '+350 today',
      color: '#ff9800'
    },
    {
      icon: EmojiObjects,
      title: 'Problems Solved',
      value: '142',
      trend: '+15 today',
      color: '#2196f3'
    }
  ];

  const mathCategories = [
    {
      category: "Quick Games",
      icon: Speed,
      topics: [
        {
          title: "Speed Math",
          description: "Test your math skills against the clock!",
          icon: <Speed sx={{ fontSize: 40 }} />,
          path: "/learn/speed-math",
          colors: ['#4CAF50', '#81C784'],
          level: "All Grades"
        }
      ]
    },
    {
      category: "Brain Teasers",
      icon: Psychology,
      topics: [
        {
          title: "Word Problems",
          description: "Challenge your problem-solving skills with engaging word problems!",
          icon: <Psychology sx={{ fontSize: 40 }} />,
          path: "/learn/brain-teasers",
          colors: ['#9C27B0', '#BA68C8'],
          level: "All Grades"
        }
      ]
    },
    {
      category: "Division",
      icon: DivideIcon,
      topics: [
        {
          title: "Long Division",
          description: "Master 4-digit division step by step",
          icon: <DivideIcon sx={{ fontSize: 40 }} />,
          path: "/learn/division/long",
          colors: ['#FFD93D', '#FFE074'],
          level: "Grade 4-5"
        }
      ]
    },
    {
      category: "Multiplication",
      icon: MultiplyIcon,
      topics: [
        {
          title: "Multiplication Practice",
          description: "Practice multiplication with numbers up to 4 digits",
          icon: <MultiplyIcon sx={{ fontSize: 40 }} />,
          path: "/learn/multiplication",
          colors: ['#FF6B6B', '#FF8E8E'],
          level: "Grade 3-4"
        }
      ]
    }
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '90vh', py: 4 }}>
      <Container maxWidth="lg">
        <UserAvatar level={4} xp={750} streak={7} />

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 6 }}>
          {mathCategories.map((category, categoryIndex) => (
            <Box key={category.category} sx={{ mb: 8 }}>
              <CategoryHeader 
                title={category.category}
                icon={category.icon}
                description="Master new skills and challenge yourself!"
              />
              
              <Grid container spacing={4}>
                {category.topics.map((topic, topicIndex) => (
                  <Grid item xs={12} md={6} key={topic.title}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: topicIndex * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 3,
                          cursor: 'pointer',
                          background: `linear-gradient(135deg, ${topic.colors[0]}, ${topic.colors[1]})`,
                          color: 'white',
                          transition: 'all 0.3s ease',
                          borderRadius: 4,
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => navigate(topic.path)}
                      >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {topic.icon}
                            <Typography
                              variant="h5"
                              sx={{
                                ml: 2,
                                fontFamily: 'Fredoka One'
                              }}
                            >
                              {topic.title}
                            </Typography>
                          </Box>
                          <Typography sx={{ mb: 2, opacity: 0.9 }}>
                            {topic.description}
                          </Typography>
                          <Typography
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              bgcolor: 'rgba(255,255,255,0.2)',
                              borderRadius: 2,
                              fontSize: '0.9rem'
                            }}
                          >
                            {topic.level}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            right: -20,
                            bottom: -20,
                            opacity: 0.1,
                          }}
                        >
                          {React.cloneElement(topic.icon, { sx: { fontSize: 100 } })}
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              
              {categoryIndex < mathCategories.length - 1 && (
                <Divider sx={{ mt: 6 }} />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Learn; 