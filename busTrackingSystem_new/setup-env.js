#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create .env file with default values
const envContent = `# Upload configuration
UPLOAD_PATH=uploads/CommentImages

# Database configuration (update with your actual values)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bus_tracking
DB_USER=postgres
DB_PASSWORD=postgres123

# Email configuration (update with your actual values)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# JWT configuration (update with your actual values)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server configuration
PORT=3000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please update the values in .env file with your actual configuration.');
  } else {
    console.log('⚠️  .env file already exists. Skipping creation.');
  }
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
}