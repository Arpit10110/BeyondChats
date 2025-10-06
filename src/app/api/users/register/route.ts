import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/db/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }
    await connectDB();

    const newUser = await User.create({
      name: name.trim(),
      createdAt: new Date(),
      quizAttempts: [],
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      userId: newUser._id.toString(),
      userName: newUser.name,
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error registering user:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to register user. Please try again.' },
      { status: 500 }
    );
  }
}
