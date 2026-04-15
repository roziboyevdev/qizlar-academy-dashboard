'use strict';

/**
 * CRA build dan keyin / va /login uchun statik HTML yozadi (SEO + birinchi bo‘ryoq).
 * Zamonaviy Puppeteer ishlatadi (react-snap’dagi eski Chromium emas).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const buildDir = path.resolve(__dirname, '..', 'build');
const PORT = Number(process.env.PRERENDER_PORT || 47832);

/** Vercel va boshqa minimal Linux imagelarda Chromium uchun libnspr4 va boshqalar bo‘lmaydi. */
function shouldSkipPrerender() {
  const skip = process.env.SKIP_PRERENDER;
  if (skip === '1' || skip === 'true') return true;
  const vercel = process.env.VERCEL;
  if (vercel === '1' || vercel === 'true') return true;
  return false;
}

function getMime(filePath) {
  const ext = path.extname(filePath);
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain',
    '.map': 'application/json',
  };
  return map[ext] || 'application/octet-stream';
}

function staticHandler(req, res) {
  const u = new URL(req.url || '/', 'http://127.0.0.1');
  let rel = decodeURIComponent(u.pathname);
  if (rel.endsWith('/')) {
    rel = `${rel}index.html`;
  }
  if (rel === '' || rel === '/') {
    rel = '/index.html';
  }

  const filePath = path.normalize(path.join(buildDir, rel));
  if (!filePath.startsWith(buildDir)) {
    res.writeHead(403);
    res.end();
    return;
  }

  const sendFile = (fp) => {
    if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return false;
    res.writeHead(200, { 'Content-Type': getMime(fp) });
    fs.createReadStream(fp).pipe(res);
    return true;
  };

  if (sendFile(filePath)) return;

  const indexHtml = path.join(buildDir, 'index.html');
  if (sendFile(indexHtml)) return;

  res.writeHead(404);
  res.end('Not found');
}

async function main() {
  if (!fs.existsSync(buildDir)) {
    console.error('prerender: build/ topilmadi. Avval CRA build qiling.');
    process.exit(1);
  }

  if (shouldSkipPrerender()) {
    console.log(
      'prerender: o‘tkazib yuborildi (Vercel yoki SKIP_PRERENDER=1). SEO: Helmet + index.html; to‘liq statik HTML prerender faqat Chromium ishlaydigan muhitda.',
    );
    return;
  }

  const server = http.createServer(staticHandler);
  await new Promise((resolve, reject) => {
    server.listen(PORT, '127.0.0.1', () => resolve());
    server.on('error', reject);
  });

  const base = `http://127.0.0.1:${PORT}`;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 120000 });
    await page
      .waitForFunction(
        () =>
          !!document.querySelector('.landing-page') ||
          !!document.querySelector('h1.hero-title'),
        { timeout: 30000 },
      )
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 2000));
    fs.writeFileSync(path.join(buildDir, 'index.html'), await page.content(), 'utf8');
    console.log('prerender: / -> index.html');

    await page.goto(`${base}/login`, { waitUntil: 'networkidle2', timeout: 120000 });
    await page
      .waitForFunction(() => !!document.querySelector('#password'), { timeout: 30000 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));
    const loginDir = path.join(buildDir, 'login');
    fs.mkdirSync(loginDir, { recursive: true });
    fs.writeFileSync(path.join(loginDir, 'index.html'), await page.content(), 'utf8');
    console.log('prerender: /login -> login/index.html');

    await page.close();
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(() => resolve()));
  }
}

main().catch((err) => {
  console.error('prerender xato:', err);
  process.exit(1);
});
