import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontFamily: 'Fredoka One'
          }}
          onClick={() => navigate('/')}
        >
          Mathly
        </Typography>
        
        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {currentUser.avatar || currentUser.email[0].toUpperCase()}
            </Avatar>
            <Button 
              color="inherit" 
              onClick={() => navigate('/learn')}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Learn
            </Button>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Login
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/signup')}
              sx={{ fontFamily: 'Fredoka One' }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 