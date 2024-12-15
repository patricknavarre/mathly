import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import fonts
import '@fontsource/fredoka-one';
import '@fontsource/press-start-2p';

// Create a fun, kid-friendly theme
const theme = createTheme({
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
    background: {
      default: '#F7F9FC',
      paper: '#FFFFFF',
    }
  },
  typography: {
    fontFamily: '"Fredoka One", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontSize: '1.1rem',
          padding: '12px 24px',
        },
      },
    },
  },
});

// Add these imports at the top
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import LongDivision from './components/games/LongDivision';
import MultiplicationPractice from './components/games/MultiplicationPractice';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/division/long" element={<LongDivision />} />
          <Route path="/learn/multiplication" element={<MultiplicationPractice />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
