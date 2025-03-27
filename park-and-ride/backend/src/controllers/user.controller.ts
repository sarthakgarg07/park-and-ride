import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.model';
import ParkingBooking from '../models/parkingBooking.model';
import Ride from '../models/ride.model';
import Payment from '../models/payment.model';

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Find user by ID (exclude password and sensitive fields)
    const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { name, phone, address } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Save updated user
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
};

/**
 * Update profile picture
 * (This assumes a file upload middleware like multer has been used)
 */
export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file path from multer middleware
    const profilePicturePath = req.file.path;

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicturePath },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile picture updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Server error updating profile picture' });
  }
};

/**
 * Get user bookings (parking and rides)
 */
export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { type, status, limit = 10, page = 1 } = req.query;

    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Create filter object
    const filter: any = { userId };
    if (status) filter.bookingStatus = status;

    let parkingBookings = [];
    let rideBookings = [];

    // Fetch bookings based on type
    if (!type || type === 'parking') {
      parkingBookings = await ParkingBooking.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .populate('facilityId', 'name address city hourlyRate dailyRate');
    }

    if (!type || type === 'ride') {
      rideBookings = await Ride.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip);
    }

    res.status(200).json({
      parkingBookings,
      rideBookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalParking: await ParkingBooking.countDocuments(filter),
        totalRides: await Ride.countDocuments(filter),
      },
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error fetching user bookings' });
  }
};

/**
 * Get user payments
 */
export const getUserPayments = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { status, bookingType, limit = 10, page = 1 } = req.query;

    // Calculate skip for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Create filter object
    const filter: any = { userId };
    if (status) filter.status = status;
    if (bookingType) filter.bookingType = bookingType;

    // Fetch payments
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)
      .populate({
        path: 'bookingId',
        select: 'bookingCode startTime endTime vehicleType origin destination rideType scheduledTime',
      });

    // Count total payments for pagination
    const totalPayments = await Payment.countDocuments(filter);

    res.status(200).json({
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalPayments,
      },
    });
  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({ message: 'Server error fetching user payments' });
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Check if user has active bookings
    const activeBookings = await ParkingBooking.countDocuments({
      userId,
      bookingStatus: { $in: ['confirmed', 'checked-in'] },
    });

    const activeRides = await Ride.countDocuments({
      userId,
      status: { $in: ['scheduled', 'in-progress'] },
    });

    if (activeBookings > 0 || activeRides > 0) {
      return res.status(400).json({
        message: 'Cannot delete account with active bookings or rides',
        activeBookings,
        activeRides,
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({ message: 'Server error deleting user account' });
  }
}; 