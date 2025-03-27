import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@parkandride.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    isEmailVerified: true,
  },
  {
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    password: 'password123',
    phone: '9876543211',
    role: 'user',
    address: '123 Main Street, Bangalore',
    isEmailVerified: true,
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '9876543212',
    role: 'user',
    address: '456 Park Avenue, Mumbai',
    isEmailVerified: true,
  },
  {
    name: 'Suresh Patel',
    email: 'suresh@example.com',
    password: 'password123',
    phone: '9876543213',
    role: 'user',
    address: '789 Gandhi Road, Chennai',
    isEmailVerified: true,
  },
];

// Sample Parking Facilities
const parkingFacilities = [
  {
    name: 'Bangalore MG Road Metro',
    address: 'MG Road Metro Station, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    coordinates: {
      latitude: 12.9767,
      longitude: 77.6008,
    },
    totalSpots: 50,
    availableSpots: 28,
    hourlyRate: 50,
    dailyRate: 300,
    amenities: ['CCTV', 'Security Guard', 'EV Charging', 'Car Wash'],
    images: [
      'https://example.com/images/parking1.jpg',
      'https://example.com/images/parking1-2.jpg',
    ],
    rating: 4.5,
    reviews: [],
    operatingHours: [
      {
        day: 'Monday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Thursday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Friday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Saturday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Sunday',
        open: '08:00',
        close: '20:00',
        isClosed: false,
      },
    ],
    vehicleTypeRates: [
      {
        vehicleType: 'Two Wheeler',
        hourlyMultiplier: 0.5,
      },
      {
        vehicleType: 'Hatchback',
        hourlyMultiplier: 1.0,
      },
      {
        vehicleType: 'Sedan',
        hourlyMultiplier: 1.2,
      },
      {
        vehicleType: 'SUV',
        hourlyMultiplier: 1.5,
      },
      {
        vehicleType: 'Electric Vehicle',
        hourlyMultiplier: 0.8,
      },
    ],
    status: 'active',
  },
  {
    name: 'Chennai Central',
    address: 'Central Railway Station, EVR Periyar Salai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zipCode: '600003',
    coordinates: {
      latitude: 13.0827,
      longitude: 80.2707,
    },
    totalSpots: 100,
    availableSpots: 50,
    hourlyRate: 30,
    dailyRate: 200,
    amenities: ['CCTV', 'Security Guard', 'Covered Parking'],
    images: [
      'https://example.com/images/parking2.jpg',
      'https://example.com/images/parking2-2.jpg',
    ],
    rating: 4.2,
    reviews: [],
    operatingHours: [
      {
        day: 'Monday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Thursday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Friday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Saturday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Sunday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
    ],
    vehicleTypeRates: [
      {
        vehicleType: 'Two Wheeler',
        hourlyMultiplier: 0.5,
      },
      {
        vehicleType: 'Hatchback',
        hourlyMultiplier: 1.0,
      },
      {
        vehicleType: 'Sedan',
        hourlyMultiplier: 1.2,
      },
      {
        vehicleType: 'SUV',
        hourlyMultiplier: 1.5,
      },
    ],
    status: 'active',
  },
  {
    name: 'Hyderabad Cyber Towers',
    address: 'Cyber Towers, Hitec City',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500081',
    coordinates: {
      latitude: 17.4508,
      longitude: 78.3807,
    },
    totalSpots: 75,
    availableSpots: 38,
    hourlyRate: 45,
    dailyRate: 275,
    amenities: ['CCTV', 'Security Guard', 'EV Charging', 'WiFi'],
    images: [
      'https://example.com/images/parking3.jpg',
      'https://example.com/images/parking3-2.jpg',
    ],
    rating: 4.7,
    reviews: [],
    operatingHours: [
      {
        day: 'Monday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Thursday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Friday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Saturday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Sunday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
    ],
    vehicleTypeRates: [
      {
        vehicleType: 'Two Wheeler',
        hourlyMultiplier: 0.5,
      },
      {
        vehicleType: 'Hatchback',
        hourlyMultiplier: 1.0,
      },
      {
        vehicleType: 'Sedan',
        hourlyMultiplier: 1.2,
      },
      {
        vehicleType: 'SUV',
        hourlyMultiplier: 1.5,
      },
      {
        vehicleType: 'Electric Vehicle',
        hourlyMultiplier: 0.8,
      },
    ],
    status: 'active',
  },
  {
    name: 'Kolkata Howrah Bridge',
    address: 'Near Howrah Bridge',
    city: 'Kolkata',
    state: 'West Bengal',
    zipCode: '700001',
    coordinates: {
      latitude: 22.5851,
      longitude: 88.3468,
    },
    totalSpots: 60,
    availableSpots: 42,
    hourlyRate: 35,
    dailyRate: 225,
    amenities: ['CCTV', 'Security Guard'],
    images: [
      'https://example.com/images/parking4.jpg',
      'https://example.com/images/parking4-2.jpg',
    ],
    rating: 4.0,
    reviews: [],
    operatingHours: [
      {
        day: 'Monday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Thursday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Friday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Saturday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
      {
        day: 'Sunday',
        open: '06:00',
        close: '22:00',
        isClosed: false,
      },
    ],
    vehicleTypeRates: [
      {
        vehicleType: 'Two Wheeler',
        hourlyMultiplier: 0.5,
      },
      {
        vehicleType: 'Hatchback',
        hourlyMultiplier: 1.0,
      },
      {
        vehicleType: 'Sedan',
        hourlyMultiplier: 1.2,
      },
      {
        vehicleType: 'SUV',
        hourlyMultiplier: 1.5,
      },
    ],
    status: 'active',
  },
  {
    name: 'Mumbai Dadar Station',
    address: 'Dadar Railway Station, Dr Babasaheb Ambedkar Rd',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400014',
    coordinates: {
      latitude: 19.0213,
      longitude: 72.8426,
    },
    totalSpots: 80,
    availableSpots: 35,
    hourlyRate: 55,
    dailyRate: 350,
    amenities: ['CCTV', 'Security Guard', 'Covered Parking', 'Car Wash'],
    images: [
      'https://example.com/images/parking5.jpg',
      'https://example.com/images/parking5-2.jpg',
    ],
    rating: 4.3,
    reviews: [],
    operatingHours: [
      {
        day: 'Monday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Tuesday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Wednesday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Thursday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Friday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Saturday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
      {
        day: 'Sunday',
        open: '00:00',
        close: '23:59',
        isClosed: false,
      },
    ],
    vehicleTypeRates: [
      {
        vehicleType: 'Two Wheeler',
        hourlyMultiplier: 0.5,
      },
      {
        vehicleType: 'Hatchback',
        hourlyMultiplier: 1.0,
      },
      {
        vehicleType: 'Sedan',
        hourlyMultiplier: 1.2,
      },
      {
        vehicleType: 'SUV',
        hourlyMultiplier: 1.5,
      },
      {
        vehicleType: 'Electric Vehicle',
        hourlyMultiplier: 0.8,
      },
    ],
    status: 'active',
  },
];

// Sample rides data
const generateRides = (userIds: string[]) => {
  const rides = [
    {
      userId: userIds[1], // Ramesh
      origin: {
        name: 'Home',
        address: '123 Main Street, Bangalore',
        coordinates: {
          latitude: 12.9718,
          longitude: 77.5858,
        },
      },
      destination: {
        name: 'Bangalore MG Road Metro',
        address: 'MG Road Metro Station, MG Road',
        coordinates: {
          latitude: 12.9767,
          longitude: 77.6008,
        },
      },
      rideType: 'standard',
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      estimatedArrival: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
      distance: 5.2,
      duration: 25,
      fare: 120,
      status: 'scheduled',
      paymentStatus: 'pending',
      paymentMethod: 'card',
      routeCoordinates: [
        {
          latitude: 12.9718,
          longitude: 77.5858,
        },
        {
          latitude: 12.9742,
          longitude: 77.5932,
        },
        {
          latitude: 12.9767,
          longitude: 77.6008,
        },
      ],
      stops: [
        {
          name: 'Pickup Point',
          address: '123 Main Street, Bangalore',
          coordinates: {
            latitude: 12.9718,
            longitude: 77.5858,
          },
          estimatedTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          status: 'pending',
        },
        {
          name: 'Destination',
          address: 'MG Road Metro Station, MG Road',
          coordinates: {
            latitude: 12.9767,
            longitude: 77.6008,
          },
          estimatedTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
          status: 'pending',
        },
      ],
      vehicleDetails: {
        type: 'Sedan',
        model: 'Honda City',
        color: 'White',
        licensePlate: 'KA-01-AB-1234',
      },
    },
    {
      userId: userIds[2], // Priya
      origin: {
        name: 'Office',
        address: 'Cyber Towers, Hitec City',
        coordinates: {
          latitude: 17.4508,
          longitude: 78.3807,
        },
      },
      destination: {
        name: 'Home',
        address: '456 Park Avenue, Mumbai',
        coordinates: {
          latitude: 19.0213,
          longitude: 72.8426,
        },
      },
      rideType: 'premium',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      estimatedArrival: new Date(Date.now() + 24.5 * 60 * 60 * 1000), // 24.5 hours from now
      distance: 8.7,
      duration: 35,
      fare: 250,
      status: 'scheduled',
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      routeCoordinates: [
        {
          latitude: 17.4508,
          longitude: 78.3807,
        },
        {
          latitude: 17.4608,
          longitude: 78.3907,
        },
        {
          latitude: 17.4708,
          longitude: 78.4007,
        },
      ],
      stops: [
        {
          name: 'Pickup Point',
          address: 'Cyber Towers, Hitec City',
          coordinates: {
            latitude: 17.4508,
            longitude: 78.3807,
          },
          estimatedTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'pending',
        },
        {
          name: 'Destination',
          address: '456 Park Avenue, Mumbai',
          coordinates: {
            latitude: 19.0213,
            longitude: 72.8426,
          },
          estimatedTime: new Date(Date.now() + 24.5 * 60 * 60 * 1000),
          status: 'pending',
        },
      ],
      vehicleDetails: {
        type: 'SUV',
        model: 'Toyota Fortuner',
        color: 'Black',
        licensePlate: 'MH-02-CD-5678',
      },
    },
    {
      userId: userIds[3], // Suresh
      origin: {
        name: 'Chennai Central',
        address: 'Central Railway Station, EVR Periyar Salai',
        coordinates: {
          latitude: 13.0827,
          longitude: 80.2707,
        },
      },
      destination: {
        name: 'Home',
        address: '789 Gandhi Road, Chennai',
        coordinates: {
          latitude: 13.0569,
          longitude: 80.2425,
        },
      },
      rideType: 'auto-rickshaw',
      scheduledTime: new Date(), // Now
      estimatedArrival: new Date(Date.now() + 0.5 * 60 * 60 * 1000), // 30 minutes from now
      distance: 3.5,
      duration: 18,
      fare: 80,
      status: 'in-progress',
      paymentStatus: 'pending',
      paymentMethod: 'cash',
      routeCoordinates: [
        {
          latitude: 13.0827,
          longitude: 80.2707,
        },
        {
          latitude: 13.0727,
          longitude: 80.2607,
        },
        {
          latitude: 13.0627,
          longitude: 80.2507,
        },
        {
          latitude: 13.0569,
          longitude: 80.2425,
        },
      ],
      currentPosition: {
        latitude: 13.0727,
        longitude: 80.2607,
      },
      stops: [
        {
          name: 'Pickup Point',
          address: 'Central Railway Station, EVR Periyar Salai',
          coordinates: {
            latitude: 13.0827,
            longitude: 80.2707,
          },
          estimatedTime: new Date(),
          status: 'completed',
        },
        {
          name: 'Destination',
          address: '789 Gandhi Road, Chennai',
          coordinates: {
            latitude: 13.0569,
            longitude: 80.2425,
          },
          estimatedTime: new Date(Date.now() + 0.5 * 60 * 60 * 1000),
          status: 'pending',
        },
      ],
      vehicleDetails: {
        type: 'Auto-Rickshaw',
        model: 'Bajaj RE',
        color: 'Yellow',
        licensePlate: 'TN-01-E-9012',
      },
    },
  ];
  
  return rides;
};

// Sample parking bookings
const generateParkingBookings = (
  userIds: string[],
  facilityIds: string[]
) => {
  const bookings = [
    {
      userId: userIds[1], // Ramesh
      facilityId: facilityIds[0], // Bangalore MG Road Metro
      startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      endTime: new Date(Date.now() + 7 * 60 * 60 * 1000), // 7 hours from now
      vehicleType: 'Sedan',
      vehicleLicensePlate: 'KA-01-AB-1234',
      price: 240, // 4 hours * 50 * 1.2
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      specialInstructions: 'Please park in a covered area if possible.',
    },
    {
      userId: userIds[2], // Priya
      facilityId: facilityIds[2], // Hyderabad Cyber Towers
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      endTime: new Date(Date.now() + 30 * 60 * 60 * 1000), // 30 hours from now
      vehicleType: 'SUV',
      vehicleLicensePlate: 'AP-28-BD-9876',
      price: 405, // 6 hours * 45 * 1.5
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      specialInstructions: 'Will need EV charging.',
    },
    {
      userId: userIds[3], // Suresh
      facilityId: facilityIds[1], // Chennai Central
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      vehicleType: 'Two Wheeler',
      vehicleLicensePlate: 'TN-01-AC-5678',
      price: 90, // 6 hours * 30 * 0.5
      bookingStatus: 'checked-in',
      paymentStatus: 'paid',
      paymentMethod: 'wallet',
      bookingCode: 'PK-ABC123',
    },
  ];
  
  return bookings;
};

// Generate payments based on bookings and rides
const generatePayments = (
  userIds: string[],
  bookingIds: string[] = [],
  rideIds: string[] = []
) => {
  const payments = [];
  
  // Payments for parking bookings
  if (bookingIds.length > 0) {
    payments.push({
      userId: userIds[1], // Ramesh
      amount: 240,
      currency: 'INR',
      paymentMethod: 'card',
      status: 'completed',
      bookingType: 'parking',
      bookingId: bookingIds[0],
      cardDetails: {
        last4: '4242',
        brand: 'Visa',
        expiryMonth: '12',
        expiryYear: '2025',
      },
      billingAddress: {
        name: 'Ramesh Kumar',
        line1: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India',
      },
    });
    
    payments.push({
      userId: userIds[3], // Suresh
      amount: 90,
      currency: 'INR',
      paymentMethod: 'wallet',
      status: 'completed',
      bookingType: 'parking',
      bookingId: bookingIds[2],
    });
  }
  
  // Payments for rides
  if (rideIds.length > 0) {
    payments.push({
      userId: userIds[3], // Suresh
      amount: 80,
      currency: 'INR',
      paymentMethod: 'cash',
      status: 'pending',
      bookingType: 'ride',
      bookingId: rideIds[2],
    });
  }
  
  return payments;
};

// Import Data
const importData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany({});
    await ParkingFacility.deleteMany({});
    await Ride.deleteMany({});
    await ParkingBooking.deleteMany({});
    await Payment.deleteMany({});
    
    console.log('Data cleared from database');
    
    // Hash passwords and create users
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        return await User.create({
          ...user,
          password: hashedPassword,
        });
      })
    );
    
    console.log(`${createdUsers.length} users created`);
    
    // Extract user IDs
    const userIds = createdUsers.map((user) => user._id);
    
    // Create parking facilities
    const createdFacilities = await ParkingFacility.insertMany(parkingFacilities);
    console.log(`${createdFacilities.length} parking facilities created`);
    
    // Extract facility IDs
    const facilityIds = createdFacilities.map((facility) => facility._id);
    
    // Create rides
    const ridesData = generateRides(userIds as unknown as string[]);
    const createdRides = await Ride.insertMany(ridesData);
    console.log(`${createdRides.length} rides created`);
    
    // Extract ride IDs
    const rideIds = createdRides.map((ride) => ride._id);
    
    // Create parking bookings
    const bookingsData = generateParkingBookings(
      userIds as unknown as string[],
      facilityIds as unknown as string[]
    );
    const createdBookings = await ParkingBooking.insertMany(bookingsData);
    console.log(`${createdBookings.length} parking bookings created`);
    
    // Extract booking IDs
    const bookingIds = createdBookings.map((booking) => booking._id);
    
    // Create payments
    const paymentsData = generatePayments(
      userIds as unknown as string[],
      bookingIds as unknown as string[],
      rideIds as unknown as string[]
    );
    const createdPayments = await Payment.insertMany(paymentsData);
    console.log(`${createdPayments.length} payments created`);
    
    console.log('Data import complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Execute data import
importData(); 