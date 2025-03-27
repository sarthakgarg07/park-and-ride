import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiCreditCard, 
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiActivity,
  FiTruck,
  FiMap
} from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  // Load user data from localStorage
  useEffect(() => {
    try {
      // Get user data from localStorage
      const storedUser = localStorage.getItem('parkAndRideUser');
      if (!storedUser) {
        // Not logged in, redirect to simple login
        window.location.href = '/simple-login';
        return;
      }

      // Parse to verify it's valid
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.isLoggedIn) {
        // Invalid user data, redirect to simple login
        window.location.href = '/simple-login';
        return;
      }
      
      // Prepare user data for display
      setUserData({
        name: parsedUser.name,
        email: parsedUser.email,
        joined: 'January 2023',
        plan: 'Commuter',
        credits: 125,
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        upcomingBookings: [
          {
            id: 'PKG-3845',
            type: 'Parking',
            location: 'Delhi Metro Rajiv Chowk',
            date: 'Today',
            time: '08:00 AM - 06:00 PM',
            status: 'Confirmed'
          },
          {
            id: 'RD-2947',
            type: 'Ride',
            location: 'Mumbai Airport T2',
            date: 'Tomorrow',
            time: '08:30 AM',
            status: 'Scheduled'
          }
        ],
        recentActivity: [
          {
            id: 'PKG-3840',
            type: 'Parking',
            location: 'Bangalore MG Road Metro',
            date: 'Yesterday',
            time: '09:00 AM - 05:00 PM',
            status: 'Completed',
            cost: 300.00
          },
          {
            id: 'RD-2941',
            type: 'Ride',
            location: 'Chennai Central to Marina Beach',
            date: '2 days ago',
            time: '10:30 AM',
            status: 'Completed',
            cost: 125.50
          },
          {
            id: 'PAY-9372',
            type: 'Payment',
            description: 'Monthly subscription',
            date: '5 days ago',
            amount: 999.00,
            status: 'Processed'
          }
        ],
        stats: {
          totalBookings: 47,
          savedCO2: '342 kg',
          favoriteLocation: 'Delhi Metro Rajiv Chowk',
          moneySaved: '₹2,350'
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      // On error, redirect to login
      window.location.href = '/simple-login';
    }
  }, []);

  // If still loading or no user data, show loading state
  if (isLoading || !userData) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }
  
  // Function for consistent navigation
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };
  
  // Create a custom logout function
  const handleLogout = () => {
    try {
      // Clear auth data
      localStorage.removeItem('parkAndRideUser');
      
      // Redirect to the home page
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render the sidebar navigation
  const renderSidebar = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image 
              src={userData.profileImage}
              alt={userData.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{userData.name}</h3>
            <p className="text-sm text-gray-500">{userData.plan} Plan</p>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'overview'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiActivity className="mr-3 h-5 w-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'bookings'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiCalendar className="mr-3 h-5 w-5" />
            My Bookings
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'payments'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiCreditCard className="mr-3 h-5 w-5" />
            Payments
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              activeTab === 'settings'
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FiSettings className="mr-3 h-5 w-5" />
            Settings
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
        >
          <FiLogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  // Render the overview tab content
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-primary-100 rounded-md p-2 mr-4">
              <FiCalendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <h3 className="text-xl font-bold text-gray-900">{userData.stats.totalBookings}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-md p-2 mr-4">
              <FiTruck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">CO2 Saved</p>
              <h3 className="text-xl font-bold text-gray-900">{userData.stats.savedCO2}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-md p-2 mr-4">
              <FiMap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Favorite Location</p>
              <h3 className="text-xl font-bold text-gray-900">{userData.stats.favoriteLocation}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-md p-2 mr-4">
              <FiCreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Money Saved</p>
              <h3 className="text-xl font-bold text-gray-900">{userData.stats.moneySaved}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming bookings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userData.upcomingBookings.map((booking) => (
            <div key={booking.id} className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-full p-2 ${
                    booking.type === 'Parking' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {booking.type === 'Parking' ? (
                      <FiMapPin className={`h-5 w-5 ${
                        booking.type === 'Parking' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <FiTruck className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{booking.location}</p>
                      <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {booking.id}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{booking.date} · {booking.time}</p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        booking.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleNavigation(`/booking/${booking.id}`)}
                    className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    View Details
                    <FiChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <button 
            onClick={() => handleNavigation('/book-parking')}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Book a new parking spot
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {userData.recentActivity.map((activity, index) => (
            <div key={index} className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-start space-x-4">
                  <div className={`rounded-full p-2 ${
                    activity.type === 'Parking' ? 'bg-blue-100' : 
                    activity.type === 'Ride' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'Parking' ? (
                      <FiMapPin className="h-5 w-5 text-blue-600" />
                    ) : activity.type === 'Ride' ? (
                      <FiTruck className="h-5 w-5 text-green-600" />
                    ) : (
                      <FiCreditCard className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <div>
                    {activity.type === 'Payment' ? (
                      <>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {activity.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">${activity.amount.toFixed(2)}</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900">{activity.location}</p>
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {activity.id}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{activity.date} · {activity.time}</p>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                            {activity.status}
                          </span>
                          <span className="ml-2 text-sm font-medium text-gray-900">${activity.cost?.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render the bookings tab content
  const renderBookings = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">All Bookings</h2>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm py-1 px-3">Filter</button>
          <button className="btn-secondary text-sm py-1 px-3">Export</button>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-500 text-center py-8">
          Your past and upcoming bookings will appear here.
          <br />
          <button 
            onClick={() => handleNavigation('/book-parking')}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Book a new parking spot
          </button>
          {' or '}
          <button 
            onClick={() => handleNavigation('/book-ride')}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            schedule a ride
          </button>
        </p>
      </div>
    </div>
  );

  // Render the payments tab content
  const renderPayments = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Subscription Details</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-gray-900">{userData.plan} Plan</h3>
              <p className="text-sm text-gray-500">Renews on May 15, 2023</p>
            </div>
            <button className="btn-secondary text-sm">Change Plan</button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Available Credits</p>
              <p className="text-2xl font-bold text-gray-900">{userData.credits}</p>
            </div>
            <button className="btn-primary text-sm">Add Credits</button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
          <button className="btn-secondary text-sm">Add New</button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between border rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded p-2 mr-4">
                <FiCreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-500">Expires 04/24</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                Default
              </span>
              <button className="text-gray-400 hover:text-gray-500">
                <FiSettings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Monthly subscription</p>
              <p className="text-sm text-gray-500">Apr 15, 2023</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">₹999.00</p>
              <button 
                onClick={() => handleNavigation('#')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Download receipt
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Credit refill (100 credits)</p>
              <p className="text-sm text-gray-500">Apr 3, 2023</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">₹499.00</p>
              <button 
                onClick={() => handleNavigation('#')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Download receipt
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Monthly subscription</p>
              <p className="text-sm text-gray-500">Mar 15, 2023</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">₹999.00</p>
              <button 
                onClick={() => handleNavigation('#')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Download receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the settings tab content
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
              <Image 
                src={userData.profileImage} 
                alt={userData.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <button className="btn-secondary text-sm">Change Photo</button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="input-field mt-1"
                defaultValue={userData.name}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="input-field mt-1"
                defaultValue={userData.email}
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="input-field mt-1"
                defaultValue="+91 98765 43210"
              />
            </div>
            
            <div className="pt-4">
              <button className="btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Booking confirmations</p>
                <p className="text-sm text-gray-500">Receive emails when your booking is confirmed</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle1" className="sr-only" defaultChecked />
                <label htmlFor="toggle1" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white shadow transform translate-x-4"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Ride reminders</p>
                <p className="text-sm text-gray-500">Get notified before your scheduled ride</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle2" className="sr-only" defaultChecked />
                <label htmlFor="toggle2" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white shadow transform translate-x-4"></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Promotional emails</p>
                <p className="text-sm text-gray-500">Receive special offers and updates</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input type="checkbox" id="toggle3" className="sr-only" />
                <label htmlFor="toggle3" className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
                  <span className="block h-6 w-6 rounded-full bg-white shadow"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Password & Security</h2>
        </div>
        <div className="p-6">
          <button className="btn-secondary">Change Password</button>
        </div>
      </div>
    </div>
  );

  // Render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookings':
        return renderBookings();
      case 'payments':
        return renderPayments();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>
        
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Sidebar */}
          {renderSidebar()}
          
          {/* Main content */}
          <div className="flex-grow">
            {renderContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage; 