import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography,
  Divider
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
  Timer
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Learn = () => {
  const navigate = useNavigate();

  const mathCategories = [
    {
      category: "Quick Games",
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
      category: "Division",
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
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            color: 'primary.main',
            fontFamily: 'Fredoka One',
            textAlign: 'center'
          }}
        >
          What Would You Like to Learn? 🎯
        </Typography>

        <Box sx={{ mb: 6 }}>
          {mathCategories.map((category, categoryIndex) => (
            <Box key={category.category} sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  color: 'text.primary',
                  fontFamily: 'Fredoka One',
                  opacity: 0.9
                }}
              >
                {category.category}
              </Typography>
              
              <Grid container spacing={3}>
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
                          background: `linear-gradient(45deg, ${topic.colors[0]}, ${topic.colors[1]})`,
                          color: 'white',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => navigate(topic.path)}
                      >
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
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              
              {categoryIndex < mathCategories.length - 1 && (
                <Divider sx={{ mt: 4 }} />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Learn; 