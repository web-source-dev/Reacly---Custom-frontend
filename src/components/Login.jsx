import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock 
} from '@mui/icons-material';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userEmail',response.data.email)
      
      // Redirect based on user role
      switch(response.data.role) {
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'vendor':
          navigate('/vendor-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'var(--background-color)',
          padding: 4,
          borderRadius: 3,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            color: 'var(--text-color)',
            fontWeight: 600,
            mb: 3,
            background: 'linear-gradient(45deg, #4998F8 30%, #3878c8 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome Back
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '100%', 
              mb: 2,
              borderRadius: 2,
              animation: 'fadeIn 0.5s ease-in'
            }}
          >
            {error}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            mt: 1, 
            width: '100%',
            '& .MuiTextField-root': { mb: 2 }
          }}
        >
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: 'var(--text-color)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                  transition: 'border-color 0.2s ease-in-out',
                },
                '&:hover fieldset': {
                  borderColor: '#4998F8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4998F8',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-color)',
              },
              '& .MuiOutlinedInput-input': {
                color: 'var(--text-color)',
              },
            }}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: 'var(--text-color)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'var(--text-color)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                  transition: 'border-color 0.2s ease-in-out',
                },
                '&:hover fieldset': {
                  borderColor: '#4998F8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4998F8',
                  borderWidth: '2px',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'var(--text-color)',
              },
              '& .MuiOutlinedInput-input': {
                color: 'var(--text-color)',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 3,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #4998F8 30%, #3878c8 90%)',
              boxShadow: '0 3px 5px 2px rgba(73, 152, 248, .3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 4px rgba(73, 152, 248, .3)',
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Signing in...
              </Box>
            ) : 'Sign In'}
          </Button>
          <Box 
            sx={{ 
              textAlign: 'center', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5 
            }}
          >
            <Link
              href="/signup"
              variant="body2"
              sx={{
                color: "#4998F8",
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: "#3878c8"
                }
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
            <Link
              href="/forgot-password"
              variant="body2"
              sx={{
                color: "#4998F8",
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s ease-in-out',
                '&:hover': {
                  color: "#3878c8"
                }
              }}
            >
              {"Forgot password?"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
