'use client';

import React, { useState } from 'react';

interface QuizFormData {
  pdfSource: 'dropdown' | 'upload' | null;
  selectedPdf: string;
  uploadedFile: File | null;
  quizTypes: {
    mcq: boolean;
    saq: boolean;
    laq: boolean;
  };
  numberOfQuestions: {
    mcq: number;
    saq: number;
    laq: number;
  };
}

const preloadedPDFs = [
  { value: '/pdfs/ncert/physics-part-1-ch1.pdf', label: 'Physics Part 1 - Chapter 1' },
  { value: '/pdfs/ncert/physics-part-1-ch2.pdf', label: 'Physics Part 1 - Chapter 2' },
  { value: '/pdfs/ncert/physics-part-1-ch3.pdf', label: 'Physics Part 1 - Chapter 3' },
];

interface QuizFormProps {
  onSubmit: (formData: QuizFormData, pdfUrl: string) => void;
  onPdfChange: (pdfUrl: string) => void;
}

export default function QuizForm({ onSubmit, onPdfChange }: QuizFormProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    pdfSource: null,
    selectedPdf: '',
    uploadedFile: null,
    quizTypes: {
      mcq: false,
      saq: false,
      laq: false,
    },
    numberOfQuestions: {
      mcq: 5,
      saq: 3,
      laq: 2,
    },
  });

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handlePdfSelect = (value: string) => {
    setFormData({
      ...formData,
      pdfSource: 'dropdown',
      selectedPdf: value,
      uploadedFile: null,
    });
    setPdfPreviewUrl(value);
    onPdfChange(value);
    setError('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      setFormData({
        ...formData,
        pdfSource: 'upload',
        uploadedFile: file,
        selectedPdf: '',
      });

      const fileUrl = URL.createObjectURL(file);
      setPdfPreviewUrl(fileUrl);
      onPdfChange(fileUrl);
      setError('');
    }
  };

  const handleQuizTypeToggle = (type: 'mcq' | 'saq' | 'laq') => {
    setFormData({
      ...formData,
      quizTypes: {
        ...formData.quizTypes,
        [type]: !formData.quizTypes[type],
      },
    });
  };

  // FIXED: Allow backspace and direct input
  const handleQuestionCountChange = (type: 'mcq' | 'saq' | 'laq', value: string) => {
    // If empty, allow it (user is clearing/typing)
    if (value === '') {
      setFormData({
        ...formData,
        numberOfQuestions: {
          ...formData.numberOfQuestions,
          [type]: 0,
        },
      });
      return;
    }

    const numValue = parseInt(value, 10);
    
    // Only update if it's a valid number
    if (!isNaN(numValue)) {
      setFormData({
        ...formData,
        numberOfQuestions: {
          ...formData.numberOfQuestions,
          [type]: Math.max(1, Math.min(20, numValue)),
        },
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.pdfSource) {
      setError('Please select or upload a PDF');
      return;
    }

    if (!formData.quizTypes.mcq && !formData.quizTypes.saq && !formData.quizTypes.laq) {
      setError('Please select at least one quiz type');
      return;
    }

    // Validate that all selected quiz types have valid question counts
    if (formData.quizTypes.mcq && formData.numberOfQuestions.mcq < 1) {
      setError('Please enter number of MCQ questions (1-20)');
      return;
    }
    if (formData.quizTypes.saq && formData.numberOfQuestions.saq < 1) {
      setError('Please enter number of SAQ questions (1-20)');
      return;
    }
    if (formData.quizTypes.laq && formData.numberOfQuestions.laq < 1) {
      setError('Please enter number of LAQ questions (1-20)');
      return;
    }

    console.log('=== QUIZ CONFIGURATION ===');
    console.log('PDF Source:', formData.pdfSource);
    console.log('Selected PDF:', formData.selectedPdf);
    console.log('Uploaded File:', formData.uploadedFile?.name);
    console.log('Quiz Types:', formData.quizTypes);
    console.log('Number of Questions:', formData.numberOfQuestions);
    console.log('PDF Preview URL:', pdfPreviewUrl);
    console.log('========================');

    onSubmit(formData, pdfPreviewUrl);
  };

  const handleRemoveFile = () => {
    setFormData({
      ...formData,
      pdfSource: null,
      uploadedFile: null,
      selectedPdf: '',
    });
    setPdfPreviewUrl('');
    onPdfChange('');
  };

  return (
    <div className="bg-gray-100 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configure Your Quiz 📝</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Step 1: Select PDF Source</h3>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <select
              value={formData.pdfSource === 'dropdown' ? formData.selectedPdf : ''}
              onChange={(e) => handlePdfSelect(e.target.value)}
              disabled={formData.pdfSource === 'upload'}
              className="w-full h-14 px-4 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Choose from Library</option>
              {preloadedPDFs.map((pdf) => (
                <option key={pdf.value} value={pdf.value}>
                  📄 {pdf.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className={`flex items-center justify-center h-14 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              formData.pdfSource === 'dropdown' 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
            }`}>
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Your PDF
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={formData.pdfSource === 'dropdown'}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {formData.uploadedFile && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-500">📄</span>
              <span className="text-sm text-gray-700">{formData.uploadedFile.name}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {(formData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-700 mb-3">Step 2: Select Quiz Types</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* MCQ */}
          <div
            onClick={() => handleQuizTypeToggle('mcq')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              formData.quizTypes.mcq
                ? 'border-2 border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-2 border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <h4 className="text-lg font-semibold mb-1">MCQ 🎯</h4>
            <p className="text-sm text-gray-600 mb-3">Multiple Choice</p>
            {formData.quizTypes.mcq && (
              <div onClick={(e) => e.stopPropagation()}>
                <label className="block text-xs text-gray-600 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={formData.numberOfQuestions.mcq || ''}
                  onChange={(e) => handleQuestionCountChange('mcq', e.target.value)}
                  min="1"
                  max="20"
                  placeholder="1-20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* SAQ */}
          <div
            onClick={() => handleQuizTypeToggle('saq')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              formData.quizTypes.saq
                ? 'border-2 border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-2 border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <h4 className="text-lg font-semibold mb-1">SAQ ✍️</h4>
            <p className="text-sm text-gray-600 mb-3">Short Answer</p>
            {formData.quizTypes.saq && (
              <div onClick={(e) => e.stopPropagation()}>
                <label className="block text-xs text-gray-600 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={formData.numberOfQuestions.saq || ''}
                  onChange={(e) => handleQuestionCountChange('saq', e.target.value)}
                  min="1"
                  max="20"
                  placeholder="1-20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* LAQ */}
          <div
            onClick={() => handleQuizTypeToggle('laq')}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              formData.quizTypes.laq
                ? 'border-2 border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-2 border-gray-200 hover:border-indigo-300 hover:shadow-sm'
            }`}
          >
            <h4 className="text-lg font-semibold mb-1">LAQ 📝</h4>
            <p className="text-sm text-gray-600 mb-3">Long Answer</p>
            {formData.quizTypes.laq && (
              <div onClick={(e) => e.stopPropagation()}>
                <label className="block text-xs text-gray-600 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={formData.numberOfQuestions.laq || ''}
                  onChange={(e) => handleQuestionCountChange('laq', e.target.value)}
                  min="1"
                  max="20"
                  placeholder="1-20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
      >
        Generate Quiz 🚀
      </button>
    </div>
  );
}
