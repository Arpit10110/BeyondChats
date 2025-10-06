import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedQuiz extends Document {
  _id: string;
  userId: string;
  title: string;
  pdfSource: string;
  attemptId: string;
  numberOfQuestions: {
    mcq: number;
    saq: number;
    laq: number;
  };
  totalQuestions: number;
  isCompleted: boolean;
  score?: number;
  createdAt: Date;
  completedAt?: Date;
}

const SavedQuizSchema = new Schema<ISavedQuiz>({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  attemptId: { 
    type: String, 
    
  },
  title: { 
    type: String, 
    required: true 
  },
  pdfSource: { 
    type: String, 
    required: true 
  },
  numberOfQuestions: {
    mcq: { type: Number, default: 0 },
    saq: { type: Number, default: 0 },
    laq: { type: Number, default: 0 },
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  score: { 
    type: Number 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  completedAt: { 
    type: Date 
  },
});

const SavedQuiz: Model<ISavedQuiz> = mongoose.models.SavedQuiz || mongoose.model<ISavedQuiz>('SavedQuiz', SavedQuizSchema);

export default SavedQuiz;
