import React, { useState, useEffect } from 'react';
import { FiNavigation, FiMapPin, FiPlus, FiMinus } from 'react-icons/fi';

interface RideMapIndiaProps {
  routeCoordinates: number[][];
  currentPosition?: number;
}

const RideMapIndia = ({ routeCoordinates, currentPosition = 1 }: RideMapIndiaProps) => {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // City coordinates for India map visualization (relative positions)
  const cities = [
    { name: "Delhi", x: 150, y: 100 },
    { name: "Mumbai", x: 100, y: 230 },
    { name: "Bangalore", x: 130, y: 280 },
    { name: "Chennai", x: 180, y: 290 },
    { name: "Hyderabad", x: 140, y: 250 },
    { name: "Kolkata", x: 220, y: 180 }
  ];
  
  // Map route to SVG coordinate system
  const mapRoutePoints = () => {
    // This is a demo route from Delhi to Mumbai via Jaipur
    return "M150,100 C140,140 120,170 100,230";
  };
  
  // Map vehicle position to SVG coordinate system
  const getVehiclePosition = () => {
    // Simplified calculation - in a real app this would be based on GPS coordinates
    const path = "M150,100 C140,140 120,170 100,230";
    const percentage = Math.min(1, Math.max(0, currentPosition / (routeCoordinates.length - 1)));
    
    // Calculate a point along the path (simplified approach)
    const x = 150 - (50 * percentage);
    const y = 100 + (130 * percentage);
    
    return { x, y };
  };
  
  const vehiclePos = getVehiclePosition();
  
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.2);
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(zoom - 0.2);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
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
            
            {/* Major cities */}
            {cities.map((city) => (
              <g key={city.name}>
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r={5}
                  fill="rgba(79, 70, 229, 0.4)"
                />
                <text 
                  x={city.x + 8} 
                  y={city.y} 
                  fontSize="10" 
                  fill="#4B5563"
                >
                  {city.name}
                </text>
              </g>
            ))}
            
            {/* Route path */}
            <path 
              d={mapRoutePoints()}
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
            
            {/* Start point */}
            <circle cx="150" cy="100" r="8" fill="rgba(74, 222, 128, 0.8)" />
            <circle cx="150" cy="100" r="4" fill="white" />
            
            {/* End point */}
            <circle cx="100" cy="230" r="8" fill="rgba(239, 68, 68, 0.8)" />
            <circle cx="100" cy="230" r="4" fill="white" />
            
            {/* Vehicle position */}
            <g transform={`translate(${vehiclePos.x - 10}, ${vehiclePos.y - 10})`}>
              <circle cx="10" cy="10" r="14" fill="rgba(255, 255, 255, 0.8)" />
              <path 
                d="M10,4 L16,16 H4 Z" 
                fill="#3B82F6" 
                transform="rotate(45, 10, 10)"
              />
            </g>
          </svg>
        </div>
      </div>
      
      {/* Location labels */}
      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="bg-green-500 p-1 rounded-full mr-2">
              <FiMapPin className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">Delhi</span>
          </div>
          <span className="text-xs text-gray-500">Origin</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-red-500 p-1 rounded-full mr-2">
              <FiMapPin className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium">Mumbai</span>
          </div>
          <span className="text-xs text-gray-500">Destination</span>
        </div>
      </div>
    </div>
  );
};

export default RideMapIndia; 