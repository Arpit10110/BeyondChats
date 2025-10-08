'use client';

import { useState } from 'react';
import WelcomeModal from '@/components/WelcomeModal';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  const handleUserRegistered = (id: string, name: string) => {
    setUserId(id);
    setUserName(name);
    window.dispatchEvent(new Event('storage'));
  };

  const cards = [
    {
      title: 'Start Quiz',
      description: 'Generate quizzes from your PDFs and test your knowledge',
      path: '/quizzes',
      gradient: 'from-purple-500 to-purple-700',
      emoji: '📝',
    },
    {
      title: 'Saved Quizzes',
      description: 'Continue where you left off or review completed quizzes',
      path: '/savedquiz',
      gradient: 'from-pink-500 to-red-500',
      emoji: '📚',
    },
    {
      title: 'Chat with AI',
      description: 'Ask questions about your coursebooks and get instant answers',
      path: '/chat',
      gradient: 'from-blue-500 to-cyan-400',
      emoji: '💬',
    },
    {
      title: 'View Progress',
      description: 'Track your learning journey and see your improvements',
      path: '/progress',
      gradient: 'from-green-500 to-teal-400',
      emoji: '📊',
    },
  ];

  return (
    <>
      <WelcomeModal onUserRegistered={handleUserRegistered} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Header */}
        {userId && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Ready to start learning? Choose an option below
            </p>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => router.push(card.path)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 p-6"
            >
              {/* Gradient Icon Background */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-4xl mb-6 mx-auto`}>
                {card.emoji}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Tip Section */}
        {userId && (
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              💡 Quick Tip
            </h3>
            <p className="text-gray-600 text-lg">
              Upload your coursebook PDFs to generate custom quizzes or chat with AI to get instant explanations!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
