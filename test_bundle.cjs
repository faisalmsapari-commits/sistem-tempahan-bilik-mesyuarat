const fs = require('fs');
const bundle = fs.readFileSync('app.bundle.js', 'utf8');
console.log('Bundle length:', bundle.length);
try {
  global.React = {
    useState: (v) => [typeof v === 'function' ? v() : v, () => {}],
    useEffect: (fn) => fn(),
    useMemo: (fn) => fn(),
    useContext: () => ({}),
    createContext: () => ({}),
    useCallback: (fn) => fn,
    useRef: () => ({ current: null }),
    createElement: (type, props, ...children) => {
      if (typeof type === 'function') {
        try {
          return type(props || {});
        } catch(e) {
          console.error('Error invoking component:', type.name, e);
          throw e;
        }
      }
      return { type, props, children };
    }
  };
  global.ReactDOM = {
    createRoot: () => ({ render: (el) => console.log('Render executed successfully!') })
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
