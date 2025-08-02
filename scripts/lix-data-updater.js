#!/usr/bin/env node

/**
 * LIX Data Updater for PCC Design System
 * 
 * Updates existing price groups with LIX experiment data
 * 
 * USAGE:
 * 1. Run: node scripts/lix-data-updater.js
 * 2. Paste your LIX data when prompted
 * 3. It will update the existing price groups JSON file
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseLixDataRow(row) {
  return {
    priceId: row.PRICE_ID,
    productId: row.PRODUCT_ID,
    lixKey: row.LIX_KEY || null,
    lixTreatment: row.LIX_TREATMENT || null,
    channel: row.CHANNEL,
    pricingPlan: row.PRICING_PLAN
  };
}

function parseCSVLine(line) {
  // Tab-separated values
  const fields = line.split('\t');
  return {
    PRICE_ID: fields[0],
    PRODUCT_ID: fields[1],
    NAME: fields[2],
    PRICING_PLAN: fields[3],
    CREATED_AT: fields[4],
    UPDATED_AT: fields[5],
    DELETED_TS: fields[6],
    GG_MODI_TS: fields[7],
    GG_STATUS: fields[8],
    ETL_TS: fields[9],
    CHANNEL: fields[10],
    LIX_KEY: fields[11],
    LIX_TREATMENT: fields[12],
    APP_NAME: fields[13]
  };
}

async function main() {
  console.log('=== LIX Data Updater ===');
  console.log('');
  console.log('Paste your LIX data here (including header row):');
  console.log('Press Enter twice when done');
  console.log('');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let inputData = '';
  let emptyLineCount = 0;

  for await (const line of rl) {
    if (line.trim() === '') {
      emptyLineCount++;
      if (emptyLineCount >= 2) {
        break;
      }
    } else {
      emptyLineCount = 0;
      inputData += line + '\n';
    }
  }

  rl.close();

  if (!inputData.trim()) {
    console.log('No data provided. Exiting.');
    return;
  }

  // Parse the data
  const lines = inputData.trim().split('\n');
  const headerRow = lines[0];
  const dataRows = lines.slice(1);

  console.log(`Processing ${dataRows.length} LIX entries...`);

  // Parse LIX data
  const lixDataMap = new Map();
  dataRows.forEach(line => {
    const row = parseCSVLine(line);
    const lixData = parseLixDataRow(row);
    
    lixDataMap.set(lixData.priceId, lixData);
  });

  // Get the product ID from first row
  const firstRow = parseCSVLine(dataRows[0]);
  const productId = firstRow.PRODUCT_ID;

  // Load existing price groups file
  const priceGroupsFile = path.join(__dirname, '..', 'public', 'data', 'price-groups', `${productId}.json`);
  
  if (!fs.existsSync(priceGroupsFile)) {
    console.log(`❌ Error: Price groups file not found: ${priceGroupsFile}`);
    console.log('Please make sure you have uploaded price groups for this product first.');
    return;
  }

  let priceGroupsData;
  try {
    const existingContent = fs.readFileSync(priceGroupsFile, 'utf8');
    priceGroupsData = JSON.parse(existingContent);
  } catch (error) {
    console.log(`❌ Error reading price groups file: ${error.message}`);
    return;
  }

  // Update price groups with LIX data
  let updatedCount = 0;
  priceGroupsData.priceGroups.forEach(priceGroup => {
    const lixData = lixDataMap.get(priceGroup.id);
    if (lixData && (lixData.lixKey || lixData.lixTreatment)) {
      // Add LIX data to price group
      priceGroup.lixKey = lixData.lixKey;
      priceGroup.lixTreatment = lixData.lixTreatment;
      updatedCount++;
    }
  });

  // Write updated data back to file
  fs.writeFileSync(priceGroupsFile, JSON.stringify(priceGroupsData, null, 2));

  console.log('');
  console.log(`✅ Success! Updated ${priceGroupsFile}`);
  console.log(`📊 Updated ${updatedCount} price groups with LIX data`);
  console.log('');

  // Show breakdown of LIX experiments
  const lixExperiments = new Map();
  lixDataMap.forEach(lixData => {
    if (lixData.lixKey) {
      const key = lixData.lixKey;
      if (!lixExperiments.has(key)) {
        lixExperiments.set(key, new Set());
      }
      lixExperiments.get(key).add(lixData.lixTreatment);
    }
  });

  console.log('🧪 LIX Experiments found:');
  lixExperiments.forEach((treatments, experimentKey) => {
    console.log(`   - ${experimentKey}: ${Array.from(treatments).join(', ')}`);
  });

  console.log('');
  console.log('🎯 Your price groups now have LIX experiment data! Check your Price Group table.');
}

// Run the script
main().catch(console.error);