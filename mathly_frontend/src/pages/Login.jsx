import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Rocket, School } from '@mui/icons-material';
import confetti from 'canvas-confetti';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // If there's a success message from signup, trigger confetti
    if (location.state?.message) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement actual login logic
      console.log('Logging in with:', formData);
      // For now, just navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '90vh',
        backgroundColor: 'background.default',
        py: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating background elements */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
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
            {['✨', '🌟', '⭐️', '💫'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper 
            elevation={4}
            sx={{ 
              p: 4, 
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                <School sx={{ fontSize: 60, color: 'primary.main' }} />
              </motion.div>
              <Typography
                variant="h4"
                sx={{ 
                  mt: 2,
                  color: 'primary.main',
                  fontFamily: 'Fredoka One'
                }}
              >
                Welcome Back! 👋
              </Typography>
            </Box>

            <AnimatePresence>
              {location.state?.message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3 }}
                    onClose={() => {
                      navigate('.', { replace: true, state: {} });
                    }}
                  >
                    {location.state.message}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<Rocket />}
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Let's Learn! 🚀
                </Button>
              </Box>
            </form>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Don't have an account yet?
              </Typography>
              <Button
                onClick={() => navigate('/signup')}
                sx={{ mt: 1 }}
              >
                Join the Fun! ✨
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login; 