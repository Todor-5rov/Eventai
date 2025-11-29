#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('╔═══════════════════════════════════════════════╗');
  console.log('║   EventAI - Interactive Setup Assistant      ║');
  console.log('╚═══════════════════════════════════════════════╝\n');

  // Check if .env already exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📋 Let\'s configure your environment variables...\n');

  // Supabase
  console.log('🗄️  SUPABASE CONFIGURATION');
  console.log('   Get these from: https://supabase.com/dashboard\n');
  
  const supabaseUrl = await question('Supabase URL: ');
  const supabaseAnonKey = await question('Supabase Anon Key: ');
  const supabaseServiceRole = await question('Supabase Service Role Key: ');

  // OpenAI
  console.log('\n🤖 OPENAI CONFIGURATION');
  console.log('   Get your API key from: https://platform.openai.com/api-keys\n');
  
  const openaiKey = await question('OpenAI API Key: ');

  // Gmail
  console.log('\n📧 GMAIL API CONFIGURATION');
  console.log('   See docs/gmail-setup.md for detailed instructions\n');
  
  const gmailClientId = await question('Gmail Client ID: ');
  const gmailClientSecret = await question('Gmail Client Secret: ');
  const gmailRefreshToken = await question('Gmail Refresh Token: ');
  const gmailUserEmail = await question('Gmail User Email: ');

  // Create .env file
  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE=${supabaseServiceRole}

# OpenAI Configuration
OPENAI_KEY=${openaiKey}

# Gmail API Configuration
GMAIL_CLIENT_ID=${gmailClientId}
GMAIL_CLIENT_SECRET=${gmailClientSecret}
GMAIL_REFRESH_TOKEN=${gmailRefreshToken}
GMAIL_USER_EMAIL=${gmailUserEmail}
`;

  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ Configuration saved to .env\n');
  console.log('📚 Next steps:');
  console.log('   1. Run database migration (see docs/supabase-setup.md)');
  console.log('   2. Create storage bucket in Supabase');
  console.log('   3. Run: npm run dev');
  console.log('   4. Open: http://localhost:3000\n');
  console.log('📖 For detailed setup instructions, see SETUP.md\n');

  rl.close();
}

setup().catch(error => {
  console.error('Error during setup:', error);
  process.exit(1);
});

