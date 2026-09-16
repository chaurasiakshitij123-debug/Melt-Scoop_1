import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const backupsDir = path.join(__dirname, 'backups');
const uploadsDir = path.join(__dirname, 'assets', 'images', 'uploads');

if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Editor-PIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // API: Publish
  if (req.method === 'POST' && pathname === '/api/publish') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data && data.html) {
          const now = new Date();
          const timestamp = now.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
          const backupFile = path.join(backupsDir, `index_${timestamp}.html`);
          const indexFile = path.join(__dirname, 'index.html');
          
          if (fs.existsSync(indexFile)) {
            fs.copyFileSync(indexFile, backupFile);
            fs.copyFileSync(indexFile, path.join(__dirname, 'index.backup.html'));
          }

          fs.writeFileSync(indexFile, data.html, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, message: '🚀 Published Live to disk (index.html)!' }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'No HTML content provided' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Upload image
  if (req.method === 'POST' && pathname === '/api/upload-image') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (data && data.data) {
          let rawData = data.data;
          let ext = 'png';
          if (rawData.startsWith('data:image/')) {
            const parts = rawData.split(';base64,');
            const header = parts[0];
            rawData = parts[1];
            if (header.includes('jpeg') || header.includes('jpg')) ext = 'jpg';
            else if (header.includes('webp')) ext = 'webp';
            else if (header.includes('gif')) ext = 'gif';
            else if (header.includes('svg')) ext = 'svg';
          }
          const cleanName = (data.filename || 'img').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const rand = Math.floor(1000 + Math.random() * 9000);
          const fileName = `${cleanName}_${rand}.${ext}`;
          const destPath = path.join(uploadsDir, fileName);
          fs.writeFileSync(destPath, Buffer.from(rawData, 'base64'));
          const relUrl = `assets/images/uploads/${fileName}`;
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ success: true, url: relUrl }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'No image data provided' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const filePath = path.join(__dirname, pathname.replace(/^\//, '').replace(/\//g, path.sep));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>404 Not Found</h1><p>The file ${pathname} was not found.</p>`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🍦 MELT & SCOOP Server running on http://localhost:${PORT}`);
  console.log(`Also accessible at http://127.0.0.1:${PORT}`);
});
