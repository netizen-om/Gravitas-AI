const axios = require('axios');
require('dotenv').config();

async function testOnboarding() {
  console.log('Testing onboarding flow...');
  
  try {
    // Test 1: Check if the update-username endpoint is accessible
    console.log('\n1. Testing update-username endpoint...');
    try {
      const response = await axios.post('http://localhost:3000/api/user/update-username', {
        username: 'testuser'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Update username endpoint accessible');
    } catch (error) {
      console.log('❌ Update username endpoint error:', error.response?.status, error.response?.data?.error);
    }

    // Test 2: Check if the send-verification-email endpoint is accessible
    console.log('\n2. Testing send-verification-email endpoint...');
    try {
      const response = await axios.post('http://localhost:3000/api/send-verification-email', {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Send verification email endpoint accessible');
    } catch (error) {
      console.log('❌ Send verification email endpoint error:', error.response?.status, error.response?.data?.error);
    }

    // Test 3: Check environment variables
    console.log('\n3. Checking environment variables...');
    const requiredEnvVars = [
      'MAILTRAP_HOST',
      'MAILTRAP_PORT', 
      'MAILTRAP_USER',
      'MAILTRAP_PASS',
      'JWT_SECRET',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ];

    requiredEnvVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        console.log(`✅ ${varName}: ${varName.includes('SECRET') || varName.includes('PASS') ? '***' : value}`);
      } else {
        console.log(`❌ ${varName}: NOT SET`);
      }
    });

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testOnboarding(); 