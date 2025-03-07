import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Link,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Email } from '@mui/icons-material';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
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
          Reset Password
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

        {message && (
          <Alert 
            severity="success" 
            sx={{ 
              width: '100%', 
              mb: 2,
              borderRadius: 2,
              animation: 'fadeIn 0.5s ease-in'
            }}
          >
            {message}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                Sending Reset Link...
              </Box>
            ) : 'Send Reset Link'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="/login"
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
              Remember Password? Login Here
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgetPassword;
