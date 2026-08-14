const fs = require('fs');
const content = fs.readFileSync('app.bundle.js', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, idx) => {
  if (l.includes('ROOMS_DATA_VERSION') || l.includes('// MPLBP e-BILIK')) {
    console.log(`Line ${idx + 1}: ${l.substring(0, 70)}`);
  }
});
