import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import SavedQuiz from "@/models/SavedQuiz";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const quizId = params.id;

    // Reset quiz completion status
    const savedQuiz = await SavedQuiz.findByIdAndUpdate(
      quizId,
      {
        isCompleted: false,
        score: undefined,
        completedAt: undefined,
      },
      { new: true }
    );

    if (!savedQuiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz reset successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error resetting quiz:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
