import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import QuizAttempt from "@/models/QuizAttempt";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();

    const attemptId = params.id;

    const attempt = await QuizAttempt.findById(attemptId);

    if (!attempt) {
      return NextResponse.json(
        { success: false, error: 'Attempt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      attempt,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching attempt:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
