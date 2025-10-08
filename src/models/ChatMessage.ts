import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChatMessage extends Document {
  _id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  sessionId: { 
    type: String, 
    required: true,
    index: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'assistant'],
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
});

const ChatMessage: Model<IChatMessage> = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

export default ChatMessage;
