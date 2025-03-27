import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import dynamic from 'next/dynamic';
import { FiClock, FiMapPin, FiNavigation, FiRefreshCw, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

// Dynamically import the map components to avoid SSR issues
const RideMap = dynamic(() => import('@/components/RideMap'), { ssr: false });
const RideMapIndia = dynamic(() => import('@/components/RideMapIndia'), { ssr: false });

// Sample active ride data
const sampleActiveRide = {
  id: 'RID-123456',
  type: 'SUV',
  origin: 'Delhi Metro Station',
  destination: 'Mumbai Central',
  departureTime: '14:30',
  estimatedArrival: '15:45',
  status: 'in-progress', // 'scheduled', 'in-progress', 'completed', 'cancelled'
  routeCoordinates: Array(100).fill(0).map((_, i) => [
    -122.4194 + (i * 0.001),
    37.7749 + (i * 0.0005)
  ]),
  currentPosition: 35, // index in routeCoordinates array
  distance: '18.5 km',
  travelTime: '75 min',
  stops: [
    { id: 1, name: 'Delhi Metro Station', time: '14:30', status: 'completed' },
    { id: 2, name: 'Gurgaon Toll', time: '14:55', status: 'completed' },
    { id: 3, name: 'Jaipur City Center', time: '15:20', status: 'upcoming' },
    { id: 4, name: 'Mumbai Central', time: '15:45', status: 'upcoming' }
  ]
};

const TrackingPage = () => {
  const [activeRide, setActiveRide] = useState(sampleActiveRide);
  const [refreshing, setRefreshing] = useState(false);
  const [showRideInfo, setShowRideInfo] = useState(true);
  const [mapRegion, setMapRegion] = useState<'india' | 'usa'>('india');

  // Simulate real-time updates to the vehicle's position
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeRide.currentPosition < activeRide.routeCoordinates.length - 1) {
        setActiveRide(prev => ({
          ...prev,
          currentPosition: prev.currentPosition + 1,
          estimatedArrival: updateEstimatedArrival(prev.currentPosition + 1, prev.routeCoordinates.length)
        }));
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [activeRide.currentPosition, activeRide.routeCoordinates.length]);

  const updateEstimatedArrival = (current: number, total: number) => {
    // Simple simulation of updating the ETA
    const remaining = total - current;
    const minutes = Math.floor(remaining / 10) * 5;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    const now = new Date();
    now.setHours(now.getHours() + hours);
    now.setMinutes(now.getMinutes() + mins);
    
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate an API call to refresh the ride status
    setTimeout(() => {
      setRefreshing(false);
      // Here we would normally update with fresh data from the backend
    }, 1500);
  };

  const toggleRideInfo = () => {
    setShowRideInfo(!showRideInfo);
  };

  const toggleMapRegion = () => {
    setMapRegion(prev => prev === 'india' ? 'usa' : 'india');
  };

  return (
    <Layout title="Live Tracking">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Live Tracking</h1>
          <div className="flex space-x-3">
            <button
              onClick={toggleMapRegion}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {mapRegion === 'india' ? 'Switch to USA Map' : 'Switch to India Map'}
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-indigo-600 rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors flex items-center"
              disabled={refreshing}
            >
              <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md h-[500px] overflow-hidden">
            {mapRegion === 'india' ? (
              <RideMapIndia 
                routeCoordinates={activeRide.routeCoordinates}
                currentPosition={activeRide.currentPosition}
              />
            ) : (
              <RideMap 
                routeCoordinates={activeRide.routeCoordinates}
                currentPosition={activeRide.currentPosition}
              />
            )}
          </div>

          {/* Ride Information */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-indigo-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ride #{activeRide.id}</h2>
                <button 
                  onClick={toggleRideInfo}
                  className="text-white p-1 hover:bg-indigo-700 rounded-full transition-colors"
                  aria-label={showRideInfo ? "Hide ride information" : "Show ride information"}
                >
                  {showRideInfo ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex items-center">
                  <FiNavigation className="mr-2" />
                  <span>{activeRide.status === 'in-progress' ? 'In Progress' : activeRide.status}</span>
                </div>
                <span className="text-sm bg-indigo-500 px-2 py-1 rounded">{activeRide.type}</span>
              </div>
            </div>
            
            {showRideInfo && (
              <>
                <div className="p-4 border-b">
                  <div className="flex items-start mb-3">
                    <FiMapPin className="text-green-500 mt-1 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Origin</p>
                      <p className="font-medium">{activeRide.origin}</p>
                      <p className="text-sm text-gray-700">{activeRide.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="text-red-500 mt-1 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{activeRide.destination}</p>
                      <p className="text-sm text-gray-700">ETA: {activeRide.estimatedArrival}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-medium">{activeRide.distance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Travel Time</p>
                    <p className="font-medium">{activeRide.travelTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="font-medium">
                      {Math.round((activeRide.currentPosition / activeRide.routeCoordinates.length) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Stops</h3>
                  <div className="space-y-4">
                    {activeRide.stops.map((stop) => (
                      <div key={stop.id} className="flex items-start">
                        <div className={`mt-1 mr-3 h-4 w-4 rounded-full ${
                          stop.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{stop.name}</p>
                          <p className="text-sm text-gray-500">{stop.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          stop.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {stop.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackingPage; 