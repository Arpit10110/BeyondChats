'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface SavedQuiz {
  _id: string;
  title: string;
  pdfSource: string;
  totalQuestions: number;
  numberOfQuestions: {
    mcq: number;
    saq: number;
    laq: number;
  };
  isCompleted: boolean;
  score?: number;
  createdAt: string;
}

export default function SavedQuizPage() {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [reattempting, setReattempting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSavedQuizzes();
  }, []);

  const fetchSavedQuizzes = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        router.push('/');
        return;
      }

      const res = await axios.get(`/api/quizzes/saved?userId=${userId}`);
      setQuizzes(res.data.quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReattempt = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!confirm('Are you sure you want to reattempt this quiz? Your previous score will be replaced.')) {
      return;
    }

    setReattempting(quizId);

    try {
      await axios.post(`/api/quizzes/${quizId}/reattempt`);
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error('Error reattempting quiz:', error);
      alert('Failed to reset quiz');
      setReattempting(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
          My Saved Quizzes 📚
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/quizzes')}
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            px: 3,
            py: 1.2,
            borderRadius: '12px',
          }}
        >
          + Generate New Quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No saved quizzes yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Generate a quiz from the Quizzes page
          </Typography>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3">{quiz.title}</h3>
              
              <div className="flex gap-2 mb-4">
                {quiz.numberOfQuestions.mcq > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {quiz.numberOfQuestions.mcq} MCQ
                  </span>
                )}
                {quiz.numberOfQuestions.saq > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {quiz.numberOfQuestions.saq} SAQ
                  </span>
                )}
                {quiz.numberOfQuestions.laq > 0 && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {quiz.numberOfQuestions.laq} LAQ
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-700">
                  {quiz.totalQuestions} Questions
                </span>
                {quiz.isCompleted ? (
                  <span className="text-sm font-medium text-green-600">
                    ✅ Score: {quiz.score}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-orange-600">
                    ⏳ Not Completed
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {quiz.isCompleted ? (
                  <>
                    <button
                      onClick={(e) => handleReattempt(quiz._id, e)}
                      disabled={reattempting === quiz._id}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                    >
                      {reattempting === quiz._id ? 'Resetting...' : '🔄 Reattempt'}
                    </button>
                    <button
                      onClick={() => router.push(`/quiz/${quiz._id}/results`)}
                      className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                    >
                      📊 View Results
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push(`/quiz/${quiz._id}`)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
                  >
                    ▶️ Start Quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
