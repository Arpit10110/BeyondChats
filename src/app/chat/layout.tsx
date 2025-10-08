import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat - QuizMind',
  description: 'Chat with AI about your coursebooks',
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
