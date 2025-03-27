import { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { FiCalendar, FiClock, FiMapPin, FiSearch, FiFilter, FiCheck } from 'react-icons/fi';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import map component with no SSR to avoid window not defined error
const ParkingMap = dynamic(
  () => import('@/components/ParkingMap'),
  { ssr: false }
);

// Sample parking facilities data
const SAMPLE_PARKING_FACILITIES = [
  {
    id: 1,
    name: 'Central Station Parking',
    address: '123 Main St, Downtown',
    price: 12.99,
    availableSpots: 45,
    totalSpots: 150,
    rating: 4.7,
    distance: 0.8,
    amenities: ['EV Charging', 'Security', 'Covered'],
    coordinates: [40.7128, -74.0060]
  },
  {
    id: 2,
    name: 'Westside Transit Hub',
    address: '456 Park Ave, Westside',
    price: 9.99,
    availableSpots: 28,
    totalSpots: 120,
    rating: 4.2,
    distance: 1.5,
    amenities: ['Security', 'Open 24/7'],
    coordinates: [40.7138, -74.0065]
  },
  {
    id: 3,
    name: 'Eastside Parking Center',
    address: '789 Transit Rd, Eastside',
    price: 14.99,
    availableSpots: 12,
    totalSpots: 80,
    rating: 4.5,
    distance: 2.1,
    amenities: ['EV Charging', 'Covered', 'Bike Racks'],
    coordinates: [40.7148, -74.0055]
  },
  {
    id: 4,
    name: 'Southside Park & Ride',
    address: '321 Metro Blvd, Southside',
    price: 8.99,
    availableSpots: 56,
    totalSpots: 200,
    rating: 4.0,
    distance: 3.2,
    amenities: ['Open 24/7', 'Bike Racks'],
    coordinates: [40.7118, -74.0070]
  }
];

const BookParking = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [filteredFacilities, setFilteredFacilities] = useState(SAMPLE_PARKING_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const allFilters = ['EV Charging', 'Security', 'Covered', 'Open 24/7', 'Bike Racks'];
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const applyFilters = () => {
    if (activeFilters.length === 0) {
      setFilteredFacilities(SAMPLE_PARKING_FACILITIES);
    } else {
      const filtered = SAMPLE_PARKING_FACILITIES.filter(facility => 
        activeFilters.some(filter => facility.amenities.includes(filter))
      );
      setFilteredFacilities(filtered);
    }
    setShowFilters(false);
  };

  const handleFacilitySelect = (id: number) => {
    setSelectedFacility(id === selectedFacility ? null : id);
  };

  const [locationData, setLocationData] = useState({
    locations: [
      {
        id: 1,
        name: 'Delhi Metro Rajiv Chowk',
        address: 'Rajiv Chowk Metro Station, Connaught Place, New Delhi',
        availableSpots: 45,
        hourlyRate: 40,
        dailyRate: 250
      },
      {
        id: 2,
        name: 'Mumbai Dadar Station',
        address: 'Dadar Railway Station, Dadar West, Mumbai',
        availableSpots: 32,
        hourlyRate: 60,
        dailyRate: 400
      },
      {
        id: 3,
        name: 'Bangalore MG Road Metro',
        address: 'MG Road Metro Station, MG Road, Bangalore',
        availableSpots: 28,
        hourlyRate: 50,
        dailyRate: 300
      },
      {
        id: 4,
        name: 'Chennai Central',
        address: 'Chennai Central Railway Station, Chennai',
        availableSpots: 50,
        hourlyRate: 30,
        dailyRate: 200
      },
      {
        id: 5,
        name: 'Hyderabad Cyber Towers',
        address: 'Cyber Towers, HITEC City, Hyderabad',
        availableSpots: 38,
        hourlyRate: 45,
        dailyRate: 275
      },
      {
        id: 6,
        name: 'Kolkata Howrah Bridge',
        address: 'Near Howrah Bridge, Kolkata',
        availableSpots: 42,
        hourlyRate: 35,
        dailyRate: 225
      }
    ],
    vehicleTypes: [
      { id: 1, name: 'Two Wheeler', hourlyMultiplier: 0.5 },
      { id: 2, name: 'Hatchback', hourlyMultiplier: 1.0 },
      { id: 3, name: 'Sedan', hourlyMultiplier: 1.2 },
      { id: 4, name: 'SUV', hourlyMultiplier: 1.5 },
      { id: 5, name: 'Electric Vehicle', hourlyMultiplier: 0.8 }
    ]
  });

  const totalPrice = useMemo(() => {
    if (!selectedLocation || !selectedVehicleType || !startDate || !endDate) return 0;
    
    const location = locationData.locations.find(loc => loc.id === selectedLocation);
    const vehicleType = locationData.vehicleTypes.find(type => type.id === selectedVehicleType);
    
    if (!location || !vehicleType) return 0;
    
    const hours = calculateHours(startDate, endDate);
    const days = Math.ceil(hours / 24);
    
    // Use daily rate if parking for more than 6 hours
    if (hours > 6) {
      return days * location.dailyRate * vehicleType.hourlyMultiplier;
    } else {
      return hours * location.hourlyRate * vehicleType.hourlyMultiplier;
    }
  }, [selectedLocation, selectedVehicleType, startDate, endDate, locationData]);

  // Function to calculate hours between dates
  const calculateHours = (start: Date | null, end: Date | null): number => {
    if (!start || !end) return 0;
    const diffMs = end.getTime() - start.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60));
  };

  // Helper function to format date range for display
  const formatDateRange = (start: Date | null, end: Date | null): string => {
    if (!start || !end) return '';
    return `${start.toLocaleDateString()} ${start.toLocaleTimeString()} - ${end.toLocaleDateString()} ${end.toLocaleTimeString()}`;
  };

  // Update startDate and endDate when date and times change
  useEffect(() => {
    if (date && startTime) {
      const dateObj = new Date(date);
      const [hours, minutes] = startTime.split(':').map(Number);
      dateObj.setHours(hours, minutes);
      setStartDate(dateObj);
    } else {
      setStartDate(null);
    }

    if (date && endTime) {
      const dateObj = new Date(date);
      const [hours, minutes] = endTime.split(':').map(Number);
      dateObj.setHours(hours, minutes);
      setEndDate(dateObj);
    } else {
      setEndDate(null);
    }
  }, [date, startTime, endTime]);

  // Handle booking submission
  const handleBooking = () => {
    setIsLoading(true);
    // In a real app, this would send a request to a backend API
    setTimeout(() => {
      setIsLoading(false);
      alert('Booking successful! You have reserved a parking spot.');
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Parking</h1>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Location search */}
            <div className="lg:col-span-2">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiMapPin className="inline-block mr-1" /> Location
                </label>
                <select
                  value={selectedLocation || ''}
                  onChange={(e) => setSelectedLocation(e.target.value ? parseInt(e.target.value) : null)}
                  className="input-field"
                >
                  <option value="">Select location</option>
                  {locationData.locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date picker */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiCalendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date"
                  className="input-field pl-10"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Start time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiClock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  id="startTime"
                  className="input-field pl-10"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            {/* End time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FiClock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  id="endTime"
                  className="input-field pl-10"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                value={selectedVehicleType || ''}
                onChange={(e) => setSelectedVehicleType(e.target.value ? parseInt(e.target.value) : null)}
                className="input-field"
              >
                <option value="">Select vehicle type</option>
                {locationData.vehicleTypes.map(vehicleType => (
                  <option key={vehicleType.id} value={vehicleType.id}>
                    {vehicleType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-primary-600 mb-4 sm:mb-0"
            >
              <FiFilter className="h-5 w-5 mr-1" />
              Filters
              {activeFilters.length > 0 && (
                <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeFilters.length}
                </span>
              )}
            </button>

            <button 
              className="btn-primary flex items-center"
              onClick={() => setFilteredFacilities(SAMPLE_PARKING_FACILITIES)}
            >
              <FiSearch className="h-5 w-5 mr-2" />
              Search Parking
            </button>
          </div>

          {/* Filters dropdown */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {allFilters.map(filter => (
                  <div 
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={`cursor-pointer flex items-center p-2 rounded-md border ${
                      activeFilters.includes(filter) 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-4 h-4 mr-2 rounded-sm flex items-center justify-center ${
                      activeFilters.includes(filter) ? 'bg-primary-500' : 'border border-gray-400'
                    }`}>
                      {activeFilters.includes(filter) && <FiCheck className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm">{filter}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  className="btn-primary"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Parking facilities list */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Parking ({filteredFacilities.length})</h2>
            
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {filteredFacilities.map(facility => (
                <div 
                  key={facility.id}
                  className={`card p-4 cursor-pointer transition-all duration-200 border-2 ${
                    selectedFacility === facility.id ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => handleFacilitySelect(facility.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-900">{facility.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      ${facility.price}/hr
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1 mb-2">{facility.address}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-3">{facility.distance} miles away</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {facility.rating}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {facility.amenities.map(amenity => (
                      <span key={amenity} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Availability</span>
                      <span className="font-medium">{facility.availableSpots}/{facility.totalSpots} spots</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${(facility.availableSpots / facility.totalSpots) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {selectedFacility === facility.id && (
                    <div className="mt-4">
                      <Link href="/checkout" className="btn-primary w-full text-center block">
                        Reserve Spot
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              
              {filteredFacilities.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No parking facilities match your criteria.</p>
                  <button 
                    className="mt-2 text-primary-600 hover:text-primary-700"
                    onClick={() => {
                      setActiveFilters([]);
                      setFilteredFacilities(SAMPLE_PARKING_FACILITIES);
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Map View */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-[600px]">
              <ParkingMap facilities={filteredFacilities} selectedId={selectedFacility} />
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Summary</h3>
          
          {selectedLocation && (
            <div className="mb-2">
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">
                {locationData.locations.find(l => l.id === selectedLocation)?.name}
              </span>
            </div>
          )}
          
          {selectedVehicleType && (
            <div className="mb-2">
              <span className="text-gray-600">Vehicle:</span>
              <span className="ml-2 font-medium">
                {locationData.vehicleTypes.find(v => v.id === selectedVehicleType)?.name}
              </span>
            </div>
          )}
          
          {startDate && endDate && (
            <div className="mb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">
                {formatDateRange(startDate, endDate)} ({calculateHours(startDate, endDate)} hours)
              </span>
            </div>
          )}
          
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Price:</span>
              <span className="text-2xl font-bold text-primary-600">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleBooking}
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Reserve Parking Spot'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookParking; 