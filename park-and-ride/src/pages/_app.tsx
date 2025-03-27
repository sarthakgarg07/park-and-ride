import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Pages that don't require authentication
const publicPages = ['/login', '/', '/pricing'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Simple redirect for authentication
  const checkAuthAndRedirect = () => {
    // Skip auth check for public pages
    if (publicPages.includes(router.pathname)) {
      return <Component {...pageProps} />;
    }

    // For pages requiring auth, the individual page will handle the redirect
    return <Component {...pageProps} />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Head>
        <title>Park & Ride | Modern Transportation Solution</title>
        <meta name="description" content="A modern park and ride booking system with real-time tracking" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {checkAuthAndRedirect()}
    </AuthProvider>
  );
} 