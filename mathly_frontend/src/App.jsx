import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';

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
    fontFamily: '"Fredoka One", "Press Start 2P", "Roboto", sans-serif',
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
import Learn from './pages/Learn';
import LongDivision from './components/games/LongDivision';
import MultiplicationPractice from './components/games/MultiplicationPractice';
import SpeedMath from './components/games/SpeedMath';
import BrainTeasers from './components/games/BrainTeasers';

// Add ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Add AuthRoute component to redirect logged-in users away from auth pages
const AuthRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/learn" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            } />
            <Route path="/learn" element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            } />
            <Route path="/learn/multiplication" element={
              <ProtectedRoute>
                <MultiplicationPractice />
              </ProtectedRoute>
            } />
            <Route path="/learn/division/long" element={
              <ProtectedRoute>
                <LongDivision />
              </ProtectedRoute>
            } />
            <Route path="/learn/brain-teasers" element={
              <ProtectedRoute>
                <BrainTeasers />
              </ProtectedRoute>
            } />
            <Route path="/learn/speed-math" element={
              <ProtectedRoute>
                <SpeedMath />
              </ProtectedRoute>
            } />
            {/* Catch all route - redirect to learn page if logged in, otherwise to landing */}
            <Route path="*" element={
              <ProtectedRoute>
                <Navigate to="/learn" replace />
              </ProtectedRoute>
            } />
          </Routes>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
