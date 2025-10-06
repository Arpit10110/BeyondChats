import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnswer {
  questionId: number;
  question: string;
  questionType: 'mcq' | 'saq' | 'laq';
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  earnedMarks: number;
  explanation: string;
}

export interface IQuizAttempt extends Document {
  _id: string;
  userId: string;
  savedQuizId: string;
  quizTitle: string;
  pdfSource: string;
  totalQuestions: number;
  totalMarks: number;
  earnedMarks: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  answers: IAnswer[];
  attemptNumber: number;
  completedAt: Date;
  timeTaken?: number; // in seconds
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: Number, required: true },
  question: { type: String, required: true },
  questionType: { type: String, enum: ['mcq', 'saq', 'laq'], required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  marks: { type: Number, required: true },
  earnedMarks: { type: Number, required: true },
  explanation: { type: String, required: true },
}, { _id: false });

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  savedQuizId: { 
    type: String, 
    required: true,
    index: true 
  },
  quizTitle: { 
    type: String, 
    required: true 
  },
  pdfSource: { 
    type: String, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  earnedMarks: { 
    type: Number, 
    required: true 
  },
  percentage: { 
    type: Number, 
    required: true 
  },
  correctAnswers: { 
    type: Number, 
    required: true 
  },
  incorrectAnswers: { 
    type: Number, 
    required: true 
  },
  answers: [AnswerSchema],
  attemptNumber: { 
    type: Number, 
    required: true,
    default: 1
  },
  completedAt: { 
    type: Date, 
    default: Date.now 
  },
  timeTaken: { 
    type: Number 
  },
});

const QuizAttempt: Model<IQuizAttempt> = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
