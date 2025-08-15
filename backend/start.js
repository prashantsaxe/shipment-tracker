#!/usr/bin/env node

// Quick start script for development
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Shipment Tracker Backend...\n');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    console.log('⚠️  .env file not found!');
    console.log('Please create a .env file with the following variables:\n');
    console.log('NODE_ENV=development');
    console.log('PORT=5000');
    console.log('MONGODB_URI=your-mongodb-connection-string');
    console.log('JWT_SECRET=your-jwt-secret-key');
    console.log('GEMINI_API_KEY=your-gemini-api-key\n');
    console.log('See README.md for detailed setup instructions.');
    process.exit(1);
}

// Start the server
const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    cwd: __dirname
});

server.on('close', (code) => {
    console.log(`\n📦 Backend server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down backend server...');
    server.kill('SIGINT');
});
