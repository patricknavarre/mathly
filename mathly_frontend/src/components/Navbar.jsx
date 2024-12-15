import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            sx={{ 
              flexGrow: 1, 
              fontFamily: 'Fredoka One',
              fontSize: '1.8rem',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s'
              }
            }}
            onClick={() => navigate('/')}
          >
            Mathly
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit"
              sx={{ 
                fontWeight: 600,
                color: 'text.secondary'
              }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="contained" 
              color="secondary"
              sx={{ 
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s'
                }
              }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 