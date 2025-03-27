import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  FiClock, 
  FiMapPin, 
  FiCalendar, 
  FiUsers, 
  FiChevronDown, 
  FiChevronUp,
  FiCreditCard,
  FiTag
} from 'react-icons/fi';
import RideMap from '@/components/RideMap';

// Indian ride service data
const rideTypes = [
  { id: 1, name: 'Auto Rickshaw', capacity: 3, price: 15, icon: '🛺', time: '25-30 min' },
  { id: 2, name: 'Hatchback', capacity: 4, price: 20, icon: '🚗', time: '20-25 min' },
  { id: 3, name: 'Sedan', capacity: 4, price: 22, icon: '🚘', time: '20-25 min' },
  { id: 4, name: 'SUV', capacity: 6, price: 25, icon: '🚙', time: '20-25 min' },
  { id: 5, name: 'Electric Car', capacity: 4, price: 18, icon: '⚡🚗', time: '20-25 min' },
];

// Indian cities and locations
const popularDestinations = [
  'Delhi Railway Station',
  'Mumbai Airport T2',
  'Bangalore Electronic City',
  'Chennai Marina Beach',
  'Hyderabad Charminar',
  'Kolkata Victoria Memorial',
  'Pune University',
  'Jaipur City Palace'
];

const BookRidePage = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [selectedRideType, setSelectedRideType] = useState<number | null>(null);
  const [isRideTypeOpen, setIsRideTypeOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchingFor, setIsSearchingFor] = useState<'pickup' | 'drop' | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  
  // Sample estimated distance (km) and fare (rupees) calculation
  useEffect(() => {
    if (pickupLocation && dropLocation && selectedRideType !== null) {
      // In a real app, this would be calculated based on actual addresses using Maps API
      // For this demo, we'll use a random distance between 5-15 km
      const estimatedDistance = Math.floor(Math.random() * 10) + 5;
      setDistance(estimatedDistance);
      
      // Calculate fare based on ride type and distance
      const selectedRide = rideTypes.find(ride => ride.id === selectedRideType);
      if (selectedRide) {
        const baseFare = selectedRide.price;
        const distanceFare = estimatedDistance * baseFare;
        const totalFare = Math.round(distanceFare);
        setFare(totalFare);
      }
    } else {
      setDistance(null);
      setFare(null);
    }
  }, [pickupLocation, dropLocation, selectedRideType]);
  
  // Search for locations as user types
  const handleLocationSearch = (searchTerm: string, type: 'pickup' | 'drop') => {
    if (type === 'pickup') {
      setPickupLocation(searchTerm);
    } else {
      setDropLocation(searchTerm);
    }
    
    setIsSearchingFor(type);
    
    if (searchTerm.length > 2) {
      // Filter popular destinations based on search term
      const results = popularDestinations.filter(
        location => location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  // Select a suggested location
  const selectLocation = (location: string) => {
    if (isSearchingFor === 'pickup') {
      setPickupLocation(location);
    } else if (isSearchingFor === 'drop') {
      setDropLocation(location);
    }
    setSearchResults([]);
    setIsSearchingFor(null);
  };
  
  // Handle ride booking
  const handleBookRide = () => {
    // In a real app, this would send the booking to a backend API
    alert(`Ride booked! A ${rideTypes.find(r => r.id === selectedRideType)?.name} will arrive at ${pickupLocation} on ${date} at ${time}.`);
  };
  
  // Check if form is complete
  const isFormComplete = pickupLocation && dropLocation && date && time && selectedRideType !== null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book a Ride</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Ride Details</h2>
              
              <div className="space-y-4">
                {/* Pickup location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMapPin className="inline-block mr-1" /> Pickup Location
                  </label>
                  <input 
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => handleLocationSearch(e.target.value, 'pickup')}
                    className="input-field"
                    placeholder="Enter pickup address"
                  />
                  {isSearchingFor === 'pickup' && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                      {searchResults.map((location, index) => (
                        <div 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectLocation(location)}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Drop-off location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiMapPin className="inline-block mr-1" /> Drop-off Location
                  </label>
                  <input 
                    type="text"
                    value={dropLocation}
                    onChange={(e) => handleLocationSearch(e.target.value, 'drop')}
                    className="input-field"
                    placeholder="Enter destination"
                  />
                  {isSearchingFor === 'drop' && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                      {searchResults.map((location, index) => (
                        <div 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectLocation(location)}
                        >
                          {location}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Date and time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiCalendar className="inline-block mr-1" /> Date
                    </label>
                    <input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FiClock className="inline-block mr-1" /> Time
                    </label>
                    <input 
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
                
                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FiUsers className="inline-block mr-1" /> Passengers
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="input-field"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                
                {/* Ride type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <div 
                    className="relative border border-gray-300 rounded-md"
                  >
                    <button
                      type="button"
                      className="w-full py-2 px-3 flex justify-between items-center text-left"
                      onClick={() => setIsRideTypeOpen(!isRideTypeOpen)}
                    >
                      {selectedRideType ? (
                        <span>
                          <span className="mr-2">{rideTypes.find(r => r.id === selectedRideType)?.icon}</span>
                          {rideTypes.find(r => r.id === selectedRideType)?.name}
                        </span>
                      ) : (
                        "Select vehicle type"
                      )}
                      {isRideTypeOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    
                    {isRideTypeOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                        {rideTypes.map((ride) => (
                          <div 
                            key={ride.id}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                              ride.id === selectedRideType ? 'bg-primary-50 text-primary-600' : ''
                            }`}
                            onClick={() => {
                              setSelectedRideType(ride.id);
                              setIsRideTypeOpen(false);
                            }}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="mr-2">{ride.icon}</span>
                                <span className="font-medium">{ride.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  Up to {ride.capacity} passengers
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{ride.price}/km</div>
                                <div className="text-xs text-gray-500">{ride.time}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Booking summary */}
              {fare !== null && distance !== null && (
                <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Trip Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{distance} km</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium">{rideTypes.find(r => r.id === selectedRideType)?.time}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-800 font-medium">Total Fare:</span>
                      <span className="text-2xl font-bold text-primary-600">₹{fare}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={handleBookRide}
                      className={`w-full btn-primary ${!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isFormComplete}
                    >
                      Book Now
                    </button>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    <span className="flex items-center justify-center">
                      <FiTag className="mr-1" /> Additional charges may apply for waiting time
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Map section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full">
              <h2 className="text-xl font-semibold mb-4">Route Preview</h2>
              <RideMap 
                pickupLocation={pickupLocation} 
                dropLocation={dropLocation}
              />
              
              {pickupLocation && dropLocation && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium">Estimated Route</h3>
                  <p className="text-gray-600">From {pickupLocation} to {dropLocation}</p>
                  
                  {distance && (
                    <div className="mt-2 flex items-center">
                      <div className="mr-4">
                        <span className="text-gray-500 text-sm">Distance</span>
                        <p className="font-medium">{distance} km</p>
                      </div>
                      
                      {selectedRideType && (
                        <div className="mr-4">
                          <span className="text-gray-500 text-sm">Estimated Time</span>
                          <p className="font-medium">{rideTypes.find(r => r.id === selectedRideType)?.time}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Payment Options</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <input 
                      type="radio" 
                      id="cash" 
                      name="payment" 
                      className="h-4 w-4 text-primary-600" 
                      defaultChecked 
                    />
                    <label htmlFor="cash" className="ml-2 text-gray-700">Cash</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="card" 
                      name="payment" 
                      className="h-4 w-4 text-primary-600" 
                    />
                    <label htmlFor="card" className="ml-2 flex items-center text-gray-700">
                      <FiCreditCard className="mr-1" /> Credit/Debit Card
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookRidePage; 