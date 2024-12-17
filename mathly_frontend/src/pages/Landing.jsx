import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '90vh',
        backgroundColor: 'background.default',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating background elements */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            {['✨', '🌟', '⭐️', '💫', '🔢', '➗', '✖️', '➕'][Math.floor(Math.random() * 8)]}
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h1" 
                sx={{ 
                  mb: 2,
                  fontFamily: 'Fredoka One',
                  color: 'primary.main',
                  fontSize: { xs: '3rem', md: '4rem' }
                }}
              >
                Make Math Fun! 🚀
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4,
                  color: 'text.secondary',
                  fontFamily: 'Fredoka One'
                }}
              >
                Interactive games and challenges to boost your math skills
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{ 
                  mr: 2,
                  py: 2,
                  px: 4,
                  fontFamily: 'Fredoka One'
                }}
              >
                Start Learning! 🎯
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ 
                  py: 2,
                  px: 4,
                  fontFamily: 'Fredoka One'
                }}
              >
                Login
              </Button>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Add illustration or screenshot here */}
              <Box 
                sx={{ 
                  width: '100%',
                  height: '400px',
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8rem'
                }}
              >
                🧮
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Landing; 