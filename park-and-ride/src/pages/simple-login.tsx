import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const SimpleLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [savedUsers, setSavedUsers] = useState<any[]>([]);
  const router = useRouter();

  // Check if we were redirected from logout
  useEffect(() => {
    if (router.query.from === 'logout') {
      setStatus('You have been signed out successfully.');
    }
    
    // Load saved users
    try {
      const users = localStorage.getItem('parkAndRideUsers');
      if (users) {
        setSavedUsers(JSON.parse(users));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [router.query]);

  const handleLogin = () => {
    setStatus('Attempting login...');
    
    // Basic demo account
    if (email === 'demo@example.com' && password === 'demo123') {
      try {
        // Create simple user object
        const user = {
          name: 'Demo User',
          email: 'demo@example.com',
          isLoggedIn: true
        };
        
        // Store in localStorage
        localStorage.setItem('parkAndRideUser', JSON.stringify(user));
        setStatus('Login successful! Redirecting...');
        
        // Use more direct redirect method
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
        return;
      } catch (error) {
        setStatus('Error storing auth: ' + error);
        return;
      }
    }

    // Check for registered users
    try {
      const users = localStorage.getItem('parkAndRideUsers');
      if (users) {
        const parsedUsers = JSON.parse(users);
        const user = parsedUsers.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          // Login successful
          localStorage.setItem('parkAndRideUser', JSON.stringify({
            name: user.name,
            email: user.email,
            isLoggedIn: true
          }));
          
          setStatus('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
          return;
        }
      }
      
      setStatus('Invalid login. Use demo@example.com / demo123 or register a new account.');
    } catch (error) {
      setStatus('Error during login: ' + error);
    }
  };
  
  const handleRegister = () => {
    setStatus('Registering new user...');
    
    if (!name || !email || !password) {
      setStatus('Please fill in all fields');
      return;
    }
    
    try {
      // Get existing users or create empty array
      const usersStr = localStorage.getItem('parkAndRideUsers');
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        setStatus('An account with this email already exists');
        return;
      }
      
      // Add new user
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('parkAndRideUsers', JSON.stringify(users));
      setSavedUsers(users);
      
      // Auto login
      localStorage.setItem('parkAndRideUser', JSON.stringify({
        name,
        email,
        isLoggedIn: true
      }));
      
      setStatus('Registration successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      setStatus('Error during registration: ' + error);
    }
  };
  
  const clearStorage = () => {
    try {
      localStorage.clear();
      setSavedUsers([]);
      setStatus('Local storage cleared');
    } catch (error) {
      setStatus('Error clearing storage: ' + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? 'Create Account' : 'Simple Login'}
        </h1>
        
        {status && (
          <div className="mb-4 p-2 bg-blue-100 border border-blue-300 text-blue-800 rounded">
            {status}
          </div>
        )}
        
        <div className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded" 
                placeholder="Your name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded" 
              placeholder={isRegister ? "Your email" : "demo@example.com"}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded" 
              placeholder={isRegister ? "Create password" : "demo123"}
            />
            {!isRegister && (
              <p className="text-sm text-gray-500 mt-1">Use demo@example.com / demo123</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={isRegister ? handleRegister : handleLogin}
              className="w-full p-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
            <button
              onClick={clearStorage}
              className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage
            </button>
          </div>
          
          <div className="mt-2 text-center">
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary-600 hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
          
          {savedUsers.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium text-gray-700 mb-2">Registered Users:</h3>
              <div className="text-sm bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                {savedUsers.map((user, index) => (
                  <div key={index} className="mb-1 pb-1 border-b border-gray-200 last:border-0">
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginPage; 