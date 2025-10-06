'use client';

import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import WelcomeModal from '@/components/WelcomeModal';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const handleUserRegistered = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    
    // Force navbar to re-render by triggering a window event
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      <WelcomeModal onUserRegistered={handleUserRegistered} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {userId && (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1f2937' }}>
              Welcome back, {userName}! 👋
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Ready to start learning?
            </Typography>
          </Box>
        )}

        {/* Your main content will go here */}
      </Container>
    </>
  );
}
