#!/usr/bin/env node

/**
 * Bulk Product Uploader for PCC Demo
 * 
 * Handles uploading hundreds of products efficiently for demo purposes
 * Optimized for UX demonstration, not production use
 * 
 * USAGE:
 * 1. Prepare your Excel with columns: PRODUCT_ID, PRODUCT_NAME, LOB, FOLDER, etc.
 * 2. Run: node scripts/bulk-product-uploader.js
 * 3. Paste your product data when prompted
 * 4. Creates optimized JSON structure for fast demo loading
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Demo-optimized product structure (minimal data for fast loading)
function convertProductRow(row) {
  return {
    id: row.PRODUCT_ID,
    name: row.PRODUCT_NAME || `Product ${row.PRODUCT_ID}`,
    description: row.DESCRIPTION || `Demo product for ${row.PRODUCT_NAME}`,
    lob: row.LOB || 'Premium',
    folder: row.FOLDER || 'Premium Core Products',
    status: row.STATUS || 'Active',
    billingModel: row.BILLING_MODEL || 'Subscription',
    
    // Demo-specific fields (minimal for performance)
    postPurchaseLandingUrl: `https://www.linkedin.com/product/${row.PRODUCT_ID}`,
    seatType: row.SEAT_TYPE || 'Single seat',
    isBundle: (row.IS_BUNDLE || 'N').toUpperCase() === 'Y',
    taxClass: 'Taxable',
    paymentFailureFreeToPaidGracePeriod: 0,
    paymentFailurePaidToPaidGracePeriod: 7,
    seatMin: parseInt(row.SEAT_MIN) || 1,
    seatMax: parseInt(row.SEAT_MAX) || 1,
    features: row.FEATURES ? row.FEATURES.split(',').map(f => f.trim()) : ['Demo feature'],
    
    // Essential flags
    isVisibleOnBillingEmails: true,
    isVisibleOnRenewalEmails: true,
    isCancellable: true,
    isEligibleForRoboRefund: true,
    isPrimaryProductForPricing: true,
    
    // URLs (demo placeholders)
    termsOfServiceUrl: 'https://www.linkedin.com/legal/l/lsa',
    productUrl: `https://www.linkedin.com/product/${row.PRODUCT_ID}`,
    helpCenterUrl: 'https://www.linkedin.com/help/linkedin',
    
    // Empty SKUs array (will be populated by price group uploads)
    skus: []
  };
}

function parseCSVLine(line) {
  const fields = line.split('\t'); // Tab-separated
  return {
    PRODUCT_ID: fields[0],
    PRODUCT_NAME: fields[1],
    DESCRIPTION: fields[2],
    LOB: fields[3],
    FOLDER: fields[4],
    STATUS: fields[5],
    BILLING_MODEL: fields[6],
    SEAT_TYPE: fields[7],
    IS_BUNDLE: fields[8],
    SEAT_MIN: fields[9],
    SEAT_MAX: fields[10],
    FEATURES: fields[11]
  };
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== Bulk Product Uploader for PCC Demo ===');
  console.log('');
  console.log('This will create the optimized product catalog for your 500+ product demo');
  console.log('');
  console.log('Expected format:');
  console.log('PRODUCT_ID  PRODUCT_NAME  DESCRIPTION  LOB  FOLDER  STATUS  BILLING_MODEL  SEAT_TYPE  IS_BUNDLE  SEAT_MIN  SEAT_MAX  FEATURES');
  console.log('');
  console.log('Paste your product data here (including header row):');
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

  // Convert to optimized product format
  const products = dataRows.map(convertProductRow);
  
  // Organize by folder structure for better demo navigation
  const folderStructure = {};
  products.forEach(product => {
    if (!folderStructure[product.lob]) {
      folderStructure[product.lob] = {};
    }
    if (!folderStructure[product.lob][product.folder]) {
      folderStructure[product.lob][product.folder] = [];
    }
    folderStructure[product.lob][product.folder].push(product.id);
  });

  // Create output directory structure
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  const priceGroupsDir = path.join(outputDir, 'price-groups');
  const pricePointsDir = path.join(outputDir, 'price-points');
  
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(priceGroupsDir, { recursive: true });
  fs.mkdirSync(pricePointsDir, { recursive: true });

  // Write main product catalog (optimized for fast loading)
  const catalogFile = path.join(outputDir, 'products.json');
  fs.writeFileSync(catalogFile, JSON.stringify(products, null, 2));

  // Write folder structure for navigation
  const folderFile = path.join(outputDir, 'folder-structure.json');
  fs.writeFileSync(folderFile, JSON.stringify(folderStructure, null, 2));

  // Create placeholder files for price groups (will be populated later)
  let placeholderCount = 0;
  products.forEach(product => {
    const priceGroupFile = path.join(priceGroupsDir, `${product.id}.json`);
    if (!fs.existsSync(priceGroupFile)) {
      fs.writeFileSync(priceGroupFile, JSON.stringify({
        productId: product.id,
        priceGroups: []
      }, null, 2));
      placeholderCount++;
    }
  });

  console.log('');
  console.log('✅ Success! Demo catalog created');
  console.log(`📊 Products processed: ${products.length}`);
  console.log(`📁 LOBs: ${Object.keys(folderStructure).length}`);
  console.log(`📂 Folders: ${Object.values(folderStructure).reduce((acc, lob) => acc + Object.keys(lob).length, 0)}`);
  console.log(`🔗 Price group placeholders: ${placeholderCount}`);
  console.log('');
  console.log('📁 Files created:');
  console.log(`   - ${catalogFile}`);
  console.log(`   - ${folderFile}`);
  console.log(`   - ${placeholderCount} price group placeholder files`);
  console.log('');
  console.log('🎯 Next steps:');
  console.log('   1. Upload price groups using the price group bulk uploader');
  console.log('   2. Upload price points using the price point bulk uploader');
  console.log('   3. Your demo will be ready for 500+ products!');
  console.log('');
  console.log('💡 Demo tip: The system is optimized for fast browsing and realistic UX');
}

// Run if this is the main module
main().catch(console.error);