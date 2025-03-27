import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/park-and-ride';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

// List available backups
const listBackups = () => {
  const backupDir = path.join(__dirname, '../../backups');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('No backups found. Backup directory created.');
    rl.close();
    return [];
  }
  
  // Get list of backup files
  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.gz'))
    .sort((a, b) => {
      // Sort by file modification time (most recent first)
      const statA = fs.statSync(path.join(backupDir, a));
      const statB = fs.statSync(path.join(backupDir, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });
  
  if (files.length === 0) {
    console.log('No backups found.');
    rl.close();
    return [];
  }
  
  console.log('\nAvailable backups:');
  files.forEach((file, index) => {
    const stats = fs.statSync(path.join(backupDir, file));
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    const modifiedDate = stats.mtime.toLocaleString();
    console.log(`${index + 1}. ${file} (${sizeInMB} MB) - ${modifiedDate}`);
  });
  
  return files;
};

// Restore backup
const restoreBackup = (backupFileName: string) => {
  // Parse MongoDB URI
  const { username, password, host, port, database } = parseMongoUri(MONGODB_URI);
  
  // Get backup file path
  const backupDir = path.join(__dirname, '../../backups');
  const backupFilePath = path.join(backupDir, backupFileName);
  
  // Check if file exists
  if (!fs.existsSync(backupFilePath)) {
    console.error(`Backup file not found: ${backupFilePath}`);
    rl.close();
    return;
  }
  
  // Build mongorestore command
  let mongorestoreCmd = `mongorestore --host ${host} --port ${port} --db ${database} --drop --gzip --archive=${backupFilePath}`;
  
  // Add authentication if provided
  if (username && password) {
    mongorestoreCmd += ` --username ${username} --password ${password} --authenticationDatabase admin`;
  }
  
  console.log('\nRestoring database backup...');
  console.log(`Database: ${database}`);
  console.log(`Host: ${host}:${port}`);
  console.log(`Backup file: ${backupFileName}`);
  
  // Execute mongorestore
  exec(mongorestoreCmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error restoring backup: ${error.message}`);
      rl.close();
      return;
    }
    
    if (stderr) {
      console.warn(`Warnings: ${stderr}`);
    }
    
    console.log('\nBackup restored successfully!');
    rl.close();
  });
};

// Main function
const main = () => {
  console.log('MongoDB Database Restore Utility');
  
  // List available backups
  const files = listBackups();
  
  if (files.length === 0) {
    return;
  }
  
  // Prompt user to select a backup
  rl.question('\nEnter the number of the backup to restore (or press Enter to exit): ', (answer) => {
    const index = parseInt(answer, 10) - 1;
    
    if (isNaN(index) || index < 0 || index >= files.length) {
      console.log('No valid backup selected. Exiting...');
      rl.close();
      return;
    }
    
    const selectedBackup = files[index];
    
    // Confirm restore
    rl.question(`\nAre you sure you want to restore from ${selectedBackup}? This will REPLACE ALL DATA in the database. (yes/no): `, (confirm) => {
      if (confirm.toLowerCase() === 'yes') {
        restoreBackup(selectedBackup);
      } else {
        console.log('Restore cancelled.');
        rl.close();
      }
    });
  });
};

// Close connection when exiting
rl.on('close', () => {
  process.exit(0);
});

// Execute main function
main(); 