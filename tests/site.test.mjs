import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../docs/', import.meta.url));
const read = p => readFile(path.join(root,p),'utf8');
const sitemap = await read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]));
const pages = await Promise.all(urls.map(async url=>({url,html:await read(url.pathname==='/'?'index.html':url.pathname.slice(1)+'index.html')})));

test('all 11 indexable pages have content and their own metadata before JavaScript',()=>{
 assert.equal(pages.length,11);
 const titles = new Set();
 for (const {url,html} of pages) {
  assert.ok(html.includes(`<link rel="canonical" href="${url.href}">`),url.href);
  assert.ok(html.includes(`<meta property="og:url" content="${url.href}">`));
  assert.equal([...html.matchAll(/<h1\b/g)].length,1,url.href);
  assert.ok(html.includes('<main id="main"'));
  assert.ok(html.includes('index, follow'));
  assert.ok(!/\(click\)|routerLink|\*ngIf|\{\{/.test(html));
  const title=html.match(/<title>(.*?)<\/title>/)[1];
  assert.ok(!titles.has(title),'unique title'); titles.add(title);
  for (const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
   const schema=JSON.parse(match[1]);
   assert.ok(schema['@graph'].some(x=>x['@type']==='LocalBusiness'));
   if(url.pathname.split('/').filter(Boolean).length===2) assert.ok(schema['@graph'].some(x=>x['@type']==='Service'));
  }
 }
});

test('every internal link, asset, responsive image and anchor resolves',async()=>{
 for (const {url,html} of pages) {
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
   const target=match[1].replaceAll('&amp;','&');
   if(!target.startsWith('/') && !target.startsWith('#')) continue;
   if(target.startsWith('#')) { assert.ok(html.includes(`id="${target.slice(1)}"`),target); continue; }
   const file=target.endsWith('/')?target+'index.html':target;
   assert.ok((await stat(path.join(root,file))).isFile(),url.href+' -> '+target);
  }
  for(const match of html.matchAll(/srcset="([^"]+)"/g)) {
   for(const variant of match[1].split(', ')) assert.ok((await stat(path.join(root,variant.split(' ')[0]))).isFile());
  }
  for(const match of html.matchAll(/<a\b([^>]*)>/g)) assert.ok(/href="/.test(match[1]),url.href);
  for(const match of html.matchAll(/<img\b([^>]*)>/g)) {
   assert.ok(/alt="[^"]+"/.test(match[1]));
   assert.ok(/width="\d+"/.test(match[1]) && /height="\d+"/.test(match[1]));
  }
 }
});

test('redirects and real not-found output replace the old wildcard homepage',async()=>{
 assert.ok(!(sitemap.includes('/home')));
 assert.ok((await read('_redirects')).includes('/home / 301'));
 assert.ok((await read('home/index.html')).includes('content="0;url=/"'));
 assert.ok((await read('404.html')).includes('noindex, follow'));
});

test('gallery is lazy loaded and homepage has a prioritised hero',()=>{
 const gallery=pages.find(p=>p.url.pathname==='/photos/').html;
 const galleryImages=[...gallery.matchAll(/<a class="gallery-link".*?<img([^>]+)>/g)];
 assert.ok(galleryImages.length>=20);
 for(const m of galleryImages) assert.ok(m[1].includes('loading="lazy"'));
 const home=pages.find(p=>p.url.pathname==='/').html;
 assert.ok(home.includes('fetchpriority="high"'));
 assert.ok(!home.includes('data-bs-ride'));
});
