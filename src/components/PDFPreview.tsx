'use client';

import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface PDFPreviewProps {
  pdfUrl: string;
}

export default function PDFPreview({ pdfUrl }: PDFPreviewProps) {
  if (!pdfUrl) {
    return (
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', textAlign: 'center', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            📄 No PDF Selected
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Select a PDF from the dropdown or upload one to preview
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: '16px', height: '600px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        PDF Preview 📖
      </Typography>

      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'hidden', 
          bgcolor: '#f3f4f6', 
          borderRadius: '8px',
          position: 'relative'
        }}
      >
        <iframe
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px'
          }}
          title="PDF Preview"
        />
      </Box>
    </Paper>
  );
}
