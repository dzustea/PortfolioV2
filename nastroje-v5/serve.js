// Lokální test: servíruje repo se stejnými hlavičkami, jaké nastaví vercel.json
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/filda/PortfolioV2';
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

function headersFor(urlPath) {
  const out = {};
  for (const rule of cfg.headers) {
    const re = new RegExp('^' + rule.source.replace(/\//g, '\\/').replace('(.*)', '.*') + '$');
    if (re.test(urlPath)) for (const h of rule.headers) out[h.key] = h.value;
  }
  return out;
}

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(path.resolve(ROOT)) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('not found');
  }
  const h = headersFor(p);
  h['Content-Type'] = TYPES[path.extname(file)] || 'application/octet-stream';
  res.writeHead(200, h);
  res.end(fs.readFileSync(file));
});

// Port se bere z prostředí, aby šel přidělit zvenčí; 4173 je jen
// výchozí hodnota, když nikdo nic neřekne.
const PORT = Number(process.env.PORT) || 4173;

server.listen(PORT, () => console.log('http://localhost:' + PORT));
