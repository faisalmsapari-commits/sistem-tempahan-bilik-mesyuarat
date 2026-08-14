const fs = require('fs');
const bundle = fs.readFileSync('app.bundle.js', 'utf8');
console.log('Bundle length:', bundle.length);
try {
  global.React = {
    useState: (v) => [typeof v === 'function' ? v() : v, () => {}],
    useEffect: () => {},
    useMemo: (fn) => fn(),
    useContext: () => {},
    createContext: () => ({}),
    useCallback: (fn) => fn,
    useRef: () => ({ current: null }),
    createElement: (type, props, ...children) => ({ type, props, children })
  };
  global.ReactDOM = {
    createRoot: () => ({ render: (el) => console.log('Render called with root element!') })
  };
  global.localStorage = {
    getItem: (k) => null,
    setItem: () => {},
    removeItem: () => {}
  };
  global.document = {
    getElementById: () => ({ innerHTML: '' })
  };
  eval(bundle);
  console.log('SUCCESS: No syntax or runtime error in app.bundle.js!');
} catch(err) {
  console.error('ERROR in app.bundle.js:', err);
}
