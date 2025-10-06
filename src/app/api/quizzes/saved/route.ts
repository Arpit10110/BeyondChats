import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
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

    const quizzes = await SavedQuiz.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      quizzes,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching saved quizzes:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
