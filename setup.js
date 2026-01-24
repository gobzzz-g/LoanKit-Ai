#!/usr/bin/env node

/**
 * Setup Script for LoanKitTechathon Project
 * Automates environment setup and dependency installation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function execCommand(command, cwd = __dirname) {
  try {
    console.log(`\n🔄 Running: ${command}`);
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    return false;
  }
}

async function setup() {
  console.log('🚀 LoanKitTechathon - Agentic AI Setup\n');
  console.log('This script will:');
  console.log('1. Install backend dependencies');
  console.log('2. Install frontend dependencies');
  console.log('3. Create environment files');
  console.log('4. Verify installation\n');

  const proceed = await question('Continue? (y/n): ');
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    rl.close();
    return;
  }

  // Backend setup
  console.log('\n📦 Setting up backend...');
  const backendPath = path.join(__dirname, 'backend');
  
  if (!execCommand('npm install', backendPath)) {
    console.error('Backend installation failed!');
    process.exit(1);
  }

  // Check if .env exists
  const envPath = path.join(backendPath, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('\n🔑 Setting up backend environment...');
    const apiKLoanKit= await question('Enter your Gemini API Key: ');
    
    const envContent = `PORT=3000
GEMINI_API_KEY=${apiKey}
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Backend .env created');
  } else {
    console.log('✅ Backend .env already exists');
  }

  // Frontend setup
  console.log('\n📦 Setting up frontend...');
  const frontendPath = path.join(__dirname, 'frontend');
  
  if (!execCommand('npm install', frontendPath)) {
    console.error('Frontend installation failed!');
    process.exit(1);
  }

  // Frontend .env
  const frontendEnvPath = path.join(frontendPath, '.env');
  if (!fs.existsSync(frontendEnvPath)) {
    const frontendEnvContent = 'VITE_API_URL=http://localhost:3000/api\n';
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('✅ Frontend .env created');
  } else {
    console.log('✅ Frontend .env already exists');
  }

  // Success message
  console.log('\n✨ Setup complete!\n');
  console.log('To start the application:');
  console.log('\n1. Start backend (Terminal 1):');
  console.log('   cd backend');
  console.log('   npm run dev');
  console.log('\n2. Start frontend (Terminal 2):');
  console.log('   cd frontend');
  console.log('   npm run dev');
  console.log('\n3. Open browser to: http://localhost:5173\n');
  console.log('📖 Check QUICKSTART.md for detailed instructions');
  
  rl.close();
}

setup();
