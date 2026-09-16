import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../docs/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/home' || pathname === '/home/') { res.writeHead(301, {Location:'/'}); return res.end(); }
    let file = path.resolve(root, '.' + pathname);
    if (file !== path.resolve(root) && !file.startsWith(root)) { res.writeHead(403); return res.end(); }
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301,{Location:pathname+'/' + url.search}); return res.end(); }
      file = path.join(file, 'index.html');
    }
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'});
    res.end(await readFile(path.join(root, '404.html')));
  }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${server.address().port}`));
