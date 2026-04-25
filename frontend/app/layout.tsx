import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TaskGuard - Secure Task Management',
  description: 'A secure task management system with user authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
