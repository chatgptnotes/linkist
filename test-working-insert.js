// Test script to successfully insert a record and see the structure
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

async function testWorkingInsert() {
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
    console.log('Testing working insert with full_name...');
    
    const { data, error } = await supabase
      .from('card_configs')
      .insert([{
        full_name: 'John Doe',
        title: 'Software Engineer',
        company: 'Tech Corp',
        phone: '9876543210',
        email: 'john.doe@example.com',
      }])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
    } else {
      console.log('✅ Success! Record structure:', Object.keys(data));
      console.log('Record data:', data);
      
      // Clean up the test record
      await supabase.from('card_configs').delete().eq('id', data.id);
      console.log('Test record cleaned up');
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testWorkingInsert().catch(console.error);