import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiUser, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import Image from 'next/image';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    // Redirect to the simple login page which works better
    router.push('/simple-login');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulate auth delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isLogin) {
        // DEMO ACCOUNT - hardcoded for reliability
        if (email === 'user@example.com' && password === 'password') {
          const demoUser = {
            name: 'Alex Johnson',
            email: 'user@example.com',
            isLoggedIn: true
          };
          
          // Store user in localStorage and redirect
          localStorage.setItem('parkAndRideUser', JSON.stringify(demoUser));
          router.push('/dashboard');
          return;
        }
        
        try {
          // Try to get registered users
          const storedUsersStr = localStorage.getItem('parkAndRideUsers');
          
          if (!storedUsersStr) {
            setError('Invalid credentials. Use demo account: user@example.com / password');
            return;
          }
          
          const users = JSON.parse(storedUsersStr);
          
          // Find matching user
          const user = users.find((u: any) => 
            u.email === email && u.password === password
          );
          
          if (user) {
            // Store logged in user and redirect
            localStorage.setItem('parkAndRideUser', JSON.stringify({
              name: user.name,
              email: user.email,
              isLoggedIn: true
            }));
            router.push('/dashboard');
          } else {
            setError('Invalid credentials. Use demo account: user@example.com / password');
          }
        } catch (err) {
          console.error('Login error:', err);
          setError('Login failed. Try demo account: user@example.com / password');
        }
      } else {
        // REGISTRATION
        try {
          // Get existing users or create empty array
          const storedUsersStr = localStorage.getItem('parkAndRideUsers');
          const users = storedUsersStr ? JSON.parse(storedUsersStr) : [];
          
          // Check if email already exists
          if (users.some((u: any) => u.email === email)) {
            setError('This email is already registered. Please sign in instead.');
            return;
          }
          
          // Add new user
          const newUser = { name, email, password };
          users.push(newUser);
          
          // Save updated users list
          localStorage.setItem('parkAndRideUsers', JSON.stringify(users));
          
          // Log in the new user
          localStorage.setItem('parkAndRideUser', JSON.stringify({
            name,
            email,
            isLoggedIn: true
          }));
          
          // Redirect to dashboard
          router.push('/dashboard');
        } catch (err) {
          console.error('Registration error:', err);
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Taking you to the login page</p>
      </div>
    </div>
  );
};

export default LoginPage; 