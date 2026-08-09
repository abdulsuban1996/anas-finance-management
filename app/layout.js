import './globals.css';
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: 'আনাস ফাইনান্সিয়াল ম্যানেজমেন্ট সিস্টেম',
  description: 'Personal and Business Financial Tracker for Anas',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Anas Finance',
  },
};

export const viewport = {
  themeColor: '#0D5C46',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="antialiased touch-manipulation">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
