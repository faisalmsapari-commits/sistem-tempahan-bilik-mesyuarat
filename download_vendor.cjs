const https = require('https');
const fs = require('fs');

if (!fs.existsSync('vendor')) fs.mkdirSync('vendor');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status code ' + res.statusCode + ' for ' + url));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded:', dest, fs.statSync(dest).size, 'bytes');
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  await download('https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js', 'vendor/react.production.min.js');
  await download('https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js', 'vendor/react-dom.production.min.js');
  console.log('Download complete!');
}

run().catch(console.error);
