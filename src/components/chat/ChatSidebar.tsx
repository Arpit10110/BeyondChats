'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, List, ListItem, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Session {
  _id: string;
  title: string;
  lastMessageAt: string;
}

interface ChatSidebarProps {
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export default function ChatSidebar({ currentSessionId, onSessionChange }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const res = await axios.get(`/api/chat/sessions?userId=${userId}`);
      setSessions(res.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please login first');
        router.push('/');
        return;
      }

      const res = await axios.post('/api/chat/sessions', { userId });
      const newSessionId = res.data.session._id;
      
      setSessions([res.data.session, ...sessions]);
      router.push(`/chat/${newSessionId}`);
      onSessionChange(newSessionId);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create new chat');
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Delete this chat?')) return;

    try {
      await axios.delete(`/api/chat/sessions?sessionId=${sessionId}`);
      setSessions(sessions.filter(s => s._id !== sessionId));
      
      if (currentSessionId === sessionId) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete chat');
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) return 'Today';
    if (hours < 48) return 'Yesterday';
    return d.toLocaleDateString();
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header with New Chat Button */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            bgcolor: '#6366f1',
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: '#4f46e5' }
          }}
        >
          New Chat
        </Button>
      </Box>

      {/* Sessions List */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#d1d5db',
          borderRadius: '3px',
        }
      }}>
        {loading ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No chats yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Click "New Chat" to start
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 1 }}>
            {sessions.map((session) => (
              <ListItem
                key={session._id}
                onClick={() => {
                  router.push(`/chat/${session._id}`);
                  onSessionChange(session._id);
                }}
                sx={{
                  mb: 0.5,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  bgcolor: currentSessionId === session._id ? '#e0e7ff' : 'transparent',
                  '&:hover': { 
                    bgcolor: currentSessionId === session._id ? '#e0e7ff' : '#f3f4f6' 
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                }}
              >
                <ChatIcon sx={{ fontSize: 18, color: '#6b7280', flexShrink: 0 }} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: currentSessionId === session._id ? 600 : 400,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: '#1f2937',
                    }}
                  >
                    {session.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#9ca3af',
                      fontSize: '0.7rem'
                    }}
                  >
                    {formatDate(session.lastMessageAt)}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteSession(session._id, e)}
                  sx={{ 
                    opacity: 0.6, 
                    '&:hover': { 
                      opacity: 1,
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
