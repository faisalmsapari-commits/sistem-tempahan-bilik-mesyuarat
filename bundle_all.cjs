const fs = require('fs');

const reactCode = fs.readFileSync('vendor/react.production.min.js', 'utf8');
const reactDomCode = fs.readFileSync('vendor/react-dom.production.min.js', 'utf8');
let appCode = fs.readFileSync('app.bundle.js', 'utf8');

// Strip old vendor headers if any
if (appCode.includes('/** REACT_VENDOR_START **/')) {
  const start = appCode.indexOf('/** REACT_VENDOR_START **/');
  const end = appCode.indexOf('/** REACT_VENDOR_END **/') + '/** REACT_VENDOR_END **/'.length;
  appCode = (appCode.substring(0, start) + appCode.substring(end)).trim();
}

// Replace localStorage usages
appCode = appCode.replace(/localStorage\.getItem\(/g, 'safeGetRaw(');
appCode = appCode.replace(/localStorage\.setItem\(/g, 'safeSetRaw(');
appCode = appCode.replace(/localStorage\.removeItem\(/g, 'safeRemoveRaw(');

const safeStorageDef = `
// Safe Storage Utility for file:/// and restricted web environments
const _memStorage = {};
function safeGetStored(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      var v = window.localStorage.getItem('mplbp_ebilik_' + key);
      if (v) return JSON.parse(v);
    }
  } catch(e) {}
  return _memStorage['mplbp_ebilik_' + key] !== undefined ? _memStorage['mplbp_ebilik_' + key] : fallback;
}

function safeSetStored(key, val) {
  _memStorage['mplbp_ebilik_' + key] = val;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('mplbp_ebilik_' + key, JSON.stringify(val));
    }
  } catch(e) {}
}

function safeGetRaw(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      var v = window.localStorage.getItem(key);
      if (v !== null) return v;
    }
  } catch(e) {}
  return _memStorage[key] !== undefined ? _memStorage[key] : (fallback !== undefined ? fallback : null);
}

function safeSetRaw(key, val) {
  _memStorage[key] = val;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  } catch(e) {}
}

function safeRemoveRaw(key) {
  delete _memStorage[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch(e) {}
}
`;

// Replace getStored and setStored inside appCode
appCode = appCode.replace(
  /function getStored\(key, fallback\) \{[\s\S]*?function setStored\(key, val\) \{[\s\S]*?\}/,
  'function getStored(key, fallback) { return safeGetStored(key, fallback); }\n  function setStored(key, val) { return safeSetStored(key, val); }'
);

const finalBundle = `/** REACT_VENDOR_START **/
${reactCode}
${reactDomCode}
/** REACT_VENDOR_END **/

${safeStorageDef}

${appCode}
`;

fs.writeFileSync('app.bundle.js', finalBundle, 'utf8');
console.log('Successfully built standalone bundle. Length:', finalBundle.length);
