'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

export default function EmptyState() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        p: 4,
      }}
    >
      <ChatIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937', mb: 1 }}>
        Start a Conversation
      </Typography>
      <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 400 }}>
        Ask me anything! You can also attach a PDF to get specific answers with citations.
      </Typography>
    </Box>
  );
}
