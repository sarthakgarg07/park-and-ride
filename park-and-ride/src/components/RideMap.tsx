import React, { useState, useEffect } from 'react';
import { FiMapPin } from 'react-icons/fi';

interface RideMapProps {
  pickupLocation: string;
  dropLocation: string;
}

const RideMap = ({ pickupLocation, dropLocation }: RideMapProps) => {
  const [loading, setLoading] = useState(false);
  
  // This is a simplified map component that doesn't use real maps API
  // In a real app, you would integrate with Google Maps or a similar service
  
  return (
    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {/* Map display */}
      <div className="w-full h-full overflow-hidden relative">
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
            
            {/* Route line if both locations are provided */}
            {pickupLocation && dropLocation && (
              <>
                {/* This is a dummy route - in a real app, you'd use actual coordinates */}
                <path 
                  d="M150,150 C180,170 220,180 240,220"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                
                {/* Start point */}
                <circle cx="150" cy="150" r="8" fill="rgba(74, 222, 128, 0.8)" />
                <circle cx="150" cy="150" r="4" fill="white" />
                
                {/* End point */}
                <circle cx="240" cy="220" r="8" fill="rgba(239, 68, 68, 0.8)" />
                <circle cx="240" cy="220" r="4" fill="white" />
              </>
            )}
          </svg>
        </div>
      </div>
      
      {/* Location labels */}
      {(pickupLocation || dropLocation) && (
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 z-10">
          {pickupLocation && (
            <div className="flex items-center mb-2">
              <div className="bg-green-500 p-1 rounded-full mr-2">
                <FiMapPin className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{pickupLocation}</span>
            </div>
          )}
          
          {dropLocation && (
            <div className="flex items-center">
              <div className="bg-red-500 p-1 rounded-full mr-2">
                <FiMapPin className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{dropLocation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RideMap; 