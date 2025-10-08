'use client';

import React, { useState, useRef } from 'react';
import { Box, TextField, IconButton, Button, Chip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface ChatInputProps {
  onSend: (message: string, pdfFile: File | null) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      setSelectedPdf(file);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;

    onSend(message, selectedPdf);
    setMessage('');
    // Keep PDF attached for follow-up questions
  };

  const handleRemovePdf = () => {
    setSelectedPdf(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box>
      {/* PDF Badge */}
      {selectedPdf && (
        <Box sx={{ mb: 1 }}>
          <Chip
            icon={<PictureAsPdfIcon />}
            label={`${selectedPdf.name} (${(selectedPdf.size / 1024 / 1024).toFixed(2)} MB)`}
            onDelete={handleRemovePdf}
            deleteIcon={<CloseIcon />}
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              '& .MuiChip-deleteIcon': { color: '#92400e' }
            }}
          />
        </Box>
      )}

      {/* Input Box */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        {/* Attach Button */}
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          sx={{ mb: 0.5 }}
        >
          <AttachFileIcon />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          hidden
          onChange={handleFileSelect}
        />

        {/* Text Input */}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            }
          }}
        />

        {/* Send Button */}
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          sx={{
            minWidth: 'auto',
            px: 2,
            py: 1.5,
            borderRadius: '12px',
            bgcolor: '#6366f1',
            '&:hover': { bgcolor: '#4f46e5' }
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}
