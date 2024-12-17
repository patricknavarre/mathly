import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert 
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { School } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/learn');
      }
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
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontFamily: 'Fredoka One'
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
                sx={{ mt: 1, fontFamily: 'Fredoka One' }}
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