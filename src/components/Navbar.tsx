'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname, useRouter } from 'next/navigation';

interface NavLink {
  title: string;
  path?: string;
  icon: React.ReactElement;
  requiresAuth?: boolean;
  onClick?: () => void;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  
  const isChatPage = pathname?.startsWith('/chat');

  const handleLogout = () => {
    // Clear ALL auth data
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    
    // Trigger storage event
    window.dispatchEvent(new Event('storage'));
    
    // Redirect and reload
    router.push('/');
    window.location.reload();
  };
  

  const allNavLinks: NavLink[] = [
    { title: 'Home', path: '/', icon: <HomeIcon /> },
    { title: 'Quizzes', path: '/quizzes', icon: <QuizIcon /> },
    { title: 'Progress', path: '/progress', icon: <TrendingUpIcon /> },
    { title: 'Chat', path: '/chat', icon: <ChatIcon /> },
    { title: 'Logout', icon: <LogoutIcon />, requiresAuth: true, onClick: handleLogout },
  ];

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
            {link.onClick ? (
              <ListItemButton
                onClick={() => {
                  link.onClick!();
                  handleDrawerToggle();
                }}
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
            ) : (
              <ListItemButton
                component={Link}
                href={link.path!}
                onClick={handleDrawerToggle}
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
            )}
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
                link.onClick ? (
                  <Box
                    key={link.title}
                    onClick={link.onClick}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2.5,
                      py: 1,
                      borderRadius: '12px',
                      color: '#ef4444',
                      fontWeight: 500,
                      fontSize: '15px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(239, 68, 68, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </Box>
                ) : (
                  <Link
                    key={link.title}
                    href={link.path!}
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
                )
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
