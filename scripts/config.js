#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🎫 VenueBit Demo Configuration\n');

rl.question('Enter your Optimizely SDK Key: ', (sdkKey) => {
  if (!sdkKey || !sdkKey.trim()) {
    console.log('❌ SDK Key is required');
    rl.close();
    process.exit(1);
  }

  const envContent = `# Optimizely SDK Key
OPTIMIZELY_SDK_KEY=${sdkKey.trim()}

# Datafile polling interval (1 second for real-time updates)
POLLING_INTERVAL=1000
`;

  const envPath = path.join(__dirname, '..', '.env');

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env');
  console.log('   - SDK Key: ' + sdkKey.trim().substring(0, 8) + '...');
  console.log('   - Polling Interval: 1000ms (1 second)\n');
  console.log('Run "npm run start" to start the demo.\n');

  rl.close();
});
