import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import QuizAttempt from "@/models/QuizAttempt";
import SavedQuiz from "@/models/SavedQuiz";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get all attempts
    const attempts = await QuizAttempt.find({ userId }).sort({ completedAt: -1 });

    // Get total quizzes
    const totalQuizzes = await SavedQuiz.countDocuments({ userId });
    const completedQuizzes = await SavedQuiz.countDocuments({ userId, isCompleted: true });

    // Calculate statistics
    const totalAttempts = attempts.length;
    const totalQuestionsAttempted = attempts.reduce((sum, att) => sum + att.totalQuestions, 0);
    const totalCorrect = attempts.reduce((sum, att) => sum + att.correctAnswers, 0);
    const totalIncorrect = attempts.reduce((sum, att) => sum + att.incorrectAnswers, 0);
    const averageScore = totalAttempts > 0 
      ? (attempts.reduce((sum, att) => sum + att.percentage, 0) / totalAttempts).toFixed(2)
      : 0;

    // Topic-wise performance (based on PDF source)
    const topicPerformance: any = {};
    attempts.forEach(att => {
      if (!topicPerformance[att.pdfSource]) {
        topicPerformance[att.pdfSource] = {
          attempts: 0,
          totalQuestions: 0,
          correctAnswers: 0,
          averageScore: 0,
        };
      }
      topicPerformance[att.pdfSource].attempts++;
      topicPerformance[att.pdfSource].totalQuestions += att.totalQuestions;
      topicPerformance[att.pdfSource].correctAnswers += att.correctAnswers;
    });

    // Calculate average for each topic
    Object.keys(topicPerformance).forEach(topic => {
      const data = topicPerformance[topic];
      data.averageScore = ((data.correctAnswers / data.totalQuestions) * 100).toFixed(2);
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalQuizzes,
        completedQuizzes,
        totalAttempts,
        totalQuestionsAttempted,
        totalCorrect,
        totalIncorrect,
        averageScore,
        accuracyRate: totalQuestionsAttempted > 0 
          ? ((totalCorrect / totalQuestionsAttempted) * 100).toFixed(2)
          : 0,
      },
      topicPerformance,
      recentAttempts: attempts.slice(0, 10), // Last 10 attempts
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching progress:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
