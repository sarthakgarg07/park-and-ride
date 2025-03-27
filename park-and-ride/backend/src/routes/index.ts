import express from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import parkingRoutes from './parking.routes';
import rideRoutes from './ride.routes';
import paymentRoutes from './payment.routes';

const router = express.Router();

// Route definitions
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/parking', parkingRoutes);
router.use('/api/rides', rideRoutes);
router.use('/api/payments', paymentRoutes);

export default router; 