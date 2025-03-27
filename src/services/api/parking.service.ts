import apiClient, { handleApiError } from './index';

interface ParkingFilters {
  city?: string;
  amenities?: string[];
  minRating?: number;
  vehicleType?: string;
  page?: number;
  limit?: number;
}

interface BookingRequest {
  facilityId: string;
  startTime: Date | string;
  endTime: Date | string;
  vehicleType: string;
  vehicleLicensePlate: string;
  paymentMethod: string;
  specialInstructions?: string;
}

// Get all parking facilities with optional filters
export const getAllFacilities = async (filters: ParkingFilters = {}) => {
  try {
    // Convert array filters to comma-separated strings
    const params: any = { ...filters };
    if (filters.amenities && Array.isArray(filters.amenities)) {
      params.amenities = filters.amenities.join(',');
    }
    
    const response = await apiClient.get('/parking/facilities', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get a single parking facility by ID
export const getFacilityById = async (id: string) => {
  try {
    const response = await apiClient.get(`/parking/facilities/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Search parking facilities by location
export const searchFacilities = async (lat: number, lng: number, radius: number = 5) => {
  try {
    const response = await apiClient.get('/parking/search', {
      params: { lat, lng, radius },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Create a parking booking
export const createBooking = async (bookingData: BookingRequest) => {
  try {
    const response = await apiClient.post('/parking/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Get booking by ID
export const getBookingById = async (id: string) => {
  try {
    const response = await apiClient.get(`/parking/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Cancel a booking
export const cancelBooking = async (id: string, cancellationReason?: string) => {
  try {
    const response = await apiClient.put(`/parking/bookings/${id}/cancel`, {
      cancellationReason,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Submit a review for a parking facility
export const submitReview = async (facilityId: string, rating: number, comment: string) => {
  try {
    const response = await apiClient.post(`/parking/facilities/${facilityId}/reviews`, {
      rating,
      comment,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}; 