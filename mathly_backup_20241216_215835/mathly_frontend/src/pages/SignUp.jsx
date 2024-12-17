import { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Stepper,
  Step,
  StepLabel,
  Avatar
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, School, EmojiEvents } from '@mui/icons-material';

const avatarChoices = ['🦁', '🐯', '🦊', '🐼', '🐨', '🐸', '🦄', '🐙', '🦋', '🐬'];

const SignUp = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    grade: 4,
    avatar: '🦁'
  });

  const steps = [
    {
      label: 'Create Account',
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Box>
        </motion.div>
      )
    },
    {
      label: 'Choose Grade',
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              What grade are you in?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              {[3, 4, 5, 6, 7, 8].map((grade) => (
                <motion.div
                  key={grade}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={formData.grade === grade ? "contained" : "outlined"}
                    onClick={() => setFormData({ ...formData, grade })}
                    sx={{ 
                      width: 60, 
                      height: 60,
                      borderRadius: '50%',
                      fontSize: '1.2rem'
                    }}
                  >
                    {grade}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )
    },
    {
      label: 'Pick Avatar',
      content: (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{ 
                width: 100,
                height: 100,
                fontSize: '3rem',
                margin: '0 auto 2rem',
                backgroundColor: 'primary.light'
              }}
            >
              {formData.avatar}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Choose your avatar!
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 2,
              mt: 4
            }}>
              {avatarChoices.map((avatar) => (
                <motion.div
                  key={avatar}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={formData.avatar === avatar ? "contained" : "outlined"}
                    onClick={() => setFormData({ ...formData, avatar })}
                    sx={{ 
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      fontSize: '1.5rem'
                    }}
                  >
                    {avatar}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )
    }
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit form and navigate to login
      console.log('Form submitted:', formData);
      navigate('/login', { 
        state: { 
          message: "🎉 Account created! Let's login and start learning!" 
        }
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '90vh',
        backgroundColor: 'background.default',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography
              variant="h4"
              align="center"
              sx={{ 
                mb: 4,
                color: 'primary.main',
                fontFamily: 'Fredoka One'
              }}
            >
              Join the Fun! ✨
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              {steps[activeStep].content}
            </AnimatePresence>

            <Box sx={{ 
              mt: 4,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                variant="contained"
                endIcon={activeStep === steps.length - 1 ? <Rocket /> : null}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Start Learning!' : 'Next'}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignUp; 