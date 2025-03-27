import express from 'express';
import { check } from 'express-validator';
import * as rideController from '../controllers/ride.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   GET /api/rides
 * @desc    Get available ride services
 * @access  Public
 */
router.get('/', rideController.getAvailableRides);

/**
 * @route   GET /api/rides/routes
 * @desc    Get available ride routes
 * @access  Public
 */
router.get('/routes', rideController.getAvailableRoutes);

/**
 * @route   GET /api/rides/estimate
 * @desc    Get ride price and time estimate
 * @access  Public
 */
router.get(
  '/estimate',
  [
    check('origin', 'Origin is required').notEmpty(),
    check('destination', 'Destination is required').notEmpty(),
    check('rideType', 'Ride type is required').optional(),
  ],
  rideController.getRideEstimate
);

/**
 * @route   POST /api/rides/book
 * @desc    Book a ride
 * @access  Private
 */
router.post(
  '/book',
  [
    auth,
    check('origin', 'Origin is required').notEmpty(),
    check('destination', 'Destination is required').notEmpty(),
    check('departureTime', 'Departure time is required').isISO8601().toDate(),
    check('rideType', 'Ride type is required').notEmpty(),
    check('passengerCount', 'Passenger count is required').isInt({ min: 1 }),
    check('paymentMethod', 'Payment method is required').notEmpty(),
  ],
  rideController.bookRide
);

/**
 * @route   GET /api/rides/active
 * @desc    Get user's active rides
 * @access  Private
 */
router.get('/active', auth, rideController.getActiveRides);

/**
 * @route   GET /api/rides/:id
 * @desc    Get ride details by ID
 * @access  Private
 */
router.get('/:id', auth, rideController.getRideById);

/**
 * @route   GET /api/rides/:id/track
 * @desc    Track a ride's real-time location
 * @access  Private
 */
router.get('/:id/track', auth, rideController.trackRide);

/**
 * @route   PUT /api/rides/:id/cancel
 * @desc    Cancel a ride
 * @access  Private
 */
router.put(
  '/:id/cancel',
  [
    auth,
    check('cancellationReason', 'Cancellation reason is required').optional(),
  ],
  rideController.cancelRide
);

/**
 * @route   POST /api/rides/:id/review
 * @desc    Submit a review for a completed ride
 * @access  Private
 */
router.post(
  '/:id/review',
  [
    auth,
    check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('comment', 'Comment is required').optional().trim(),
  ],
  rideController.submitRideReview
);

/**
 * @route   GET /api/rides/history
 * @desc    Get user's ride history
 * @access  Private
 */
router.get('/history', auth, rideController.getRideHistory);

export default router; 