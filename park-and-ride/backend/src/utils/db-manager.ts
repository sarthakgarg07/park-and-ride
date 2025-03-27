import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Display menu
const displayMenu = () => {
  console.log('\n=== DATABASE MANAGER ===');
  console.log('1. Show database status');
  console.log('2. Count documents in collections');
  console.log('3. Clear all data');
  console.log('4. Clear specific collection');
  console.log('5. Add sample user');
  console.log('6. List all users');
  console.log('7. List all parking facilities');
  console.log('8. Exit');
  
  rl.question('\nEnter your choice (1-8): ', (choice) => {
    switch (choice) {
      case '1':
        showDatabaseStatus();
        break;
      case '2':
        countDocuments();
        break;
      case '3':
        clearAllData();
        break;
      case '4':
        clearSpecificCollection();
        break;
      case '5':
        addSampleUser();
        break;
      case '6':
        listAllUsers();
        break;
      case '7':
        listAllFacilities();
        break;
      case '8':
        console.log('Exiting...');
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  });
};

// Show database status
const showDatabaseStatus = async () => {
  try {
    console.log('\n=== DATABASE STATUS ===');
    console.log(`MongoDB Connection: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Not Connected'}`);
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Server: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    displayMenu();
  } catch (error) {
    console.error('Error checking database status:', error);
    displayMenu();
  }
};

// Count documents in collections
const countDocuments = async () => {
  try {
    const userCount = await User.countDocuments();
    const facilityCount = await ParkingFacility.countDocuments();
    const rideCount = await Ride.countDocuments();
    const bookingCount = await ParkingBooking.countDocuments();
    const paymentCount = await Payment.countDocuments();
    
    console.log('\n=== COLLECTION STATS ===');
    console.log(`Users: ${userCount} documents`);
    console.log(`Parking Facilities: ${facilityCount} documents`);
    console.log(`Rides: ${rideCount} documents`);
    console.log(`Parking Bookings: ${bookingCount} documents`);
    console.log(`Payments: ${paymentCount} documents`);
    
    displayMenu();
  } catch (error) {
    console.error('Error counting documents:', error);
    displayMenu();
  }
};

// Clear all data
const clearAllData = async () => {
  rl.question('\nAre you sure you want to clear ALL data? This action cannot be undone. (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes') {
      try {
        await User.deleteMany({});
        await ParkingFacility.deleteMany({});
        await Ride.deleteMany({});
        await ParkingBooking.deleteMany({});
        await Payment.deleteMany({});
        
        console.log('All data cleared successfully!');
      } catch (error) {
        console.error('Error clearing data:', error);
      }
    } else {
      console.log('Operation cancelled.');
    }
    displayMenu();
  });
};

// Clear specific collection
const clearSpecificCollection = () => {
  console.log('\n=== CLEAR SPECIFIC COLLECTION ===');
  console.log('1. Users');
  console.log('2. Parking Facilities');
  console.log('3. Rides');
  console.log('4. Parking Bookings');
  console.log('5. Payments');
  console.log('6. Back to main menu');
  
  rl.question('\nEnter your choice (1-6): ', async (choice) => {
    let collection;
    let collectionName = '';
    
    switch (choice) {
      case '1':
        collection = User;
        collectionName = 'Users';
        break;
      case '2':
        collection = ParkingFacility;
        collectionName = 'Parking Facilities';
        break;
      case '3':
        collection = Ride;
        collectionName = 'Rides';
        break;
      case '4':
        collection = ParkingBooking;
        collectionName = 'Parking Bookings';
        break;
      case '5':
        collection = Payment;
        collectionName = 'Payments';
        break;
      case '6':
        displayMenu();
        return;
      default:
        console.log('Invalid choice. Please try again.');
        clearSpecificCollection();
        return;
    }
    
    rl.question(`\nAre you sure you want to clear all ${collectionName}? This action cannot be undone. (yes/no): `, async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        try {
          await collection.deleteMany({});
          console.log(`All ${collectionName} cleared successfully!`);
        } catch (error) {
          console.error(`Error clearing ${collectionName}:`, error);
        }
      } else {
        console.log('Operation cancelled.');
      }
      displayMenu();
    });
  });
};

// Add sample user
const addSampleUser = () => {
  rl.question('\nEnter user name: ', (name) => {
    rl.question('Enter user email: ', (email) => {
      rl.question('Enter user password: ', (password) => {
        rl.question('Enter user phone (optional): ', (phone) => {
          rl.question('Enter user role (user/admin): ', async (role) => {
            try {
              const newUser = new User({
                name,
                email,
                password,
                phone: phone || undefined,
                role: role === 'admin' ? 'admin' : 'user',
                isEmailVerified: true,
              });
              
              await newUser.save();
              console.log(`User created successfully: ${name} (${email})`);
            } catch (error) {
              console.error('Error creating user:', error);
            }
            displayMenu();
          });
        });
      });
    });
  });
};

// List all users
const listAllUsers = async () => {
  try {
    const users = await User.find().select('-password');
    
    console.log('\n=== ALL USERS ===');
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      });
    }
  } catch (error) {
    console.error('Error listing users:', error);
  }
  displayMenu();
};

// List all facilities
const listAllFacilities = async () => {
  try {
    const facilities = await ParkingFacility.find();
    
    console.log('\n=== ALL PARKING FACILITIES ===');
    if (facilities.length === 0) {
      console.log('No parking facilities found.');
    } else {
      facilities.forEach((facility, index) => {
        console.log(`${index + 1}. ${facility.name} - ${facility.city} (${facility.availableSpots}/${facility.totalSpots} spots available)`);
      });
    }
  } catch (error) {
    console.error('Error listing facilities:', error);
  }
  displayMenu();
};

// Close connection when exiting
rl.on('close', () => {
  mongoose.connection.close();
  process.exit(0);
});

// Start the app
console.log('Connecting to MongoDB...');
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB!');
  displayMenu();
}); 