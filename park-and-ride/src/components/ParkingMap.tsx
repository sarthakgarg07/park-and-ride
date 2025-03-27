import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiMinus } from 'react-icons/fi';

interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  availableSpots: number;
  hourlyRate: number;
  position: { x: number; y: number };
}

const ParkingMap = () => {
  const [zoom, setZoom] = useState(1);
  
  // These positions are relative coordinates for the SVG display
  const locations: ParkingLocation[] = [
    {
      id: 1,
      name: 'Delhi Metro Rajiv Chowk',
      address: 'Rajiv Chowk Metro Station, Connaught Place, New Delhi',
      availableSpots: 45,
      hourlyRate: 40,
      position: { x: 150, y: 100 }
    },
    {
      id: 2,
      name: 'Mumbai Dadar Station',
      address: 'Dadar Railway Station, Dadar West, Mumbai',
      availableSpots: 32,
      hourlyRate: 60,
      position: { x: 100, y: 230 }
    },
    {
      id: 3,
      name: 'Bangalore MG Road Metro',
      address: 'MG Road Metro Station, MG Road, Bangalore',
      availableSpots: 28,
      hourlyRate: 50,
      position: { x: 130, y: 280 }
    },
    {
      id: 4,
      name: 'Chennai Central',
      address: 'Chennai Central Railway Station, Chennai',
      availableSpots: 50,
      hourlyRate: 30,
      position: { x: 180, y: 290 }
    },
    {
      id: 5,
      name: 'Hyderabad Cyber Towers',
      address: 'Cyber Towers, HITEC City, Hyderabad',
      availableSpots: 38,
      hourlyRate: 45,
      position: { x: 140, y: 250 }
    },
    {
      id: 6,
      name: 'Kolkata Howrah Bridge',
      address: 'Near Howrah Bridge, Kolkata',
      availableSpots: 42,
      hourlyRate: 35,
      position: { x: 220, y: 180 }
    }
  ];
  
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.2);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(zoom - 0.2);
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button 
          onClick={handleZoomIn}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
          aria-label="Zoom in"
        >
          <FiPlus className="text-gray-700" />
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
          aria-label="Zoom out"
        >
          <FiMinus className="text-gray-700" />
        </button>
      </div>
      
      {/* Map content */}
      <div className="w-full h-full overflow-hidden relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
        {/* India map outline as SVG background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* Simplified India outline */}
            <path 
              d="M150,80 C160,70 180,70 190,80 C200,90 220,100 230,90 C240,80 250,90 240,100 C230,110 220,120 210,130 C200,140 190,150 180,160 C170,170 160,190 150,200 C140,210 130,230 120,250 C110,270 100,290 120,300 C140,310 160,320 180,300 C200,280 220,260 240,280 C260,300 240,320 220,310 C200,300 180,290 160,300 C140,310 120,320 130,330 C140,340 160,350 180,340 C200,330 220,320 210,310 C200,300 190,290 200,280 C210,270 220,260 230,250 C240,240 250,230 240,220 C230,210 220,200 230,190 C240,180 250,170 240,160 C230,150 220,140 210,150 C200,160 190,170 180,180 C170,190 160,200 150,190 C140,180 130,170 140,160 C150,150 160,140 150,130 C140,120 130,110 140,100 C150,90 140,90 150,80"
              fill="#f0f0f0"
              stroke="#e0e0e0"
              strokeWidth="2"
            />
            
            {/* Parking location markers */}
            {locations.map((location) => (
              <g key={location.id} onClick={() => setSelectedLocation(location)}>
                <circle 
                  cx={location.position.x} 
                  cy={location.position.y} 
                  r={selectedLocation?.id === location.id ? 10 : 8}
                  fill={selectedLocation?.id === location.id ? "rgba(79, 70, 229, 0.8)" : "rgba(79, 70, 229, 0.6)"}
                  className="cursor-pointer transition-all duration-200 hover:fill-primary-500"
                />
                <circle 
                  cx={location.position.x} 
                  cy={location.position.y} 
                  r={4}
                  fill="white"
                  className="pointer-events-none"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
      
      {/* Popup for selected location */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
              <p className="text-gray-500 text-sm">{selectedLocation.address}</p>
              <div className="mt-2 flex space-x-4">
                <div>
                  <span className="text-gray-500 text-xs">Available Spots</span>
                  <p className="font-medium">{selectedLocation.availableSpots}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Hourly Rate</span>
                  <p className="font-medium">₹{selectedLocation.hourlyRate}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedLocation(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
          <button className="mt-3 w-full btn-primary py-2 text-sm">
            Book This Location
          </button>
        </div>
      )}
    </div>
  );
};

export default ParkingMap; 