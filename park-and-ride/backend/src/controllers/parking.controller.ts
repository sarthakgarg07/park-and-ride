import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ParkingFacility from '../models/parking.model';
import ParkingBooking from '../models/parkingBooking.model';
import Payment from '../models/payment.model';

/**
 * Get all parking facilities
 */
export const getAllFacilities = async (req: Request, res: Response) => {
  try {
    const { 
      city, 
      amenities, 
      minRating = 0, 
      status = 'active',
      vehicleType,
      limit = 20, 
      page = 1 
    } = req.query;

    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Build filter object
    const filter: any = {};
    
    // Only include active facilities by default
    filter.status = status;
    
    // Filter by city if specified
    if (city) {
      filter.city = { $regex: new RegExp(String(city), 'i') };
    }
    
    // Filter by amenities if specified
    if (amenities) {
      const amenityList = String(amenities).split(',');
      filter.amenities = { $all: amenityList };
    }
    
    // Filter by rating if specified
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    
    // Filter by vehicle type if specified
    if (vehicleType) {
      filter['vehicleTypeRates.vehicleType'] = String(vehicleType);
    }

    // Fetch facilities
    const facilities = await ParkingFacility.find(filter)
      .sort({ rating: -1 })
      .limit(Number(limit))
      .skip(skip);

    // Count total facilities
    const totalFacilities = await ParkingFacility.countDocuments(filter);

    res.status(200).json({
      facilities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalFacilities,
        pages: Math.ceil(totalFacilities / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all facilities error:', error);
    res.status(500).json({ message: 'Server error fetching facilities' });
  }
};

/**
 * Get a single parking facility by ID
 */
export const getFacilityById = async (req: Request, res: Response) => {
  try {
    const facilityId = req.params.id;

    const facility = await ParkingFacility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Parking facility not found' });
    }

    res.status(200).json({ facility });
  } catch (error) {
    console.error('Get facility by ID error:', error);
    res.status(500).json({ message: 'Server error fetching facility' });
  }
};

/**
 * Search parking facilities by location
 */
export const searchFacilities = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 5, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Convert to numbers
    const latitude = parseFloat(String(lat));
    const longitude = parseFloat(String(lng));
    const searchRadius = parseFloat(String(radius)); // in kilometers

    // Simple distance-based search
    // In a production app, you'd use MongoDB's geospatial queries
    const facilities = await ParkingFacility.find({
      status: 'active',
      'coordinates.latitude': { $gte: latitude - 0.05, $lte: latitude + 0.05 },
      'coordinates.longitude': { $gte: longitude - 0.05, $lte: longitude + 0.05 },
    }).limit(Number(limit));

    // Filter facilities within the search radius
    const facilitiesInRadius = facilities.filter((facility) => {
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        latitude,
        longitude,
        facility.coordinates.latitude,
        facility.coordinates.longitude
      );
      return distance <= searchRadius;
    });

    res.status(200).json({
      facilities: facilitiesInRadius,
      count: facilitiesInRadius.length,
    });
  } catch (error) {
    console.error('Search facilities error:', error);
    res.status(500).json({ message: 'Server error searching facilities' });
  }
};

