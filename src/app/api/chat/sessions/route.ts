import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import ChatSession from "@/models/ChatSession";
import ChatMessage from "@/models/ChatMessage";

// GET - Get all sessions for user
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

    const sessions = await ChatSession.find({ userId }).sort({ lastMessageAt: -1 });

    return NextResponse.json({
      success: true,
      sessions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};

// POST - Create new session
export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const session = await ChatSession.create({
      userId,
      title: 'New Chat',
      createdAt: new Date(),
      lastMessageAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      session,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error creating session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};

// DELETE - Delete session
export const DELETE = async (request: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Delete session and all messages
    await ChatSession.findByIdAndDelete(sessionId);
    await ChatMessage.deleteMany({ sessionId });

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};
