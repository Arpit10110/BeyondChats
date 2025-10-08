'use client';

import React, { useState } from 'react';
import { Box, Drawer, IconButton, useMediaQuery, useTheme, AppBar, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useRouter } from 'next/navigation';

interface ChatLayoutProps {
  sessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export default function ChatLayout({ sessionId, onSessionChange }: ChatLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0 }}>
      {/* Custom Top Navigation Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: '#1f2937',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          {/* Left: Hamburger (mobile) + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Hamburger Menu - Always visible on mobile */}
            {isMobile && (
              <IconButton 
                onClick={handleDrawerToggle} 
                sx={{ 
                  color: '#1f2937',
                  mr: 1,
                  '&:hover': { bgcolor: '#f3f4f6' }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Box 
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} 
              onClick={() => router.push('/')}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#6366f1',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                QuizMind
              </Typography>
            </Box>
          </Box>

          {/* Right: Navigation Links (desktop only) */}
          {isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={() => router.push('/')} 
                sx={{ color: '#6b7280', '&:hover': { bgcolor: '#f3f4f6' } }}
              >
                <HomeIcon />
              </IconButton>
              <IconButton 
                onClick={() => router.push('/quizzes')} 
                sx={{ color: '#6b7280', '&:hover': { bgcolor: '#f3f4f6' } }}
              >
                <QuizIcon />
              </IconButton>
              <IconButton 
                onClick={() => router.push('/progress')} 
                sx={{ color: '#6b7280', '&:hover': { bgcolor: '#f3f4f6' } }}
              >
                <TrendingUpIcon />
              </IconButton>
              <IconButton 
                sx={{ color: '#6366f1', bgcolor: '#e0e7ff', '&:hover': { bgcolor: '#c7d2fe' } }}
              >
                <ChatIcon />
              </IconButton>
              <IconButton 
                onClick={() => router.push('/profile')} 
                sx={{ color: '#6b7280', '&:hover': { bgcolor: '#f3f4f6' } }}
              >
                <PersonIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flexGrow: 1, mt: '3rem', height: 'calc(100vh - 64px)', width: '100%' }}>
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Box sx={{ 
            width: 280, 
            flexShrink: 0, 
            borderRight: '1px solid #e5e7eb', 
            height: '100%', 
            overflow: 'hidden',
            bgcolor: '#f9fafb'
          }}>
            <ChatSidebar 
              currentSessionId={sessionId} 
              onSessionChange={onSessionChange}
            />
          </Box>
        )}

        {/* Sidebar - Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280,
              bgcolor: '#f9fafb',
              mt: '64px',
              height: 'calc(100vh - 64px)',
              boxSizing: 'border-box'
            },
          }}
        >
          <ChatSidebar 
            currentSessionId={sessionId} 
            onSessionChange={(id) => {
              onSessionChange(id);
              setMobileOpen(false);
            }}
          />
        </Drawer>

        {/* Main Chat Area */}
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          overflow: 'hidden',
          bgcolor: 'white',
          width: { xs: '100%', md: 'calc(100% - 280px)' }
        }}>
          <ChatWindow sessionId={sessionId} />
        </Box>
      </Box>
    </Box>
  );
}
