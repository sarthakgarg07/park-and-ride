import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import User from '../models/user.model';
import ParkingFacility from '../models/parking.model';
import Ride from '../models/ride.model';
import ParkingBooking from '../models/parkingBooking.model';
import Payment from '../models/payment.model';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const checkDatabase = async () => {
  try {
    // Get count of documents in each collection
    const userCount = await User.countDocuments();
    const facilityCount = await ParkingFacility.countDocuments();
    const rideCount = await Ride.countDocuments();
    const bookingCount = await ParkingBooking.countDocuments();
    const paymentCount = await Payment.countDocuments();

    console.log('\n=== DATABASE STATUS ===');
    console.log(`MongoDB Connection: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Not Connected'}`);
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Server: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    console.log('\n=== COLLECTION STATS ===');
    console.log(`Users: ${userCount} documents`);
    console.log(`Parking Facilities: ${facilityCount} documents`);
    console.log(`Rides: ${rideCount} documents`);
    console.log(`Parking Bookings: ${bookingCount} documents`);
    console.log(`Payments: ${paymentCount} documents`);
    
    console.log('\n=== SAMPLE DATA ===');
    
    if (userCount > 0) {
      const sampleUser = await User.findOne().select('-password');
      console.log(`Users Sample: ${JSON.stringify(sampleUser ? { name: sampleUser.name, email: sampleUser.email, role: sampleUser.role } : 'No users found', null, 2)}`);
    }
    
    if (facilityCount > 0) {
      const sampleFacility = await ParkingFacility.findOne();
      console.log(`Facilities Sample: ${JSON.stringify(sampleFacility ? { name: sampleFacility.name, city: sampleFacility.city, availableSpots: sampleFacility.availableSpots } : 'No facilities found', null, 2)}`);
    }
    
    console.log('\nDatabase check complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

// Execute database check
checkDatabase(); 