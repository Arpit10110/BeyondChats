'use client';

import React, { useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import QuizForm from '@/components/QuizForm';
import PDFPreview from '@/components/PDFPreview';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function QuizzesPage() {
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmit = async (formData: any, pdfUrl: string) => {
    console.log('Ready to generate quiz with:', formData);
    setLoading(true);

    try {
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        alert('Please register first');
        router.push('/');
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      
      submitData.append('userId', userId);
      submitData.append('pdfSource', formData.pdfSource);
      submitData.append('quizTypes', JSON.stringify(formData.quizTypes));
      submitData.append('numberOfQuestions', JSON.stringify(formData.numberOfQuestions));
      
      if (formData.pdfSource === 'dropdown') {
        submitData.append('selectedPdf', formData.selectedPdf);
      } else if (formData.uploadedFile) {
        submitData.append('pdfFile', formData.uploadedFile);
      }

      const res = await axios.post('/api/quizzes/generate', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Quiz generated:', res.data);
      
      // Redirect to saved quizzes page
      router.push('/savedquiz');
      
    } catch (error: any) {
      console.error('❌ Error:', error.response?.data || error.message);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfChange = (pdfUrl: string) => {
    setPdfPreviewUrl(pdfUrl);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: 'white', p: 4, borderRadius: 2, textAlign: 'center' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Generating quiz from PDF...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </Box>
        </Box>
      )}

      {/* Header with "View Saved Quizzes" Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h1 className="text-3xl font-bold text-gray-800">Generate Quiz 🎯</h1>
        <Button
          variant="contained"
          startIcon={<BookmarkIcon />}
          onClick={() => router.push('/savedquiz')}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1.2,
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            },
          }}
        >
          View Saved Quizzes
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <QuizForm onSubmit={handleFormSubmit} onPdfChange={handlePdfChange} />
        </Box>
        <Box sx={{ flex: 1, position: { lg: 'sticky' }, top: { lg: 80 }, alignSelf: 'flex-start' }}>
          <PDFPreview pdfUrl={pdfPreviewUrl} />
        </Box>
      </Box>
    </Container>
  );
}
