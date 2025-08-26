#!/usr/bin/env node

/**
 * Script to fix overlapping quantity ranges in price group data
 * 
 * This script:
 * 1. Reads price group JSON files
 * 2. Identifies overlapping quantity ranges (e.g., 1-3, 3-11)
 * 3. Fixes them to be non-overlapping (e.g., 1-2, 3-10)
 * 4. Preserves all other data intact
 * 5. Works per currency + pricingRule + pricingTier group
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fixes overlapping quantity ranges within a group of price points
 * @param {Array} pricePoints - Array of price points with same currency/rule/tier
 * @returns {Array} - Fixed price points with non-overlapping ranges
 */
function fixQuantityRanges(pricePoints) {
  if (!pricePoints || pricePoints.length === 0) {
    return pricePoints;
  }

  // Filter only price points that have quantity ranges
  const rangePoints = pricePoints.filter(point => 
    point.minQuantity !== undefined || point.maxQuantity !== undefined
  );
  
  if (rangePoints.length <= 1) {
    return pricePoints; // No overlaps possible with 0 or 1 range
  }

  // Sort by minQuantity ascending
  const sortedRangePoints = rangePoints.sort((a, b) => {
    const aMin = a.minQuantity || 1;
    const bMin = b.minQuantity || 1;
    return aMin - bMin;
  });

  console.log(`    Fixing ${sortedRangePoints.length} range points:`);
  
  // Fix overlapping ranges
  const fixedRangePoints = sortedRangePoints.map((point, index) => {
    const fixedPoint = { ...point };
    const currentMin = fixedPoint.minQuantity || 1;
    
    if (index < sortedRangePoints.length - 1) {
      // Not the last range - set maxQuantity to (next minQuantity - 1)
      const nextMin = sortedRangePoints[index + 1].minQuantity || 1;
      const newMax = nextMin - 1;
      
      console.log(`      Range ${index + 1}: ${currentMin}-${fixedPoint.maxQuantity} → ${currentMin}-${newMax}`);
      fixedPoint.maxQuantity = newMax;
    } else {
      // Last range - remove maxQuantity to make it open-ended, or keep as-is if it's meaningful
      const oldMax = fixedPoint.maxQuantity;
      if (oldMax) {
        console.log(`      Range ${index + 1}: ${currentMin}-${oldMax} → ${currentMin}+ (open-ended)`);
        delete fixedPoint.maxQuantity;
      } else {
        console.log(`      Range ${index + 1}: ${currentMin}+ (already open-ended)`);
      }
    }
    
    return fixedPoint;
  });

  // Return all original points with the fixed range points
  const nonRangePoints = pricePoints.filter(point => 
    point.minQuantity === undefined && point.maxQuantity === undefined
  );
  
  return [...nonRangePoints, ...fixedRangePoints];
}

/**
 * Groups price points by currency, pricingRule, pricingTier, and validFrom date
 * This ensures we only fix overlapping ranges within the same temporal period
 * @param {Array} pricePoints - All price points from a price group
 * @returns {Map} - Map of group key to array of price points
 */
function groupPricePoints(pricePoints) {
  const groups = new Map();
  
  pricePoints.forEach(point => {
    const currency = point.currencyCode || 'unknown';
    const rule = point.pricingRule || 'NONE';
    const tier = point.pricingTier || 'default';
    const validFrom = point.validFrom || 'no-date';
    // Group by temporal period to avoid mixing different time periods
    const groupKey = `${currency}-${rule}-${tier}-${validFrom}`;
    
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(point);
  });
  
  return groups;
}

/**
 * Processes a single price group file
 * @param {string} filePath - Path to the JSON file
 */
function fixPriceGroupFile(filePath) {
  console.log(`\n🔧 Processing: ${path.basename(filePath)}`);
  
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (!data.priceGroups || !Array.isArray(data.priceGroups)) {
      console.log('  ❌ Invalid file format - no priceGroups array found');
      return;
    }
    
    let totalFixedGroups = 0;
    let totalFixedPoints = 0;
    
    // Process each price group
    data.priceGroups = data.priceGroups.map((priceGroup, groupIndex) => {
      if (!priceGroup.pricePoints || !Array.isArray(priceGroup.pricePoints)) {
        return priceGroup;
      }
      
      console.log(`\n  📊 Price Group ${groupIndex + 1} (ID: ${priceGroup.id}):`);
      
      // Group price points by currency + rule + tier
      const pointGroups = groupPricePoints(priceGroup.pricePoints);
      
      let fixedPoints = [];
      let groupHadChanges = false;
      
      pointGroups.forEach((points, groupKey) => {
        console.log(`\n    Group: ${groupKey} (${points.length} price points)`);
        
        const originalPointsJson = JSON.stringify(points.map(p => ({ min: p.minQuantity, max: p.maxQuantity })));
        const fixedGroupPoints = fixQuantityRanges(points);
        const fixedPointsJson = JSON.stringify(fixedGroupPoints.map(p => ({ min: p.minQuantity, max: p.maxQuantity })));
        
        if (originalPointsJson !== fixedPointsJson) {
          groupHadChanges = true;
          totalFixedPoints += fixedGroupPoints.length;
        } else {
          console.log(`      ✅ No overlaps found - ranges already correct`);
        }
        
        fixedPoints.push(...fixedGroupPoints);
      });
      
      if (groupHadChanges) {
        totalFixedGroups++;
      }
      
      return {
        ...priceGroup,
        pricePoints: fixedPoints
      };
    });
    
    // Write the fixed data back
    const outputJson = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, outputJson, 'utf8');
    
    console.log(`\n✅ Completed: ${path.basename(filePath)}`);
    console.log(`   Fixed ${totalFixedGroups} price groups with ${totalFixedPoints} price points`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node fix-quantity-ranges.js <file1.json> [file2.json] ...');
    console.log('');
    console.log('Examples:');
    console.log('  node fix-quantity-ranges.js public/data/price-groups/130200.json');
    console.log('  node fix-quantity-ranges.js public/data/price-groups/*.json');
    return;
  }
  
  console.log('🚀 Starting Quantity Range Fix Script');
  console.log('=====================================');
  
  args.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      fixPriceGroupFile(filePath);
    } else {
      console.error(`❌ File not found: ${filePath}`);
    }
  });
  
  console.log('\n🎉 All files processed!');
  console.log('\nNext steps:');
  console.log('1. Review the changes in your files');
  console.log('2. Test the updated price point table');
  console.log('3. Run the app to verify everything works correctly');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixQuantityRanges, groupPricePoints };
