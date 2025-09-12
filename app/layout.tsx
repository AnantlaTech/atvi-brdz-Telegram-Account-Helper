import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BRDZ Assistant Profile',
  description: 'Manage your BRDZ Telegram Bot Support profile',
  icons: {
    icon: '/BRDZ Shpper.png',
    shortcut: '/BRDZ Shpper.png',
    apple: '/BRDZ Shpper.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/BRDZ Shpper.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}