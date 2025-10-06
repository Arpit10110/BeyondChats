import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import SavedQuiz from "@/models/SavedQuiz";
import User from "@/models/User";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const quizId = params.id;
    const body = await request.json();
    const { userId, answers, totalMarks, earnedMarks } = body;

    // Update SavedQuiz
    const savedQuiz = await SavedQuiz.findByIdAndUpdate(
      quizId,
      {
        isCompleted: true,
        score: earnedMarks,
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!savedQuiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Save to User's quiz attempts
    const user = await User.findById(userId);
    
    if (user) {
      user.quizAttempts.push({
        quizId: quizId,
        pdfSource: savedQuiz.pdfSource,
        score: earnedMarks,
        totalQuestions: savedQuiz.totalQuestions,
        answers: answers,
        timestamp: new Date(),
      });
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz submitted successfully',
      score: earnedMarks,
      totalMarks,
      percentage: ((earnedMarks / totalMarks) * 100).toFixed(2),
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error submitting quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
