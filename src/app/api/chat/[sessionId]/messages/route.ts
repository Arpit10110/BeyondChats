import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/db";
import ChatSession from "@/models/ChatSession";
import ChatMessage from "@/models/ChatMessage";
import { createPartFromUri, GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// GET - Get all messages for session
export const GET = async (
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) => {
  try {
    await connectDB();

    const sessionId = params.sessionId;

    const messages = await ChatMessage.find({ sessionId }).sort({ timestamp: 1 });

    return NextResponse.json({
      success: true,
      messages,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
};

// POST - Send message and get AI response
export const POST = async (
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) => {
  let uploadedFilePath: string | null = null;
  let geminiFile: any = null;

  try {
    await connectDB();

    const sessionId = params.sessionId;
    const formData = await request.formData();
    
    const userId = formData.get('userId') as string;
    const content = formData.get('content') as string;
    const pdfFile = formData.get('pdfFile') as File | null;

    console.log('📥 Received message:', content.substring(0, 50));
    console.log('📎 PDF attached:', !!pdfFile);

    if (!userId || !content) {
      return NextResponse.json(
        { success: false, error: 'User ID and content are required' },
        { status: 400 }
      );
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      sessionId,
      role: 'user',
      content,
      timestamp: new Date(),
    });

    let geminiResponse;

    // Handle PDF upload and processing
    if (pdfFile) {
      console.log('📄 Processing PDF:', pdfFile.name);

      // Save PDF temporarily
      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      uploadedFilePath = path.join(tempDir, `${Date.now()}-${pdfFile.name}`);
      await writeFile(uploadedFilePath, buffer);

      console.log('💾 Saved PDF temporarily:', uploadedFilePath);

      // Upload to Gemini
      geminiFile = await ai.files.upload({
        file: uploadedFilePath,
        config: {
          displayName: pdfFile.name,
        },
      });

      console.log('🔄 Uploaded to Gemini:', geminiFile.name);

      // Wait for processing
      let getFile = await ai.files.get({ name: geminiFile.name });
      let retries = 0;
      const maxRetries = 20;

      while (getFile.state === 'PROCESSING' && retries < maxRetries) {
        console.log(`⏳ Processing... (${retries + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        getFile = await ai.files.get({ name: geminiFile.name });
        retries++;
      }

      if (getFile.state === 'FAILED') {
        throw new Error('PDF processing failed');
      }

      console.log('✅ PDF processed successfully');

      // Generate response with PDF context
      const prompt = `You are a helpful teaching assistant. Answer the student's question based on the provided PDF document. 
      
Always cite specific page numbers and include relevant quotes when answering. Format citations like this: "(Page X: 'quoted text...')"

Be concise, clear, and educational. If the question cannot be answered from the PDF, say so politely.

Student's question: ${content}`;

      geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              createPartFromUri(geminiFile.uri!, geminiFile.mimeType!)
            ]
          }
        ],
      });

    } else {
      // Text-only question
      console.log('💬 Processing text-only question');

      geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
          {
            role: 'user',
            parts: [{ text: content }]
          }
        ],
      });
    }

    const aiContent = geminiResponse.text || 'Sorry, I could not generate a response.';

    console.log('🤖 AI Response generated');

    // Save AI message
    const aiMessage = await ChatMessage.create({
      sessionId,
      role: 'assistant',
      content: aiContent,
      timestamp: new Date(),
    });

    // Update session title if this is first message
    const messageCount = await ChatMessage.countDocuments({ sessionId });
    if (messageCount === 2) { // User + AI = 2 messages
      // Generate title from first question
      const title = content.length > 50 
        ? content.substring(0, 47) + '...' 
        : content;
      
      await ChatSession.findByIdAndUpdate(sessionId, { 
        title,
        lastMessageAt: new Date(),
      });
    } else {
      // Just update last message time
      await ChatSession.findByIdAndUpdate(sessionId, { 
        lastMessageAt: new Date(),
      });
    }

    // Cleanup
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
      console.log('🗑️ Cleaned up temporary PDF');
    }

    if (geminiFile) {
      try {
        await ai.files.delete({ name: geminiFile.name });
        console.log('🗑️ Deleted PDF from Gemini');
      } catch (deleteError) {
        console.warn('⚠️ Failed to delete Gemini file:', deleteError);
      }
    }

    return NextResponse.json({
      success: true,
      userMessage,
      aiMessage,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error processing message:', error);

    // Cleanup on error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup file:', cleanupError);
      }
    }

    if (geminiFile) {
      try {
        await ai.files.delete({ name: geminiFile.name });
      } catch (deleteError) {
        console.warn('⚠️ Failed to delete Gemini file:', deleteError);
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        details: error.toString()
      },
      { status: 500 }
    );
  }
};
