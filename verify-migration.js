#!/usr/bin/env node

/**
 * Firebase Functions Migration Verification Script
 * Run this to verify your migration is complete
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, successMsg, failMsg) {
  if (condition) {
    checks.push(`✅ ${name}: ${successMsg}`);
    passed++;
  } else {
    checks.push(`❌ ${name}: ${failMsg}`);
    failed++;
  }
}

console.log('🔍 Running Firebase Functions Migration Verification...\n');

// Check 1: functions/package.json has type: module
try {
  const pkg = JSON.parse(readFileSync('./functions/package.json', 'utf8'));
  check(
    'ES Modules',
    pkg.type === 'module',
    'package.json has "type": "module"',
    'package.json missing "type": "module"'
  );
} catch (e) {
  check('ES Modules', false, '', 'Cannot read functions/package.json');
}

// Check 2: functions/index.js exists
check(
  'Entry Point',
  existsSync('./functions/index.js'),
  'functions/index.js exists',
  'functions/index.js not found'
);

// Check 3: firebase.json has functions config
try {
  const firebaseConfig = JSON.parse(readFileSync('./firebase.json', 'utf8'));
  check(
    'Firebase Config',
    firebaseConfig.functions !== undefined,
    'firebase.json configured for functions',
    'firebase.json missing functions config'
  );
  
  check(
    'Hosting Rewrite',
    firebaseConfig.hosting?.rewrites?.some(r => r.source === '/api/**'),
    'Hosting rewrite configured for /api/**',
    'Missing hosting rewrite for /api/**'
  );
} catch (e) {
  check('Firebase Config', false, '', 'Cannot read firebase.json');
}

// Check 4: functions/routes exist
const routes = ['auth.js', 'chat.js', 'agents.js', 'pdf.js'];
routes.forEach(route => {
  check(
    `Route: ${route}`,
    existsSync(`./functions/routes/${route}`),
    `Route exists`,
    `Route not found`
  );
});

// Check 5: functions/services exist
const services = ['gemini.js', 'userDatabase.js', 'persuasionLogic.js', 'mockData.js'];
services.forEach(service => {
  check(
    `Service: ${service}`,
    existsSync(`./functions/services/${service}`),
    `Service exists`,
    `Service not found`
  );
});

// Check 6: functions/agents exist
check(
  'Master Agent',
  existsSync('./functions/agents/masterAgent.js'),
  'masterAgent.js exists',
  'masterAgent.js not found'
);

// Check 7: Frontend env configured
try {
  const prodEnv = readFileSync('./frontend/.env.production', 'utf8');
  check(
    'Frontend API URL',
    prodEnv.includes('loankit-ai-demo.web.app'),
    'Frontend configured to use Firebase',
    'Frontend not configured for Firebase'
  );
} catch (e) {
  check('Frontend API URL', false, '', 'Cannot read frontend/.env.production');
}

// Check 8: .env.example exists
check(
  'Env Template',
  existsSync('./functions/.env.example'),
  '.env.example exists',
  '.env.example not found'
);

// Print results
console.log('\n' + '='.repeat(60));
console.log('VERIFICATION RESULTS');
console.log('='.repeat(60) + '\n');

checks.forEach(c => console.log(c));

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60) + '\n');

if (failed === 0) {
  console.log('🎉 All checks passed! Your migration is complete.');
  console.log('\n📝 Next Steps:');
  console.log('   1. cd functions && npm install');
  console.log('   2. firebase functions:config:set gemini.api_key="YOUR_KEY"');
  console.log('   3. firebase deploy --only functions');
  console.log('   4. Test: curl https://loankit-ai-demo.web.app/health\n');
} else {
  console.log('⚠️  Some checks failed. Please review the issues above.');
  process.exit(1);
}
