const fs = require('fs');

// Read the CSV file to get correct values
const csvContent = fs.readFileSync('docs/context/pricepoints_recruitercorp.csv', 'utf8');
const csvLines = csvContent.split('\n');

// Parse CSV into a lookup map: ID -> correct maxQuantity
const csvData = {};
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i].trim();
  if (!line) continue;
  
  const columns = line.split(',');
  const pricePointId = columns[1];
  const maxQuantity = columns[7] === '' ? null : parseInt(columns[7]);
  
  csvData[pricePointId] = maxQuantity;
}

console.log(`📊 Parsed ${Object.keys(csvData).length} price points from CSV`);

// Read JSON data
const jsonData = JSON.parse(fs.readFileSync('public/data/price-groups/130200.json', 'utf8'));

// Find and fix price points with equal min/max
let fixedCount = 0;
const fixes = [];

jsonData.priceGroups[0].pricePoints.forEach(pp => {
  if (pp.minQuantity === pp.maxQuantity && csvData[pp.id] !== undefined) {
    const correctMax = csvData[pp.id];
    fixes.push(`ID ${pp.id}: ${pp.maxQuantity} → ${correctMax}`);
    pp.maxQuantity = correctMax;
    fixedCount++;
  }
});

// Show first 10 fixes as examples
console.log('\n🔧 Sample fixes:');
fixes.slice(0, 10).forEach(fix => console.log(`  - ${fix}`));
if (fixes.length > 10) {
  console.log(`  ... and ${fixes.length - 10} more`);
}

// Write corrected data back
fs.writeFileSync('public/data/price-groups/130200.json', JSON.stringify(jsonData, null, 2));

console.log(`\n✅ Fixed ${fixedCount} price points with incorrect maxQuantity values`);
console.log('🎉 All seat ranges should now display as proper ranges!');
