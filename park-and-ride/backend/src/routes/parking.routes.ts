import express from 'express';
import { check } from 'express-validator';
import * as parkingController from '../controllers/parking.controller';
import { auth, adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   GET /api/parking/facilities
 * @desc    Get all parking facilities
 * @access  Public
 */
router.get('/facilities', parkingController.getAllFacilities);

/**
 * @route   GET /api/parking/facilities/:id
 * @desc    Get a parking facility by ID
 * @access  Public
 */
router.get('/facilities/:id', parkingController.getFacilityById);

/**
 * @route   GET /api/parking/search
 * @desc    Search parking facilities by location
 * @access  Public
 */
router.get('/search', parkingController.searchFacilities);

/**
 * @route   POST /api/parking/bookings
 * @desc    Create a parking booking
 * @access  Private
 */
router.post(
  '/bookings',
  [
    auth,
    check('facilityId', 'Facility ID is required').notEmpty(),
    check('startTime', 'Start time is required').notEmpty().isISO8601().toDate(),
    check('endTime', 'End time is required').notEmpty().isISO8601().toDate(),
    check('vehicleType', 'Vehicle type is required').notEmpty(),
    check('paymentMethod', 'Payment method is required').notEmpty(),
  ],
  parkingController.createBooking
);

/**
 * @route   GET /api/parking/bookings/:id
 * @desc    Get a booking by ID
 * @access  Private
 */
router.get('/bookings/:id', auth, parkingController.getBookingById);

/**
 * @route   PUT /api/parking/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.put(
  '/bookings/:id/cancel',
  [
    auth,
    check('cancellationReason', 'Cancellation reason is required').optional(),
  ],
  parkingController.cancelBooking
);

/**
 * @route   POST /api/parking/facilities/:id/reviews
 * @desc    Submit a review for a parking facility
 * @access  Private
 */
router.post(
  '/facilities/:id/reviews',
  [
    auth,
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').optional().trim(),
  ],
  parkingController.submitReview
);

export default router; 