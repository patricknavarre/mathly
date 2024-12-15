import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Playful coral
      light: '#FF8E8E',
      dark: '#FF4848',
    },
    secondary: {
      main: '#4ECDC4', // Mint green
      light: '#71D7D0',
      dark: '#3DBEB6',
    },
    success: {
      main: '#96F550', // Lime green
      light: '#ABF773',
      dark: '#82D943',
    },
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    },
    game: {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
    },
  },
  typography: {
    fontFamily: '"Fredoka One", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    },
    gameScore: {
      fontFamily: '"Press Start 2P", cursive',
      fontSize: '2rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontSize: '1.1rem',
          padding: '12px 24px',
          fontWeight: 600,
        },
      },
      variants: [
        {
          props: { variant: 'game' },
          style: {
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E8E 90%)',
            color: 'white',
            boxShadow: '0 3px 10px rgba(255, 107, 107, 0.3)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 15px rgba(255, 107, 107, 0.4)',
            },
          },
        },
      ],
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: 'game-card' },
          style: {
            borderRadius: 16,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
            },
          },
        },
      ],
    },
  },
}); 