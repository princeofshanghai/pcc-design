#!/usr/bin/env node

/**
 * Excel to JSON Converter for PCC Design System
 * 
 * This script helps convert your Excel/CSV data to the JSON format
 * needed for the pricing system.
 * 
 * USAGE:
 * 1. Export your Excel sheet as CSV
 * 2. Run: node scripts/excel-to-json-converter.js your-file.csv
 * 3. It will create the JSON file in public/data/products/
 * 
 * OR copy your Excel data and paste it into the console when prompted
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertExcelRowToJson(row) {
  // Parse dates safely, handling quotes and empty values
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr.trim() === '') return undefined;
    // Remove quotes if present
    const cleanDate = dateStr.replace(/"/g, '').trim();
    const parsedDate = new Date(cleanDate);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate.toISOString();
  };

  return {
    id: row.PRICE_POINT_ID,
    currencyCode: row.CURRENCY || '', // Handle empty currency for BASE_PRICER
    amount: row.AMOUNT ? parseFloat(row.AMOUNT) : 0, // Handle empty amount for BASE_PRICER
    validFrom: parseDate(row.VALID_FROM),
    validTo: parseDate(row.VALID_UNTIL),
    pricingRule: row.PRICING_RULE || 'NONE', // Handle empty pricing rule
    minQuantity: row.MIN_QUANTITY ? parseInt(row.MIN_QUANTITY) : undefined,
    maxQuantity: row.MAX_QUANTITY ? parseInt(row.MAX_QUANTITY) : undefined,
    priceType: row.PRICE_TYPE,
    isTaxInclusive: row.IS_TAX_INCLUSIVE === 'Y' || row.IS_TAX_INCLUSIVE === 'true',
    pricingTier: row.PRICING_TIER || null, // New pricing tier field
    status: row.STATE === 'A' ? 'Active' : row.STATE === 'E' ? 'Expired' : row.STATE
  };
}

function groupPricePointsByPriceGroup(rows) {
  const priceGroups = new Map();
  
  rows.forEach(row => {
    const priceGroupId = row['PRICE GROUP_ID'] || row.PRICE_ID;

    const pricePoint = convertExcelRowToJson(row);
    
    if (!priceGroups.has(priceGroupId)) {
      priceGroups.set(priceGroupId, {
        id: priceGroupId,
        status: 'Active',
        pricePoints: []
      });
    }
    
    priceGroups.get(priceGroupId).pricePoints.push(pricePoint);
  });
  
  return Array.from(priceGroups.values());
}

function parseCSVLine(line, headers) {
  // Enhanced CSV parser with proper quote handling
  const delimiter = line.includes('\t') ? '\t' : ',';
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim()); // Add the last field
  
  // Create object dynamically based on headers
  const row = {};
  headers.forEach((header, index) => {
    row[header.trim()] = fields[index] ? fields[index].trim() : '';
  });
  
  return row;
}

async function main() {
  console.log('=== Excel to JSON Converter ===');
  console.log('');

  let lines = [];
  
  // Check if CSV file is provided as argument
  const csvFilePath = process.argv[2];
  if (csvFilePath && fs.existsSync(csvFilePath)) {
    console.log(`📄 Reading CSV file: ${csvFilePath}`);
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    lines = fileContent.split('\n').filter(line => line.trim() !== '');
  } else {
    // Fall back to console input
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('Paste your Excel data here (including header row):');
    console.log('Press Enter twice when done');
    console.log('');
    
    for await (const line of rl) {
      if (line.trim() === '' && lines.length > 0) {
        break;
      }
      if (line.trim() !== '') {
        lines.push(line);
      }
    }

    rl.close();
  }

  if (lines.length < 2) {
    console.log('Need at least a header row and one data row');
    return;
  }

  // Parse header row to get column names
  const headers = lines[0].split(lines[0].includes('\t') ? '\t' : ',').map(h => h.trim());
  console.log(`📊 Found columns: ${headers.join(', ')}`);
  
  // Parse data rows using dynamic headers
  const dataRows = lines.slice(1).map(line => parseCSVLine(line, headers));
  
  if (dataRows.length === 0) {
    console.log('No data rows found');
    return;
  }

  // Get product ID from first row or use default for Recruiter Corporate
  const productId = dataRows[0].PRODUCT_ID || '130200';
  
  // Group by price groups
  const priceGroups = groupPricePointsByPriceGroup(dataRows);
  
  const output = {
    productId: productId,
    priceGroups: priceGroups
  };

  // Write to price groups file (update existing)
  const priceGroupsDir = path.join(__dirname, '..', 'public', 'data', 'price-groups');
  const priceGroupsFile = path.join(priceGroupsDir, `${productId}.json`);
  
  // Ensure directory exists
  fs.mkdirSync(priceGroupsDir, { recursive: true });
  
  // Read existing price groups to merge with price points
  let existingData = { productId, priceGroups: [] };
  if (fs.existsSync(priceGroupsFile)) {
    try {
      const existingContent = fs.readFileSync(priceGroupsFile, 'utf8');
      existingData = JSON.parse(existingContent);
    } catch (error) {
      console.log('⚠️  Warning: Could not parse existing price groups file, creating new one');
    }
  }
  
  // Merge price points into existing price groups
  existingData.priceGroups.forEach(existingPG => {
    const newPriceGroup = priceGroups.find(pg => pg.id === existingPG.id);
    if (newPriceGroup) {
      // Update existing price group with new price points
      existingPG.pricePoints = newPriceGroup.pricePoints;
    }
  });
  
  // Write updated price groups file
  fs.writeFileSync(priceGroupsFile, JSON.stringify(existingData, null, 2));
  
  console.log('');
  console.log(`✅ Success! Updated ${priceGroupsFile}`);
  console.log(`📊 Processed ${dataRows.length} price points across ${priceGroups.length} price groups`);
  console.log('');
  
  // Breakdown by price type
  const typeBreakdown = {};
  const tierBreakdown = {};
  dataRows.forEach(row => {
    const type = row.PRICE_TYPE || 'Unknown';
    typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
    
    const tier = row.PRICING_TIER || 'No Tier';
    tierBreakdown[tier] = (tierBreakdown[tier] || 0) + 1;
  });
  
  console.log('📋 Price type breakdown:');
  Object.entries(typeBreakdown).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count} price points`);
  });
  
  console.log('');
  console.log('🏷️ Pricing tier breakdown:');
  Object.entries(tierBreakdown).forEach(([tier, count]) => {
    console.log(`   - ${tier}: ${count} price points`);
  });
  
  console.log('');
  console.log('🎯 Your price groups now have price points! Check your Product Detail page.');;
}

// Run if this is the main module
main().catch(console.error);