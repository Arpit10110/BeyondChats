import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  quizAttempts: IQuizAttempt[];
}

export interface IQuizAttempt {
  quizId: string;
  pdfSource: string;
  score: number;
  totalQuestions: number;
  answers: IAnswer[];
  timestamp: Date;
}

export interface IAnswer {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

const AnswerSchema = new Schema<IAnswer>({
  questionId: { type: String, required: true },
  userAnswer: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const QuizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: String, required: true },
  pdfSource: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [AnswerSchema],
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must be less than 50 characters']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  quizAttempts: [QuizAttemptSchema],
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
