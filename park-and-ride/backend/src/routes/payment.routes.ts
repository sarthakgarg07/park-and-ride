import express from 'express';
import { check } from 'express-validator';
import * as paymentController from '../controllers/payment.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route   POST /api/payments/methods
 * @desc    Add a payment method
 * @access  Private
 */
router.post(
  '/methods',
  [
    auth,
    check('type', 'Payment method type is required').isIn(['card', 'upi', 'wallet', 'netbanking']),
    check('details', 'Payment details are required').isObject(),
  ],
  paymentController.addPaymentMethod
);

/**
 * @route   GET /api/payments/methods
 * @desc    Get user's payment methods
 * @access  Private
 */
router.get('/methods', auth, paymentController.getPaymentMethods);

/**
 * @route   DELETE /api/payments/methods/:id
 * @desc    Delete a payment method
 * @access  Private
 */
router.delete('/methods/:id', auth, paymentController.deletePaymentMethod);

/**
 * @route   POST /api/payments/process
 * @desc    Process a payment
 * @access  Private
 */
router.post(
  '/process',
  [
    auth,
    check('amount', 'Amount is required').isNumeric(),
    check('currency', 'Currency is required').isString().isLength({ min: 3, max: 3 }),
    check('paymentMethodId', 'Payment method ID is required').notEmpty(),
    check('bookingType', 'Booking type is required').isIn(['parking', 'ride']),
    check('bookingId', 'Booking ID is required').notEmpty(),
  ],
  paymentController.processPayment
);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment details
 * @access  Private
 */
router.get('/:id', auth, paymentController.getPaymentDetails);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process a refund
 * @access  Private
 */
router.post(
  '/:id/refund',
  [
    auth,
    check('reason', 'Refund reason is required').notEmpty(),
  ],
  paymentController.processRefund
);

/**
 * @route   GET /api/payments/history
 * @desc    Get payment history
 * @access  Private
 */
router.get('/history', auth, paymentController.getPaymentHistory);

export default router; 