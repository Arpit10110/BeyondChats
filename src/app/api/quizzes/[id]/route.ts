import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import SavedQuiz from "@/models/SavedQuiz";
import QuizData from "@/models/QuizData";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const quizId = params.id;

    // Get quiz metadata
    const savedQuiz = await SavedQuiz.findById(quizId);
    
    if (!savedQuiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get quiz questions
    const quizData = await QuizData.findOne({ savedQuizId: quizId });

    if (!quizData) {
      return NextResponse.json(
        { success: false, error: 'Quiz data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        id: savedQuiz._id,
        title: savedQuiz.title,
        pdfSource: savedQuiz.pdfSource,
        totalQuestions: savedQuiz.totalQuestions,
        numberOfQuestions: savedQuiz.numberOfQuestions,
        isCompleted: savedQuiz.isCompleted,
        score: savedQuiz.score,
        questions: quizData.questions,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
