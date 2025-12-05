"use server";

import { createSupabaseAdmin } from "@/lib/supbase/action";

async function deductStockFEFO(product_id: string, quantity: number) {
  const supabase = await createSupabaseAdmin();
  
  const { data: batches, error: fetchError } = await supabase
    .from('product_batches')
    .select('*')
    .eq('product_id', product_id)
    .eq('status', 'active')
    .gte('expiry_date', new Date().toISOString())
    .gt('quantity_remaining', 0)
    .order('expiry_date', { ascending: true });
  
  if (fetchError) {
    console.error('Error fetching batches:', fetchError);
    throw fetchError;
  }
  
  // Check if batches exists and is not empty
  if (!batches || batches.length === 0) {
    throw new Error('No available batches found for this product');
  }
  
  let remainingQty = quantity;
  const movements = [];
  
  for (const batch of batches) {
    if (remainingQty <= 0) break;
    
    const deductQty = Math.min(remainingQty, batch.quantity_remaining);
    
    // Update batch quantity
    const { error: updateError } = await supabase
      .from('product_batches')
      .update({
        quantity_remaining: batch.quantity_remaining - deductQty
      })
      .eq('id', batch.id);
    
    if (updateError) {
      console.error('Error updating batch:', updateError);
      throw updateError;
    }
    
    // Add to movements array
    movements.push({
      product_id: product_id,
      batch_id: batch.id,
      movement_type: 'out',
      quantity: deductQty,
      previous_quantity: batch.quantity_remaining,
      new_quantity: batch.quantity_remaining - deductQty
    });
    
    remainingQty -= deductQty;
  }
  
  // Insert all movements at once (outside the loop)
  if (movements.length > 0) {
    const { error: insertError } = await supabase
      .from('stock_movements')
      .insert(movements);
    
    if (insertError) {
      console.error('Error inserting stock movements:', insertError);
      throw insertError;
    }
  }
  
  return movements;
}

export { deductStockFEFO };