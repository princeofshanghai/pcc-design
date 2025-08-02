#!/usr/bin/env node

/**
 * Price Group Creator for PCC Design System
 * 
 * This script creates price groups with proper channel and billing cycle mappings
 * 
 * USAGE:
 * 1. Run: node scripts/price-group-converter.js
 * 2. Paste your price group data when prompted
 * 3. It will create/update the JSON file in public/data/products/
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Channel mappings
const CHANNEL_MAPPING = {
  '100': 'Desktop',
  '400': 'iOS', 
  '600': 'GPB'
};

// Billing cycle mappings
const BILLING_CYCLE_MAPPING = {
  'P1M': 'Monthly',
  'P3M': 'Quarterly', 
  'P1Y': 'Annual'
};

function convertPriceGroupRow(row) {
  const channel = CHANNEL_MAPPING[row.CHANNEL] || row.CHANNEL;
  const billingCycle = BILLING_CYCLE_MAPPING[row.PRICING_PLAN] || row.PRICING_PLAN;
  
  return {
    id: row.PRICE_ID,
    status: 'Active',
    validFrom: new Date().toISOString(),
    channel: channel,
    billingCycle: billingCycle,
    pricePoints: [] // Empty for now, will be populated later
  };
}

function parseCSVLine(line) {
  const fields = line.split('\t'); // Tab-separated
  return {
    PRICE_ID: fields[0],
    PRODUCT_ID: fields[1], 
    PRICING_PLAN: fields[2],
    CHANNEL: fields[3]
  };
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== Price Group Creator ===');
  console.log('');
  console.log('Paste your price group data here (including header row):');
  console.log('Format: PRICE_ID, PRODUCT_ID, PRICING_PLAN, CHANNEL');
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

  // Skip header row, parse data rows
  const dataRows = lines.slice(1).map(parseCSVLine);
  
  if (dataRows.length === 0) {
    console.log('No data rows found');
    return;
  }

  // Get product ID from first row
  const productId = dataRows[0].PRODUCT_ID;
  
  // Convert to price groups
  const priceGroups = dataRows.map(convertPriceGroupRow);
  
  // Check if existing JSON file exists
  const outputDir = path.join(__dirname, '..', 'public', 'data', 'products');
  const outputFile = path.join(outputDir, `${productId}.json`);
  
  let existingData = { productId, priceGroups: [] };
  
  if (fs.existsSync(outputFile)) {
    try {
      const existingContent = fs.readFileSync(outputFile, 'utf8');
      existingData = JSON.parse(existingContent);
      console.log(`📄 Found existing data with ${existingData.priceGroups.length} price groups`);
    } catch (error) {
      console.log('⚠️  Warning: Could not parse existing file, creating new one');
    }
  }
  
  // Merge price groups - new ones replace existing ones with same ID
  const existingIds = new Set(existingData.priceGroups.map(pg => pg.id));
  const newIds = new Set(priceGroups.map(pg => pg.id));
  
  // Keep existing price groups that aren't being replaced
  const keptPriceGroups = existingData.priceGroups.filter(pg => !newIds.has(pg.id));
  
  // Combine kept + new price groups
  const finalPriceGroups = [...keptPriceGroups, ...priceGroups];
  
  const output = {
    productId: productId,
    priceGroups: finalPriceGroups
  };

  // Ensure directory exists
  fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  
  console.log('');
  console.log(`✅ Success! Updated ${outputFile}`);
  console.log(`📊 Price Groups Summary:`);
  console.log(`   - Added: ${priceGroups.length} new price groups`);
  console.log(`   - Kept: ${keptPriceGroups.length} existing price groups`);
  console.log(`   - Total: ${finalPriceGroups.length} price groups`);
  console.log('');
  
  // Show summary by channel and billing cycle
  const summary = {};
  finalPriceGroups.forEach(pg => {
    const key = `${pg.channel || 'Unknown'} - ${pg.billingCycle || 'Unknown'}`;
    summary[key] = (summary[key] || 0) + 1;
  });
  
  console.log('📋 Breakdown:');
  Object.entries(summary).forEach(([key, count]) => {
    console.log(`   - ${key}: ${count} price groups`);
  });
  
  console.log('');
  console.log('🎯 Next steps: Add price points to these price groups using the price point converter!');
}

// Run if this is the main module
main().catch(console.error);