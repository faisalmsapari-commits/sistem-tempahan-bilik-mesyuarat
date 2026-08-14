const fs = require('fs');

const reactCode = fs.readFileSync('vendor/react.production.min.js', 'utf8');
const reactDomCode = fs.readFileSync('vendor/react-dom.production.min.js', 'utf8');
let appCode = fs.readFileSync('app.bundle.js', 'utf8');

// Strip any existing React/ReactDOM if already at the top
if (appCode.startsWith('/** REACT_VENDOR_START **/')) {
  const idx = appCode.indexOf('/** REACT_VENDOR_END **/');
  if (idx !== -1) {
    appCode = appCode.substring(idx + '/** REACT_VENDOR_END **/'.length).trim();
  }
}

// Add safe localStorage wrapper inside appCode
const safeStorageHeader = `
// Safe Storage Wrapper (works in file:///, iframe, incognito, and server environments)
const _memoryStorage = {};
function safeGetStored(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const v = window.localStorage.getItem('mplbp_ebilik_' + key);
      if (v) return JSON.parse(v);
    }
  } catch (e) {
    console.warn('Storage read warning:', e);
  }
  return _memoryStorage[key] !== undefined ? _memoryStorage[key] : fallback;
}

function safeSetStored(key, val) {
  _memoryStorage[key] = val;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('mplbp_ebilik_' + key, JSON.stringify(val));
    }
  } catch (e) {
    console.warn('Storage write warning:', e);
  }
}

function safeGetRaw(key, fallback) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const v = window.localStorage.getItem(key);
      if (v !== null) return v;
    }
  } catch (e) {}
  return _memoryStorage[key] !== undefined ? _memoryStorage[key] : fallback;
}

function safeSetRaw(key, val) {
  _memoryStorage[key] = val;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  } catch (e) {}
}

function safeRemoveRaw(key) {
  delete _memoryStorage[key];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {}
}
`;

const combined = `/** REACT_VENDOR_START **/
${reactCode}
${reactDomCode}
/** REACT_VENDOR_END **/

${safeStorageHeader}

${appCode}
`;

fs.writeFileSync('app.bundle.js', combined, 'utf8');
console.log('Combined app.bundle.js written successfully! Size:', combined.length, 'bytes');
