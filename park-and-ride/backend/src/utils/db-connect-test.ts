import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/park-and-ride';

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log(`Connection URI: ${MONGODB_URI}`);
  
  try {
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
    };
    
    // Connect to the database
    await mongoose.connect(MONGODB_URI, options);
    
    // Check connection state
    const state = mongoose.connection.readyState;
    console.log('\n✅ Connection successful!');
    console.log(`Connection state: ${getReadyStateString(state)}`);
    
    if (mongoose.connection.db) {
      console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
      console.log(`MongoDB server: ${mongoose.connection.host}:${mongoose.connection.port}`);
      
      // Ping the database
      try {
        const adminDb = mongoose.connection.db.admin();
        const serverInfo = await adminDb.serverInfo();
        console.log(`MongoDB version: ${serverInfo.version}`);
        
        // Get list of collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\nAvailable collections (${collections.length}):`);
        if (collections.length === 0) {
          console.log('No collections found. You may need to run the seed script.');
        } else {
          collections.forEach(collection => {
            console.log(`- ${collection.name}`);
          });
        }
      } catch (err) {
        console.error('Error getting database information:', err);
      }
    }
  } catch (error: any) {
    console.error('\n❌ Connection failed!');
    console.error('Error details:', error);
    
    // Provide more specific error handling for common issues
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nPossible causes:');
      console.error('1. MongoDB server is not running');
      console.error('2. MongoDB URI is incorrect');
      console.error('3. Network connectivity issues');
      console.error('\nSuggestions:');
      console.error('- Check if MongoDB server is running with: docker ps');
      console.error('- Verify your connection string in .env file');
      console.error('- Try starting MongoDB with: npm run db:start');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
  }
}

// Helper function to convert readyState to string
function getReadyStateString(state: number): string {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}

// Run the test
testConnection();