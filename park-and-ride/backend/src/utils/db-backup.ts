import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/park-and-ride';

// Parse MongoDB URI
const parseMongoUri = (uri: string) => {
  try {
    const regex = /mongodb:\/\/(?:([^:]+):([^@]+)@)?([^:]+)(?::(\d+))?\/([^?]+)/;
    const match = uri.match(regex);
    
    if (!match) {
      throw new Error('Invalid MongoDB URI format');
    }
    
    const [, username, password, host, port = '27017', database] = match;
    
    return {
      username,
      password,
      host,
      port,
      database,
    };
  } catch (error) {
    console.error('Error parsing MongoDB URI:', error);
    process.exit(1);
  }
};

// Create backup
const createBackup = () => {
  // Parse MongoDB URI
  const { username, password, host, port, database } = parseMongoUri(MONGODB_URI);
  
  // Create backup directory if it doesn't exist
  const backupDir = path.join(__dirname, '../../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Generate backup filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `${database}_${timestamp}.gz`;
  const backupFilePath = path.join(backupDir, backupFileName);
  
  // Build mongodump command
  let mongodumpCmd = `mongodump --host ${host} --port ${port} --db ${database} --gzip --archive=${backupFilePath}`;
  
  // Add authentication if provided
  if (username && password) {
    mongodumpCmd += ` --username ${username} --password ${password} --authenticationDatabase admin`;
  }
  
  console.log('Creating database backup...');
  console.log(`Database: ${database}`);
  console.log(`Host: ${host}:${port}`);
  
  // Execute mongodump
  exec(mongodumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating backup: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.warn(`Warnings: ${stderr}`);
    }
    
    const backupSize = fs.statSync(backupFilePath).size;
    const sizeInMB = (backupSize / (1024 * 1024)).toFixed(2);
    
    console.log(`\nBackup created successfully: ${backupFileName}`);
    console.log(`Backup size: ${sizeInMB} MB`);
    console.log(`Backup location: ${backupFilePath}`);
  });
};

// Execute backup
createBackup(); 