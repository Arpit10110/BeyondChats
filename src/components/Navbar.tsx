'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from 'next/navigation';

interface NavLink {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiresAuth?: boolean;
}

const allNavLinks: NavLink[] = [
  { title: 'Home', path: '/', icon: <HomeIcon /> },
  { title: 'Quizzes', path: '/quizzes', icon: <QuizIcon /> },
  { title: 'Progress', path: '/progress', icon: <TrendingUpIcon /> },
  { title: 'Chat', path: '/chat', icon: <ChatIcon /> },
  { title: 'LogOut', path: '/profile', icon: <LogoutIcon />, requiresAuth: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  
  const isChatPage = pathname?.startsWith('/chat');

  const updateNavLinks = () => {
    const userId = localStorage.getItem('userId');
    const loggedIn = !!userId;

    if (loggedIn) {
      setNavLinks(allNavLinks);
    } else {
      setNavLinks(allNavLinks.filter(link => !link.requiresAuth));
    }
  };

  useEffect(() => {
    updateNavLinks();

    const handleStorageChange = () => {
      updateNavLinks();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLoggedIn', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleStorageChange);
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        width: 250,
        height: '100%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {navLinks.map((link) => (
          <ListItem key={link.title} disablePadding>
            <ListItemButton
              component={Link}
              href={link.path}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {link.icon}
                <ListItemText primary={link.title} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <style jsx global>{`
        @media (max-width: 768px) {
          .navbar-hide-on-chat {
            display: ${isChatPage ? 'none' : 'block'} !important;
          }
        }
      `}</style>

      <AppBar
        position="sticky"
        elevation={0}
        className="navbar-hide-on-chat"
        sx={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span style={{ fontSize: '28px' }}>📚</span>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  QuizMind
                </span>
              </Box>
            </Link>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.path}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2.5,
                      py: 1,
                      borderRadius: '12px',
                      color: '#4b5563',
                      fontWeight: 500,
                      fontSize: '15px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        color: '#6366f1',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </Box>
                </Link>
              ))}
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: 'none' },
                color: '#6366f1',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
