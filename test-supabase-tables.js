// Test script to see what tables actually exist in Supabase
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

async function testTables() {
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
    console.log('Testing different tables...');
    
    // Test if orders table works (since we saw it in logs)
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('Orders table error:', ordersError);
    } else {
      console.log('✅ Orders table exists, sample:', ordersData?.[0] ? Object.keys(ordersData[0]) : 'empty');
    }

    // Test different possible names for card configs table
    const possibleTableNames = ['card_configs', 'cardconfigs', 'card-configs', 'configurations', 'cards'];
    
    for (const tableName of possibleTableNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error) {
        console.log(`✅ Table '${tableName}' exists, sample:`, data?.[0] ? Object.keys(data[0]) : 'empty');
      } else {
        console.log(`❌ Table '${tableName}' error:`, error.message);
      }
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testTables().catch(console.error);