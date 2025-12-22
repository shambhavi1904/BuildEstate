import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectdb = async () => {
  try {
    // Check if MongoDB URI is provided
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined. Please create backend/.env.local file with your MongoDB connection string.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // Increased timeout for better stability
      socketTimeoutMS: 45000
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset retry count on successful connection
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      retryCount = 0;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    retryCount++;
    
    // Provide helpful error messages
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n❌ MongoDB Connection Error: IP Address Not Whitelisted');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('📋 To fix this issue:');
      console.error('   1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
      console.error('   2. Navigate to your cluster → Network Access');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Add Current IP Address" (or add 0.0.0.0/0 for all IPs - less secure)');
      console.error('   5. Wait 1-2 minutes for changes to propagate');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else if (error.message.includes('authentication')) {
      console.error('\n❌ MongoDB Connection Error: Authentication Failed');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('📋 Check your MONGO_URI in backend/.env.local:');
      console.error('   - Verify username and password are correct');
      console.error('   - Ensure database user has proper permissions');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else if (error.message.includes('MONGO_URI')) {
      console.error(`\n❌ ${error.message}`);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('📋 Create backend/.env.local file with:');
      console.error('   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/buildestate');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    }

    // Retry logic for both development and production
    if (retryCount < MAX_RETRIES) {
      console.log(`🔄 Retrying connection (${retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY / 1000} seconds...`);
      setTimeout(() => {
        // Wrap in promise to catch any errors from recursive call
        connectdb().catch(err => {
          // Error is already logged in the catch block above
          // Just prevent unhandled rejection
        });
      }, RETRY_DELAY);
    } else {
      console.error('\n❌ Maximum retry attempts reached. Please fix the MongoDB connection issue.');
      console.error('💡 The server will continue running, but database operations will fail.');
      console.error('💡 Fix the issue and restart the server, or the connection will retry automatically.\n');

      // Don't exit - allow server to continue running
      // Set up a longer retry interval for failed connections
      setTimeout(() => {
        retryCount = 0; // Reset after waiting longer
        console.log('🔄 Attempting to reconnect to MongoDB...');
        // Wrap in promise to catch any errors from recursive call
        connectdb().catch(err => {
          // Error is already logged in the catch block above
          // Just prevent unhandled rejection
        });
      }, 30000); // Wait 30 seconds before next retry cycle
    }
    
    // Don't re-throw the error - let the server continue running
    // The connection will retry automatically
  }
};

export default connectdb;