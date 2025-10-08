import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatSession extends Document {
  _id: string;
  userId: string;
  title: string;
  createdAt: Date;
  lastMessageAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  title: { 
    type: String, 
    required: true,
    default: 'New Chat'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastMessageAt: { 
    type: Date, 
    default: Date.now 
  },
});

const ChatSession: Model<IChatSession> = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export default ChatSession;
