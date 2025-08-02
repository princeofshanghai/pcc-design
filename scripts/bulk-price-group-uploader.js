#!/usr/bin/env node

/**
 * Bulk Price Group Uploader for PCC Demo
 * 
 * Handles uploading thousands of price groups efficiently
 * Designed for demo performance with smart data organization
 * 
 * USAGE:
 * 1. Prepare Excel with: PRICE_GROUP_ID, PRODUCT_ID, PRICING_PLAN, CHANNEL, etc.
 * 2. Run: node scripts/bulk-price-group-uploader.js  
 * 3. Paste your price group data
 * 4. Creates organized JSON files for fast demo loading
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Channel and billing cycle mappings (same as before)
const CHANNEL_MAPPING = {
  '100': 'Desktop',
  '400': 'iOS', 
  '600': 'GPB'
};

const BILLING_CYCLE_MAPPING = {
  'P1M': 'Monthly',
  'P3M': 'Quarterly', 
  'P1Y': 'Annual'
};

function convertPriceGroupRow(row) {
  const channel = CHANNEL_MAPPING[row.CHANNEL] || row.CHANNEL || 'Desktop';
  const billingCycle = BILLING_CYCLE_MAPPING[row.PRICING_PLAN] || row.PRICING_PLAN || 'Monthly';
  
  return {
    id: row.PRICE_GROUP_ID,
    name: row.PRICE_GROUP_NAME || `${channel} ${billingCycle}`,
    status: row.STATUS || 'Active',
    validFrom: row.VALID_FROM || new Date().toISOString(),
    validTo: row.VALID_TO || undefined,
    channel: channel,
    billingCycle: billingCycle,
    // Placeholder for price points (populated by price point uploader)
    pricePoints: []
  };
}

function parseCSVLine(line) {
  const fields = line.split('\t');
  return {
    PRICE_GROUP_ID: fields[0],
    PRODUCT_ID: fields[1], 
    PRICING_PLAN: fields[2],
    CHANNEL: fields[3],
    PRICE_GROUP_NAME: fields[4],
    STATUS: fields[5],
    VALID_FROM: fields[6],
    VALID_TO: fields[7]
  };
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== Bulk Price Group Uploader ===');
  console.log('');
  console.log('This will organize price groups by product for efficient demo loading');
  console.log('');
  console.log('Expected format:');
  console.log('PRICE_GROUP_ID  PRODUCT_ID  PRICING_PLAN  CHANNEL  PRICE_GROUP_NAME  STATUS  VALID_FROM  VALID_TO');
  console.log('');
  console.log('Paste your price group data here (including header row):');
  console.log('Press Enter twice when done');
  console.log('');

  const lines = [];
  
  for await (const line of rl) {
    if (line.trim() === '' && lines.length > 0) {
      break;
    }
    if (line.trim() !== '') {
      lines.push(line);
    }
  }

  rl.close();

  if (lines.length < 2) {
    console.log('Need at least a header row and one data row');
    return;
  }

  // Parse data
  const dataRows = lines.slice(1).map(parseCSVLine);
  
  if (dataRows.length === 0) {
    console.log('No data rows found');
    return;
  }

  // Group by product ID for efficient file organization
  const priceGroupsByProduct = {};
  dataRows.forEach(row => {
    const productId = row.PRODUCT_ID;
    if (!priceGroupsByProduct[productId]) {
      priceGroupsByProduct[productId] = [];
    }
    priceGroupsByProduct[productId].push(convertPriceGroupRow(row));
  });

  // Create output directory
  const outputDir = path.join(__dirname, '..', 'public', 'data', 'price-groups');
  fs.mkdirSync(outputDir, { recursive: true });

  // Write price group files (one per product)
  let filesCreated = 0;
  let totalPriceGroups = 0;
  
  Object.entries(priceGroupsByProduct).forEach(([productId, priceGroups]) => {
    const outputFile = path.join(outputDir, `${productId}.json`);
    
    const output = {
      productId: productId,
      priceGroups: priceGroups
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    filesCreated++;
    totalPriceGroups += priceGroups.length;
  });

  // Create summary stats for demo purposes
  const statsData = {
    totalProducts: Object.keys(priceGroupsByProduct).length,
    totalPriceGroups: totalPriceGroups,
    averagePriceGroupsPerProduct: Math.round(totalPriceGroups / Object.keys(priceGroupsByProduct).length),
    channelBreakdown: {},
    billingCycleBreakdown: {},
    uploadDate: new Date().toISOString()
  };

  // Calculate breakdowns for demo insights
  dataRows.forEach(row => {
    const channel = CHANNEL_MAPPING[row.CHANNEL] || row.CHANNEL || 'Desktop';
    const billingCycle = BILLING_CYCLE_MAPPING[row.PRICING_PLAN] || row.PRICING_PLAN || 'Monthly';
    
    statsData.channelBreakdown[channel] = (statsData.channelBreakdown[channel] || 0) + 1;
    statsData.billingCycleBreakdown[billingCycle] = (statsData.billingCycleBreakdown[billingCycle] || 0) + 1;
  });

  const statsFile = path.join(outputDir, '_stats.json');
  fs.writeFileSync(statsFile, JSON.stringify(statsData, null, 2));

  console.log('');
  console.log('✅ Success! Price groups uploaded and organized');
  console.log(`📊 Summary:`);
  console.log(`   - Products with price groups: ${Object.keys(priceGroupsByProduct).length}`);
  console.log(`   - Total price groups: ${totalPriceGroups}`);
  console.log(`   - Files created: ${filesCreated}`);
  console.log(`   - Average price groups per product: ${statsData.averagePriceGroupsPerProduct}`);
  console.log('');
  console.log('📋 Channel breakdown:');
  Object.entries(statsData.channelBreakdown).forEach(([channel, count]) => {
    console.log(`   - ${channel}: ${count} price groups`);
  });
  console.log('');
  console.log('📋 Billing cycle breakdown:');
  Object.entries(statsData.billingCycleBreakdown).forEach(([cycle, count]) => {
    console.log(`   - ${cycle}: ${count} price groups`);
  });
  console.log('');
  console.log('🎯 Next step: Upload price points for these price groups');
}

main().catch(console.error);