import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FiMapPin, 
  FiClock, 
  FiStar, 
  FiShield, 
  FiSmartphone, 
  FiDollarSign, 
  FiMap, 
  FiCalendar,
  FiCar
} from 'react-icons/fi';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Function for consistent navigation
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  // We're removing the automatic redirect to dashboard
  // This allows logged-in users to still visit the home page
  // useEffect(() => {
  //   // If user is already logged in, redirect to dashboard
  //   if (!isLoading && user) {
  //     window.location.href = '/dashboard';
  //   }
  // }, [user, isLoading, router]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center md:flex-row">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Commuting Made Easy
            </h1>
            <p className="text-lg text-gray-100 mb-8">
              Book parking spaces and rides in one place. Track your transportation in real-time and enjoy a seamless commuting experience.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => handleNavigation('/book-parking')} className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
                Book Parking
              </button>
              <button onClick={() => handleNavigation('/book-ride')} className="btn-secondary bg-transparent border-white text-white hover:bg-primary-600">
                Book Ride
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-64 md:h-96 w-full">
            {/* In a production app, we'd have an actual image here */}
            <div className="absolute inset-0 rounded-lg bg-primary-600 opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiMap className="h-24 w-24 text-white opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Show login status or dashboard link */}
      {user && (
        <div className="bg-primary-50 py-3 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="text-primary-800">
              Welcome back, {user.name}!
            </p>
            <button 
              onClick={() => handleNavigation('/dashboard')}
              className="text-primary-600 font-medium hover:text-primary-800"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Park & Ride
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our modern platform offers everything you need for a stress-free commuting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiMapPin className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Convenient Booking</h3>
              <p className="text-gray-600">
                Book parking spaces and rides in advance with just a few taps. No more searching for parking or waiting for transportation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiMap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Track your transportation in real-time and get accurate ETAs. Know exactly when your ride will arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiDollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                Clear and upfront pricing with no hidden fees. Pay only for what you use with various payment options.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiCalendar className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book for now or schedule rides and parking for later. Our system accommodates your changing plans.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiSmartphone className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Offline Support</h3>
              <p className="text-gray-600">
                Access your bookings even when offline. Our app works without an internet connection for critical functions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <FiShield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your data and payments are secure with us. Enjoy peace of mind with our reliable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started with Park & Ride is simple. Follow these easy steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Service</h3>
              <p className="text-gray-600">
                Select whether you need parking, a ride, or both for your journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Book & Pay</h3>
              <p className="text-gray-600">
                Reserve your spot or ride and complete payment securely through the app.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Enjoy Your Journey</h3>
              <p className="text-gray-600">
                Track your transportation in real-time and enjoy a stress-free commuting experience.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <button onClick={() => handleNavigation('/book-parking')} className="btn-primary">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our users think about Park & Ride:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Park & Ride has completely transformed my daily commute. I save so much time by booking my parking spot in advance and tracking my bus in real-time."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Michael Chen</h4>
                  <div className="flex text-yellow-400">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "The offline functionality is a game changer. Even when I'm in areas with poor reception, I can still access my tickets and boarding passes."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-gray-900">Emily Rodriguez</h4>
                  <div className="flex text-yellow-400">
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                    <FiStar className="fill-current" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "I love the detailed dashboards that show my commuting patterns and expenses. It's helped me optimize my travel and save money in the long run."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-lg text-gray-100 mb-8 max-w-3xl mx-auto">
            Join thousands of happy commuters who have switched to Park & Ride for a smoother, more efficient journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => handleNavigation('/book-parking')} className="btn-primary bg-white text-primary-700 hover:bg-gray-100">
              Book Parking
            </button>
            <button onClick={() => handleNavigation('/book-ride')} className="btn-secondary bg-transparent border-white text-white hover:bg-primary-600">
              Book Ride
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
} 