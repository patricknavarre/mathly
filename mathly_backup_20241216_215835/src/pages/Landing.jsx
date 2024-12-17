import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '90vh' }}>
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            py: { xs: 8, md: 12 },
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h1"
            color="primary"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3,
              fontFamily: 'Fredoka One'
            }}
          >
            Welcome to Mathly! 🚀
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Let's make math fun and exciting!
          </Typography>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/learn')}
            sx={{ 
              py: 2,
              px: 4,
              fontSize: '1.2rem'
            }}
          >
            Start Learning Now! ✨
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 