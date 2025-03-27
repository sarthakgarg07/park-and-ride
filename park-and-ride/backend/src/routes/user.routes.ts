import express from 'express';
import { check } from 'express-validator';
import multer from 'multer';
import path from 'path';
import * as userController from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads/profile'));
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (_req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
  },
});

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, userController.getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    auth,
    check('name', 'Name is required').optional().notEmpty().trim(),
    check('phone', 'Please enter a valid phone number').optional().isMobilePhone('any'),
    check('address', 'Address is required').optional().notEmpty().trim(),
  ],
  userController.updateUserProfile
);

/**
 * @route   PUT /api/users/profile-picture
 * @desc    Update profile picture
 * @access  Private
 */
router.put(
  '/profile-picture',
  [auth, upload.single('profilePicture')],
  userController.updateProfilePicture
);

/**
 * @route   GET /api/users/bookings
 * @desc    Get user bookings
 * @access  Private
 */
router.get('/bookings', auth, userController.getUserBookings);

/**
 * @route   GET /api/users/payments
 * @desc    Get user payments
 * @access  Private
 */
router.get('/payments', auth, userController.getUserPayments);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', auth, userController.deleteUserAccount);

export default router; 