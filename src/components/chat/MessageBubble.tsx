'use client';

import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isLoading?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '85%', sm: '75%', md: '70%' },
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          gap: 1.5,
          alignItems: 'flex-start',
        }}
      >
        {/* Avatar */}
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: isUser ? '#6366f1' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {isUser ? (
            <PersonIcon sx={{ fontSize: 18, color: 'white' }} />
          ) : (
            <SmartToyIcon sx={{ fontSize: 18, color: 'white' }} />
          )}
        </Box>

        {/* Message Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              bgcolor: isUser ? '#e0e7ff' : '#f3f4f6',
              borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              p: 2,
            }}
          >
            {message.isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  AI is thinking...
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#1f2937',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                {message.content}
              </Typography>
            )}
          </Box>

          {/* Timestamp */}
          {message.timestamp && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mt: 0.5,
                px: 1,
                color: '#9ca3af',
                fontSize: '0.75rem',
                textAlign: isUser ? 'right' : 'left',
              }}
            >
              {formatTime(message.timestamp)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
