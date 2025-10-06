import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import SavedQuiz from "@/models/SavedQuiz";
import QuizAttempt from "@/models/QuizAttempt";
import QuizData from "@/models/QuizData";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const quizId = params.id;
    const body = await request.json();
    const { userId, answers, totalMarks, earnedMarks, timeTaken } = body;

    // Get quiz data
    const savedQuiz = await SavedQuiz.findById(quizId);
    const quizData = await QuizData.findOne({ savedQuizId: quizId });

    if (!savedQuiz || !quizData) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate attempt number
    const previousAttempts = await QuizAttempt.countDocuments({ 
      userId, 
      savedQuizId: quizId 
    });

    const attemptNumber = previousAttempts + 1;

    // Prepare detailed answers with full question data
    const detailedAnswers = answers.map((ans: any) => {
      const question = quizData.questions.find((q: any) => q.id === ans.questionId);
      return {
        questionId: ans.questionId,
        question: question?.question || '',
        questionType: question?.type || 'mcq',
        userAnswer: ans.userAnswer,
        correctAnswer: ans.correctAnswer,
        isCorrect: ans.isCorrect,
        marks: ans.marks,
        earnedMarks: ans.earnedMarks,
        explanation: question?.explanation || '',
      };
    });

    const correctCount = answers.filter((a: any) => a.isCorrect).length;
    const incorrectCount = answers.length - correctCount;
    const percentage = ((earnedMarks / totalMarks) * 100);

    // Create quiz attempt record
    const attempt = await QuizAttempt.create({
      userId,
      savedQuizId: quizId,
      quizTitle: savedQuiz.title,
      pdfSource: savedQuiz.pdfSource,
      totalQuestions: savedQuiz.totalQuestions,
      totalMarks,
      earnedMarks,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      answers: detailedAnswers,
      attemptNumber,
      timeTaken,
    });

    // Update SavedQuiz with latest score
    await SavedQuiz.findByIdAndUpdate(
      quizId,
      {
        isCompleted: true,
        score: earnedMarks,
        completedAt: new Date(),
      }
    );

    // add the attempted id to saved quiz
    await SavedQuiz.findByIdAndUpdate(
      quizId,
      {
        attemptId: attempt._id,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Quiz submitted successfully',
      attemptId: attempt._id,
      score: earnedMarks,
      totalMarks,
      percentage: percentage.toFixed(2),
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error submitting quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
