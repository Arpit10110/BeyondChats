'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

interface Answer {
  questionId: number;
  question: string;
  questionType: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
  explanation: string;
}

interface AttemptDetail {
  quizTitle: string;
  pdfSource: string;
  totalQuestions: number;
  totalMarks: number;
  earnedMarks: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  attemptNumber: number;
  completedAt: string;
  timeTaken?: number;
  answers: Answer[];
}

export default function AttemptDetailPage() {
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const attemptId = params.id as string;

  useEffect(() => {
    fetchAttemptDetail();
  }, [attemptId]);

  const fetchAttemptDetail = async () => {
    try {
      const res = await axios.get(`/api/attempt/${attemptId}`);
      setAttempt(res.data.attempt);
    } catch (error) {
      console.error('Error fetching attempt detail:', error);
      alert('Failed to load attempt details');
      router.push('/progress');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!attempt) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Attempt not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        onClick={() => router.push('/progress')}
        sx={{ mb: 3 }}
      >
        ← Back to Progress
      </Button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{attempt.quizTitle}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">{attempt.percentage.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{attempt.correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">{attempt.incorrectAnswers}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-purple-600">{formatTime(attempt.timeTaken)}</div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span>Attempt #{attempt.attemptNumber}</span>
          <span className="mx-2">•</span>
          <span>{new Date(attempt.completedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        {attempt.answers.map((answer, index) => (
          <div key={answer.questionId} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">Q{index + 1}</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  answer.questionType === 'mcq' ? 'bg-blue-100 text-blue-700' :
                  answer.questionType === 'saq' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {answer.questionType.toUpperCase()}
                </span>
              </div>
              <span className={`text-2xl ${answer.isCorrect ? '✅' : '❌'}`}></span>
            </div>

            <h4 className="text-lg font-semibold text-gray-800 mb-4">{answer.question}</h4>

            <div className={`p-4 rounded-lg mb-3 ${
              answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="text-sm font-semibold text-gray-700 mb-1">Your Answer:</div>
              <div className="text-gray-800">{answer.userAnswer}</div>
            </div>

            {!answer.isCorrect && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-3">
                <div className="text-sm font-semibold text-gray-700 mb-1">Correct Answer:</div>
                <div className="text-green-700 font-medium">{answer.correctAnswer}</div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm font-semibold text-gray-700 mb-1">Explanation:</div>
              <div className="text-gray-700">{answer.explanation}</div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <span className="font-semibold">Marks:</span> {answer.earnedMarks} / {answer.marks}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
