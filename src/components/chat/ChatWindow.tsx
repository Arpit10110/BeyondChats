'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';

interface Message {
  _id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  isLoading?: boolean;
}

interface ChatWindowProps {
  sessionId: string | null;
}

export default function ChatWindow({ sessionId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/chat/${sessionId}/messages`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string, pdfFile: File | null) => {
    if (!sessionId) return;

    setSending(true);

    const userMessage: Message = {
      _id: `temp-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const loadingMessage: Message = {
      _id: `temp-ai-${Date.now()}`,
      role: 'assistant',
      content: '',
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      const userId = localStorage.getItem('userId');
      
      const formData = new FormData();
      formData.append('userId', userId!);
      formData.append('content', content);
      
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }

      const res = await axios.post(`/api/chat/${sessionId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) => msg._id !== userMessage._id && msg._id !== loadingMessage._id
        );
        return [...filtered, res.data.userMessage, res.data.aiMessage];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg._id !== loadingMessage._id);
        const errorMessage: Message = {
          _id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        };
        return [...filtered, errorMessage];
      });
      
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!sessionId) {
    return <EmptyState />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      overflow: 'hidden',
    }}>
      {/* Messages Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          px: { xs: 2, md: 4 },
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#ffffff',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#d1d5db',
            borderRadius: '3px',
          }
        }}
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        borderTop: '1px solid #e5e7eb', 
        px: { xs: 2, md: 3 },
        py: 2, 
        flexShrink: 0,
        bgcolor: 'white'
      }}>
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <ChatInput onSend={handleSendMessage} disabled={sending} />
        </Box>
      </Box>
    </Box>
  );
}
