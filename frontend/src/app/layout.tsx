import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sourav | Linux Portfolio OS',
  description: 'Sourav\'s interactive Linux OS portfolio - explore projects, skills, and more through a fully functional desktop environment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
