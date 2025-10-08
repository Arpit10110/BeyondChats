'use client';

import React from 'react';
import ChatLayout from '@/components/chat/ChatLayout';
import { useRouter, useParams } from 'next/navigation';

export default function ChatSessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const handleSessionChange = (newSessionId: string) => {
    router.push(`/chat/${newSessionId}`);
  };

  return (
    <ChatLayout 
      sessionId={sessionId} 
      onSessionChange={handleSessionChange}
    />
  );
}