/**
 * Create a parking booking
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const {
      facilityId,
      startTime,
      endTime,
      vehicleType,
      vehicleLicensePlate,
      specialInstructions,
      paymentMethod,
    } = req.body;

    // Validate facility
    const facility = await ParkingFacility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Parking facility not found' });
    }

    // Check availability
    if (facility.availableSpots <= 0) {
      return res.status(400).json({ message: 'No available spots in this facility' });
    }

    // Calculate booking duration
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    // Calculate hours
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    // Get vehicle type rate
    const vehicleRate = facility.vehicleTypeRates.find(
      (rate) => rate.vehicleType === vehicleType
    );

    if (!vehicleRate) {
      return res.status(400).json({ message: 'Vehicle type not supported at this facility' });
    }

    // Calculate price
    const baseRate = durationHours > 6 ? facility.dailyRate * Math.ceil(durationHours / 24) : facility.hourlyRate * durationHours;
    const price = baseRate * vehicleRate.hourlyMultiplier;

    // Create booking
    const booking = new ParkingBooking({
      userId,
      facilityId,
      startTime: startDate,
      endTime: endDate,
      vehicleType,
      vehicleLicensePlate,
      price,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      bookingCode: `PK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      isExtended: false,
      specialInstructions,
    });

    // Save booking
    await booking.save();

    // Update facility available spots
    facility.availableSpots -= 1;
    await facility.save();

    // Create payment record
    const payment = new Payment({
      userId,
      amount: price,
      currency: 'INR',
      paymentMethod,
      status: 'pending',
      bookingType: 'parking',
      bookingId: booking._id,
    });

    await payment.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        transactionId: payment.transactionId,
      },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

/**
 * Get a booking by ID
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await ParkingBooking.findById(bookingId)
      .populate('facilityId', 'name address city coordinates hourlyRate dailyRate vehicleTypeRates');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to the user or user is admin
    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to this booking' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;
    const { cancellationReason } = req.body;

    // Find booking
    const booking = await ParkingBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to the user or user is admin
    if (booking.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to this booking' });
    }

    // Check if booking can be cancelled
    if (['checked-in', 'checked-out', 'cancelled'].includes(booking.bookingStatus)) {
      return res.status(400).json({ 
        message: `Cannot cancel booking in ${booking.bookingStatus} status` 
      });
    }

    // Calculate cancellation fee
    const startDate = new Date(booking.startTime);
    const now = new Date();
    const hoursBeforeBooking = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let cancellationFee = 0;
    
    // Apply cancellation fee if cancelled less than 24 hours before booking
    if (hoursBeforeBooking < 24) {
      cancellationFee = booking.price * 0.2; // 20% cancellation fee
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancellationFee = cancellationFee;
    
    await booking.save();

    // Update facility available spots
    const facility = await ParkingFacility.findById(booking.facilityId);
    if (facility) {
      facility.availableSpots += 1;
      await facility.save();
    }

    // Update payment status
    const payment = await Payment.findOne({ 
      bookingId: booking._id,
      bookingType: 'parking'
    });

    if (payment && payment.status === 'completed') {
      // If payment was already made, create refund
      const refundAmount = booking.price - cancellationFee;
      payment.status = cancellationFee > 0 ? 'partially_refunded' : 'refunded';
      payment.refundAmount = refundAmount;
      payment.refundReason = 'Booking cancelled';
      await payment.save();
    } else if (payment) {
      // If payment was pending, mark as failed
      payment.status = 'failed';
      await payment.save();
    }

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking,
      cancellationFee,
      refundAmount: booking.price - cancellationFee,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
};

/**
 * Submit review for a parking facility
 */
export const submitReview = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const facilityId = req.params.id;
    const { rating, comment } = req.body;

    // Find facility
    const facility = await ParkingFacility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Parking facility not found' });
    }

    // Check if user has a completed booking at this facility
    const completedBooking = await ParkingBooking.findOne({
      userId,
      facilityId,
      bookingStatus: { $in: ['checked-out', 'completed'] },
    });

    if (!completedBooking && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'You can only review facilities where you have completed a booking' 
      });
    }

    // Check if user has already reviewed this facility
    const existingReviewIndex = facility.reviews.findIndex(
      (review) => review.userId.toString() === userId
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      facility.reviews[existingReviewIndex].rating = rating;
      facility.reviews[existingReviewIndex].comment = comment;
      facility.reviews[existingReviewIndex].createdAt = new Date();
    } else {
      // Add new review
      facility.reviews.push({
        userId,
        rating,
        comment,
        createdAt: new Date(),
      });
    }

    // Update facility rating
    const totalRating = facility.reviews.reduce((sum, review) => sum + review.rating, 0);
    facility.rating = totalRating / facility.reviews.length;

    await facility.save();

    res.status(200).json({
      message: 'Review submitted successfully',
      facility: {
        id: facility._id,
        name: facility.name,
        rating: facility.rating,
        reviews: facility.reviews,
      },
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
};

// Utility function to calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
}; 