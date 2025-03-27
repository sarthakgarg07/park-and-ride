import { useState, useEffect } from 'react';
import Link from 'next/link';

const ClearAuthPage = () => {
  const [authData, setAuthData] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Get current auth data
        const storedAuth = localStorage.getItem('parkAndRideUser');
        setAuthData(storedAuth ? JSON.parse(storedAuth) : null);
        
        // Get registered users
        const storedUsers = localStorage.getItem('parkAndRideUsers');
        setUsers(storedUsers ? JSON.parse(storedUsers) : []);
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
    }
  }, []);

  const clearAuth = () => {
    try {
      localStorage.removeItem('parkAndRideUser');
      setAuthData(null);
      setMessage('Auth data cleared! You can now try logging in again.');
    } catch (error) {
      console.error('Error clearing auth data:', error);
      setMessage('Failed to clear auth data: ' + error);
    }
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('parkAndRideUser');
      localStorage.removeItem('parkAndRideUsers');
      setAuthData(null);
      setUsers([]);
      setMessage('All auth data cleared! You can register a new account.');
    } catch (error) {
      console.error('Error clearing all data:', error);
      setMessage('Failed to clear all data: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Auth Utility</h1>
        
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
            {message}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Auth Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-48">
            {JSON.stringify(authData, null, 2) || 'No auth data found'}
          </pre>
          
          <div className="mt-4">
            <button 
              onClick={clearAuth}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Auth Data
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-48">
            {JSON.stringify(users, null, 2) || 'No registered users found'}
          </pre>
          
          <div className="mt-4">
            <button 
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear All Auth Data
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/login" className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Go to Login
          </Link>
          <Link href="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClearAuthPage; 