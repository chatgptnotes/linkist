// Test script to understand the actual card_configs table structure
const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
  }
});

async function testTableStructure() {
  const supabase = createClient(
    envVars.NEXT_PUBLIC_SUPABASE_URL,
    envVars.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Try to get the table structure by attempting a simple insert with minimal data
    console.log('Testing table structure...');
    
    // First, let's see if there are any existing records to understand the structure
    const { data: existingData, error: selectError } = await supabase
      .from('card_configs')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('Error selecting from card_configs:', selectError);
    } else {
      console.log('Existing records:', existingData);
      if (existingData && existingData.length > 0) {
        console.log('Sample record structure:', Object.keys(existingData[0]));
      }
    }

    // Try a minimal insert to see what fields are actually expected
    const { data: insertData, error: insertError } = await supabase
      .from('card_configs')
      .insert([{
        firstName: 'Test',
        lastName: 'User',
        title: 'Test Title',
        company: 'Test Company',
        mobile: '1234567890',
        email: 'test@example.com',
        quantity: 1,
        status: 'draft',
        mobileVerified: false,
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error with camelCase fields:', insertError);
      
      // Try with snake_case
      const { data: snakeData, error: snakeError } = await supabase
        .from('card_configs')
        .insert([{
          first_name: 'Test',
          last_name: 'User',
          title: 'Test Title',
          company: 'Test Company',
          mobile: '1234567890',
          email: 'test@example.com',
          quantity: 1,
          status: 'draft',
          mobile_verified: false,
        }])
        .select()
        .single();

      if (snakeError) {
        console.error('Error with snake_case fields:', snakeError);
      } else {
        console.log('✅ Success with snake_case:', snakeData);
      }
    } else {
      console.log('✅ Success with camelCase:', insertData);
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testTableStructure().catch(console.error);