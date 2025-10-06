'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Attempt {
  _id: string;
  quizTitle: string;
  pdfSource: string;
  totalQuestions: number;
  earnedMarks: number;
  totalMarks: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  attemptNumber: number;
  completedAt: string;
  timeTaken?: number;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<any>(null);
  const [topicPerformance, setTopicPerformance] = useState<any>({});
  const [recentAttempts, setRecentAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        router.push('/');
        return;
      }

      const res = await axios.get(`/api/progress?userId=${userId}`);
      setStats(res.data.stats);
      setTopicPerformance(res.data.topicPerformance);
      setRecentAttempts(res.data.recentAttempts);
    } catch (error) {
      console.error('Error fetching progress:', error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: '#1f2937' }}>
        Learning Progress 📊
      </Typography>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{stats.totalAttempts}</div>
          <div className="text-blue-100">Total Attempts</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{stats.totalCorrect}</div>
          <div className="text-green-100">Correct Answers</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{stats.averageScore}%</div>
          <div className="text-purple-100">Average Score</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold mb-2">{stats.accuracyRate}%</div>
          <div className="text-orange-100">Accuracy Rate</div>
        </div>
      </div>

      {/* Topic Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Performance by Topic</h3>
        <div className="space-y-4">
          {Object.entries(topicPerformance).map(([topic, data]: [string, any]) => (
            <div key={topic} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">📄 {topic}</span>
                <span className="text-lg font-bold text-indigo-600">{data.averageScore}%</span>
              </div>
              <LinearProgress 
                variant="determinate" 
                value={parseFloat(data.averageScore)}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{data.attempts} attempts</span>
                <span>{data.correctAnswers} / {data.totalQuestions} correct</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Quiz Attempts</h3>
        <div className="space-y-3">
          {recentAttempts.map((attempt) => (
            <div
              key={attempt._id}
              onClick={() => router.push(`/attempt/${attempt._id}`)}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-indigo-300 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{attempt.quizTitle}</h4>
                  <p className="text-sm text-gray-500">Attempt #{attempt.attemptNumber}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  attempt.percentage >= 80 ? 'bg-green-100 text-green-700' :
                  attempt.percentage >= 60 ? 'bg-blue-100 text-blue-700' :
                  attempt.percentage >= 40 ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {attempt.percentage.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Score:</span>
                  <span className="font-semibold text-gray-800 ml-1">
                    {attempt.earnedMarks}/{attempt.totalMarks}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Correct:</span>
                  <span className="font-semibold text-green-600 ml-1">
                    {attempt.correctAnswers}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Incorrect:</span>
                  <span className="font-semibold text-red-600 ml-1">
                    {attempt.incorrectAnswers}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-gray-800 ml-1">
                    {formatTime(attempt.timeTaken)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                {formatDate(attempt.completedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
