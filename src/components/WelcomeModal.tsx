'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface WelcomeModalProps {
  onUserRegistered: (userId: string, userName: string) => void;
}

export default function WelcomeModal({ onUserRegistered }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already registered
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (!userId || !userName) {
      // User not registered - show modal
      setIsOpen(true);
    } else {
      // User already registered - notify parent
      onUserRegistered(userId, userName);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (name.trim() === '') {
      setError('Please enter your name');
      return;
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/users/register', {
        name: name.trim(),
      });

      if (response.data.success) {
        const { userId, userName } = response.data;
        
        // Save to localStorage
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        
        // Trigger navbar update (custom event for same-tab)
        window.dispatchEvent(new Event('userLoggedIn'));
        
        // Notify parent component
        onUserRegistered(userId, userName);
        
        // Close modal
        setIsOpen(false);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        }
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1f2937' }}>
            Welcome to QuizMind! 🎓
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Let's get started by knowing your name
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Your Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            autoFocus
            placeholder="Enter your name"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
              '&:disabled': {
                background: '#d1d5db',
              }
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <span>Creating account...</span>
              </Box>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: '#9ca3af' }}>
          Your data is stored securely and used only for tracking your learning progress
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
