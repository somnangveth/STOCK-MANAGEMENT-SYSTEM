"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

// Define disposeBatch function
async function disposeBatch(batchId: string) {
  const supabase = await createSupabaseAdmin();
  const { error } = await supabase
    .from('product_batches')
    .update({ status: 'disposed' })
    .eq('id', batchId);
  
  if (error) {
    console.error(`Error disposing batch ${batchId}:`, error);
    throw error;
  }
}

// Define sendExpiryNotifications function
async function sendExpiryNotifications() {
  // Implement your notification logic here
  // For example, fetch alerts and send emails/notifications
  const supabase = await createSupabaseAdmin();
  
  const { data: alerts, error } = await supabase
    .from('expiry_alerts')
    .select('*')
    .eq('status', 'pending');
  
  if (error) {
    console.error('Error fetching alerts:', error);
    return;
  }
  
  // Send notifications (implement your logic)
  // Example: send emails, push notifications, etc.
  console.log('Sending notifications for:', alerts);
}

async function dailyExpiryCheck() {
  try {
    // 1. Run check_expiry_alert() function
    const supabase = await createSupabaseAdmin();
    await supabase.rpc('check_expiry_alerts');
    
    // 2. Auto-dispose expired products
    const { data: expiredBatches, error: fetchError } = await supabase
      .from('product_batches')
      .select('*, products(*)')
      .lt('expiry_date', new Date().toISOString())
      .eq('status', 'active');
    
    if (fetchError) {
      console.error('Error fetching expired batches:', fetchError);
      return;
    }
    
    // Check if expiredBatches exists and is an array
    if (expiredBatches && expiredBatches.length > 0) {
      for (const batch of expiredBatches) {
        // Check if auto-dispose is enabled
        const { data: setting, error: settingError } = await supabase
          .from('expiry_alert_settings')
          .select('*')
          .eq('product_id', batch.product_id)
          .single();
        
        if (settingError) {
          console.error(`Error fetching settings for product ${batch.product_id}:`, settingError);
          continue;
        }
        
        if (setting?.auto_dispose) {
          // Mark as disposed
          await disposeBatch(batch.id);
        }
      }
    }
    
    await sendExpiryNotifications();
  } catch (error) {
    console.error('Error in dailyExpiryCheck:', error);
    throw error;
  }
}

export { dailyExpiryCheck };