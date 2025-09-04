// Test script to understand the actual orders table structure
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

async function testOrdersTable() {
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
    console.log('Testing orders table structure...');
    
    // First, check if there are existing records to understand the structure  
    const { data: existingData, error: selectError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('Error selecting from orders:', selectError);
    } else {
      console.log('Existing records count:', existingData?.length || 0);
      if (existingData && existingData.length > 0) {
        console.log('Sample record structure:', Object.keys(existingData[0]));
        console.log('Sample record data:', existingData[0]);
      }
    }

    // Try a minimal insert to understand required fields
    const testOrder = {
      order_number: 'TEST-123',
      customer_name: 'Test Customer',  
      email: 'test@example.com',
      unit_price: 29.99,
      quantity: 1,
      subtotal: 29.99,
      shipping: 5.00,
      total_amount: 36.49
    };

    const { data: insertData, error: insertError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting test order:', insertError);
    } else {
      console.log('✅ Success! Test order created:', insertData);
      // Clean up
      await supabase.from('orders').delete().eq('id', insertData.id);
      console.log('Test record cleaned up');
    }

  } catch (error) {
    console.error('Exception:', error);
  }
}

testOrdersTable().catch(console.error);