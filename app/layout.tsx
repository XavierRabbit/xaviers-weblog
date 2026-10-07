import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';

export const metadata: Metadata = {
  title: "Xavier's Weblog",
  description: "Personal digital garden and weblog.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text-light min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}