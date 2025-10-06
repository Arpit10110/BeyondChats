import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion {
  id: number;
  type: 'mcq' | 'saq' | 'laq';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
}

export interface IQuizData extends Document {
  _id: string;
  userId: string;
  savedQuizId: string;
  quizTitle: string;
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: Number, required: true },
  type: { type: String, enum: ['mcq', 'saq', 'laq'], required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
  marks: { type: Number, required: true },
}, { _id: false });

const QuizDataSchema = new Schema<IQuizData>({
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
  questions: [QuestionSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const QuizData: Model<IQuizData> = mongoose.models.QuizData || mongoose.model<IQuizData>('QuizData', QuizDataSchema);

export default QuizData;
