'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Button, LinearProgress, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

interface Question {
  id: number;
  type: 'mcq' | 'saq' | 'laq';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

interface UserAnswer {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (!quizCompleted && !loading) {
      const interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, quizCompleted, loading]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`/api/quizzes/${quizId}`);
      setQuiz(res.data.quiz);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz');
      router.push('/savedquiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      alert('Please provide an answer');
      return;
    }

    const isCorrect = checkAnswer(currentAnswer, currentQuestion.correctAnswer, currentQuestion.type);
    const earnedMarks = isCorrect ? currentQuestion.marks : 0;

    const answerRecord: UserAnswer = {
      questionId: currentQuestion.id,
      userAnswer: currentAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      marks: currentQuestion.marks,
      earnedMarks,
    };

    setUserAnswers([...userAnswers, answerRecord]);
    setShowExplanation(true);
  };

  const checkAnswer = (userAns: string, correctAns: string, type: string): boolean => {
    if (type === 'mcq') {
      return userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
    } else {
      const userWords = userAns.toLowerCase().split(' ');
      const correctWords = correctAns.toLowerCase().split(' ');
      const matchCount = userWords.filter(word => correctWords.includes(word)).length;
      return matchCount >= correctWords.length * 0.5;
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      
      const totalMarks = quiz.questions.reduce((sum: number, q: Question) => sum + q.marks, 0);
      const earnedMarks = userAnswers.reduce((sum, ans) => sum + ans.earnedMarks, 0);
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      await axios.post(`/api/quizzes/${quizId}/submit`, {
        userId,
        answers: userAnswers,
        totalMarks,
        earnedMarks,
        timeTaken,
      });

      router.push('/progress');
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <p>Quiz not found</p>
      </Container>
    );
  }

  if (quizCompleted) {
    const totalMarks = quiz.questions.reduce((sum: number, q: Question) => sum + q.marks, 0);
    const earnedMarks = userAnswers.reduce((sum, ans) => sum + ans.earnedMarks, 0);
    const percentage = ((earnedMarks / totalMarks) * 100).toFixed(2);

    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
          
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {earnedMarks} / {totalMarks}
            </div>
            <div className="text-lg text-gray-600">
              {percentage}% Score
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Total Questions:</span>
              <span className="font-semibold">{quiz.questions.length}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Correct:</span>
              <span className="font-semibold">{userAnswers.filter(a => a.isCorrect).length}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Incorrect:</span>
              <span className="font-semibold">{userAnswers.filter(a => !a.isCorrect).length}</span>
            </div>
            <div className="flex justify-between text-blue-600">
              <span>Time Taken:</span>
              <span className="font-semibold">{formatTime(elapsedTime)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmitQuiz}
              disabled={submitting}
              sx={{
                py: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {submitting ? 'Submitting...' : 'Save & View Progress'}
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => window.location.reload()}
              sx={{
                py: 2,
                borderRadius: '12px',
                borderColor: '#6366f1',
                color: '#6366f1',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              🔄 Reattempt
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
          <div className="flex items-center gap-4">
            <span className="text-blue-600 font-semibold">⏱️ {formatTime(elapsedTime)}</span>
            <span className="text-gray-600 font-medium">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
          </div>
        </div>
        <LinearProgress 
          variant="determinate" 
          value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Score Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div>
          <span className="text-gray-600">Current Score:</span>
          <span className="text-2xl font-bold text-indigo-600 ml-2">
            {userAnswers.reduce((sum, ans) => sum + ans.earnedMarks, 0)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Answered:</span>
          <span className="text-xl font-bold text-gray-800 ml-2">
            {userAnswers.length} / {quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-3 mb-6">
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            currentQuestion.type === 'mcq' ? 'bg-blue-100 text-blue-700' :
            currentQuestion.type === 'saq' ? 'bg-green-100 text-green-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {currentQuestion.type.toUpperCase()} • {currentQuestion.marks} marks
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.question}
        </h3>

        {/* MCQ Options */}
        {currentQuestion.type === 'mcq' && !showExplanation && (
          <div className="space-y-3 mb-6">
            {currentQuestion.options?.map((option: string, index: number) => (
              <div
                key={index}
                onClick={() => handleAnswerChange(option)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  currentAnswer === option
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === option && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAQ/LAQ Text Input */}
        {(currentQuestion.type === 'saq' || currentQuestion.type === 'laq') && !showExplanation && (
          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={`Write your ${currentQuestion.type === 'saq' ? '2-3 sentence' : 'detailed'} answer here...`}
            rows={currentQuestion.type === 'saq' ? 4 : 8}
            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none mb-6"
          />
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-6 rounded-xl mb-6 ${
            userAnswers[userAnswers.length - 1]?.isCorrect
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">
                {userAnswers[userAnswers.length - 1]?.isCorrect ? '✅' : '❌'}
              </span>
              <span className="text-lg font-bold">
                {userAnswers[userAnswers.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              <span className="ml-auto text-lg font-semibold">
                {userAnswers[userAnswers.length - 1]?.earnedMarks} / {currentQuestion.marks} marks
              </span>
            </div>

            <div className="mb-3">
              <strong className="text-gray-700">Your Answer:</strong>
              <p className="text-gray-600 mt-1">{currentAnswer}</p>
            </div>

            <div className="mb-3">
              <strong className="text-gray-700">Correct Answer:</strong>
              <p className="text-green-700 font-medium mt-1">{currentQuestion.correctAnswer}</p>
            </div>

            <div>
              <strong className="text-gray-700">Explanation:</strong>
              <p className="text-gray-600 mt-1">{currentQuestion.explanation}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showExplanation ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmitAnswer}
              sx={{
                py: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={handleNextQuestion}
              sx={{
                py: 2,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
