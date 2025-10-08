'use client';

import React from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();

  const handleSessionChange = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  return (
    <ChatLayout 
      sessionId={null} 
      onSessionChange={handleSessionChange}
    />
  );
}
