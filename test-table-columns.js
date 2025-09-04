// Test script to understand what columns exist in card_configs
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

async function testColumns() {
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
    console.log('Testing minimal insert to understand column structure...');
    
    // Try inserting with just one basic field to see which field names work
    const testFields = [
      'id',
      'name', 
      'firstName', 'first_name',
      'lastName', 'last_name', 
      'title',
      'company',
      'email',
      'mobile', 'phone',
      'created_at', 'createdAt'
    ];

    // Try each field individually
    for (const field of testFields) {
      try {
        const testData = {};
        testData[field] = field === 'email' ? 'test@example.com' : `test-${field}`;
        
        const { data, error } = await supabase
          .from('card_configs')
          .insert([testData])
          .select()
          .single();

        if (error) {
          if (error.code === 'PGRST204') {
            console.log(`❌ Field '${field}' doesn't exist`);
          } else {
            console.log(`⚠️  Field '${field}' exists but error:`, error.message);
          }
        } else {
          console.log(`✅ Field '${field}' works! Inserted:`, data);
          // Clean up the test record
          await supabase.from('card_configs').delete().eq('id', data.id);
        }
      } catch (e) {
        console.log(`❌ Field '${field}' exception:`, e.message);
      }
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testColumns().catch(console.error);