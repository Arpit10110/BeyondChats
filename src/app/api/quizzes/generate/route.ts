import { NextRequest, NextResponse } from "next/server";
import { createPartFromUri, GoogleGenAI } from "@google/genai";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import { connectDB } from "@/db/db";
import SavedQuiz from "@/models/SavedQuiz";
import QuizData from "@/models/QuizData";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const POST = async (request: NextRequest) => {
  let uploadedFilePath: string | null = null;

  try {
    // Connect to database
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    
    const pdfSource = formData.get('pdfSource') as string;
    const userId = formData.get('userId') as string;
    const quizTypes = JSON.parse(formData.get('quizTypes') as string);
    const numberOfQuestions = JSON.parse(formData.get('numberOfQuestions') as string);
    
    console.log('📥 Received Quiz Configuration:');
    console.log('User ID:', userId);
    console.log('PDF Source:', pdfSource);
    console.log('Quiz Types:', quizTypes);
    console.log('Number of Questions:', numberOfQuestions);

    // Validate
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!pdfSource) {
      return NextResponse.json(
        { success: false, error: 'PDF source is required' },
        { status: 400 }
      );
    }

    if (!quizTypes.mcq && !quizTypes.saq && !quizTypes.laq) {
      return NextResponse.json(
        { success: false, error: 'At least one quiz type must be selected' },
        { status: 400 }
      );
    }

    let pdfPath = '';
    let pdfTitle = '';
    let file;

    // Handle local PDF (dropdown)
    if (pdfSource === 'dropdown') {
      const selectedPdf = formData.get('selectedPdf') as string;
      pdfPath = path.join(process.cwd(), 'public', selectedPdf);
      pdfTitle = path.basename(selectedPdf, '.pdf');
      
      if (!fs.existsSync(pdfPath)) {
        return NextResponse.json(
          { success: false, error: 'Selected PDF file not found' },
          { status: 404 }
        );
      }

      console.log('📄 Using local PDF:', pdfPath);

      file = await ai.files.upload({
        file: pdfPath,
        config: {
          displayName: path.basename(pdfPath),
        },
      });
    } 
    // Handle uploaded PDF
    else if (pdfSource === 'upload') {
      const pdfFile = formData.get('pdfFile') as File;
      
      if (!pdfFile) {
        return NextResponse.json(
          { success: false, error: 'PDF file is required' },
          { status: 400 }
        );
      }

      pdfTitle = pdfFile.name.replace('.pdf', '');
      console.log('📤 Processing uploaded PDF:', pdfFile.name);

      const bytes = await pdfFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const tempDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      uploadedFilePath = path.join(tempDir, `${Date.now()}-${pdfFile.name}`);
      await writeFile(uploadedFilePath, buffer);

      console.log('💾 Saved uploaded PDF to:', uploadedFilePath);

      file = await ai.files.upload({
        file: uploadedFilePath,
        config: {
          displayName: pdfFile.name,
        },
      });
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Failed to upload PDF' },
        { status: 500 }
      );
    }

    console.log('🔄 File uploaded to Gemini, waiting for processing...');

    // FIXED: Check if file.name exists
    if (!file.name) {
      throw new Error('File upload failed - no file name returned');
    }

    // Wait for file to be processed
    let getFile = await ai.files.get({ name: file.name });
    let retries = 0;
    const maxRetries = 20;

    while (getFile.state === 'PROCESSING' && retries < maxRetries) {
      console.log(`⏳ File status: ${getFile.state} (retry ${retries + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      getFile = await ai.files.get({ name: file.name });
      retries++;
    }

    if (getFile.state === 'FAILED') {
      throw new Error('File processing failed');
    }

    if (getFile.state === 'PROCESSING') {
      throw new Error('File processing timed out');
    }

    console.log('✅ File processed successfully!');

    // Generate prompt
    const prompt = generateQuizPrompt(quizTypes, numberOfQuestions);
    
    console.log('📝 Generating quiz with Gemini...');

    // Create content array
    const content: any[] = [prompt];
    
    if (file.uri && file.mimeType) {
      const fileContent = createPartFromUri(file.uri, file.mimeType);
      content.push(fileContent);
    }

    // Generate quiz
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: content,
    });

    // FIXED: Check if response.text exists
    const quizText = response.text;

    if (!quizText) {
      throw new Error('No response text from Gemini');
    }

    console.log('📊 Quiz generated successfully!');
    console.log('Raw response length:', quizText.length);

    // Parse JSON response - FIXED regex pattern
    let quizData;
    try {
      // Try to extract JSON from markdown code blocks or raw JSON
      const jsonMatch = quizText.match(/``````/) || 
                        quizText.match(/``````/) || 
                        quizText.match(/\{[\s\S]*\}/);
      
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : quizText;
      
      console.log('Extracted JSON string (first 200 chars):', jsonString.substring(0, 200));
      
      quizData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('❌ Failed to parse quiz JSON:', parseError);
      console.log('Full response:', quizText);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to parse quiz data',
        rawResponse: quizText.substring(0, 500),
      }, { status: 500 });
    }

    // Extract quiz from nested structure
    const quiz = quizData.quiz || quizData;

    // Calculate total questions
    const totalQuestions = (quizTypes.mcq ? numberOfQuestions.mcq : 0) + 
                          (quizTypes.saq ? numberOfQuestions.saq : 0) + 
                          (quizTypes.laq ? numberOfQuestions.laq : 0);

    // Save to SavedQuiz collection
    const savedQuiz = await SavedQuiz.create({
      userId,
      title: quiz.title || pdfTitle,
      pdfSource: pdfSource === 'dropdown' ? formData.get('selectedPdf') : pdfTitle,
      numberOfQuestions: {
        mcq: quizTypes.mcq ? numberOfQuestions.mcq : 0,
        saq: quizTypes.saq ? numberOfQuestions.saq : 0,
        laq: quizTypes.laq ? numberOfQuestions.laq : 0,
      },
      totalQuestions,
      isCompleted: false,
    });

    console.log('💾 Saved quiz metadata:', savedQuiz._id);

    // Save to QuizData collection
    const quizDataDoc = await QuizData.create({
      userId,
      savedQuizId: savedQuiz._id.toString(),
      quizTitle: quiz.title || pdfTitle,
      questions: quiz.questions,
    });

    console.log('💾 Saved quiz questions:', quizDataDoc._id);

    // Clean up
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
      console.log('🗑️ Cleaned up uploaded file');
    }

    try {
      await ai.files.delete({ name: file.name });
      console.log('🗑️ Deleted file from Gemini');
    } catch (deleteError) {
      console.warn('⚠️ Failed to delete Gemini file:', deleteError);
    }

    return NextResponse.json({
      success: true,
      message: 'Quiz generated and saved successfully',
      savedQuizId: savedQuiz._id.toString(),
      quizTitle: quiz.title || pdfTitle,
      totalQuestions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ Error generating quiz:', error);

    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (cleanupError) {
        console.warn('⚠️ Failed to cleanup file:', cleanupError);
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

function generateQuizPrompt(quizTypes: any, numberOfQuestions: any): string {
  const questionTypes: string[] = [];
  
  if (quizTypes.mcq) {
    questionTypes.push(`- ${numberOfQuestions.mcq} Multiple Choice Questions (MCQs) with 4 options each`);
  }
  
  if (quizTypes.saq) {
    questionTypes.push(`- ${numberOfQuestions.saq} Short Answer Questions (SAQs) requiring 2-3 sentence answers`);
  }
  
  if (quizTypes.laq) {
    questionTypes.push(`- ${numberOfQuestions.laq} Long Answer Questions (LAQs) requiring detailed paragraph answers`);
  }

  const totalQuestions = (quizTypes.mcq ? numberOfQuestions.mcq : 0) + 
                        (quizTypes.saq ? numberOfQuestions.saq : 0) + 
                        (quizTypes.laq ? numberOfQuestions.laq : 0);

  return `You are an expert educator. Generate a comprehensive quiz from the provided PDF document.

## QUIZ REQUIREMENTS:

${questionTypes.join('\n')}

## OUTPUT FORMAT:

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):

{
  "quiz": {
    "title": "Quiz title based on PDF content",
    "totalQuestions": ${totalQuestions},
    "questions": [
      ${quizTypes.mcq ? `{
        "id": 1,
        "type": "mcq",
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option A",
        "explanation": "Detailed explanation",
        "marks": 1
      },` : ''}
      ${quizTypes.saq ? `{
        "id": 2,
        "type": "saq",
        "question": "Question text here?",
        "correctAnswer": "Expected answer in 2-3 sentences",
        "explanation": "Additional context",
        "marks": 2
      },` : ''}
      ${quizTypes.laq ? `{
        "id": 3,
        "type": "laq",
        "question": "Question text here?",
        "correctAnswer": "Expected detailed answer",
        "explanation": "Additional context",
        "marks": 5
      }` : ''}
    ]
  }
}

## IMPORTANT GUIDELINES:

1. Questions MUST be based ONLY on content from the PDF
2. For MCQs: All 4 options should be plausible, only ONE correct
3. For SAQs: Require 2-3 sentence answers
4. For LAQs: Require detailed multi-paragraph answers
5. Include clear explanations for learning
6. Return ONLY valid JSON, no markdown formatting

Generate the quiz now.`;
}
