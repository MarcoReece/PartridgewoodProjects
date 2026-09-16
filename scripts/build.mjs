import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFile(path.join(root, p), 'utf8');
const services = JSON.parse(await read('site/services.json'));
const business = JSON.parse(await read('site/business.json'));
const images = JSON.parse(await read('site/images.json'));
const origin = 'https://www.partridgewoodprojects.co.za';
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json = (s) => JSON.stringify(s).replace(/</g, '\\u003c');
const out = path.join(root, 'docs');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'src/assets'), path.join(out, 'assets'), { recursive: true });
await cp(path.join(root, 'site/public'), out, { recursive: true });
const emit = async (p, content) => {
  await mkdir(path.dirname(path.join(out, p)), { recursive: true });
  await writeFile(path.join(out, p), content);
};
const asset = async (filename, content) => {
  const ext = path.extname(filename);
  const name = `${path.basename(filename, ext)}.${createHash('sha256').update(content).digest('hex').slice(0, 10)}${ext}`;
  await emit(`assets/${name}`, content);
  return `/assets/${name}`;
};
const sharedCss = await asset('site.css', await read('site/styles/base.css') + '\n' + await read('site/styles/layout.css'));
const clientJs = await asset('site.js', await read('site/client.js'));
const emailJs = await asset('contact.js', await read('site/contact.js'));
const styleUrls = {};
for (const name of ['home','about','services','photos','contact']) styleUrls[name] = await asset(`${name}.css`, await read(`site/styles/${name}.css`));

function optimiseImages(html) {
  return html.replace(/<img\b([^>]*?)\s*\/?>/g, (tag, attrs) => {
    const source = attrs.match(/src="([^"]+)"/)?.[1];
    const key = source?.startsWith('/') ? source : '/' + source;
    const image = images[key];
    if (!image) throw new Error(`Unknown image: ${source}`);
    const { variants, width, height } = image;
    const hero = attrs.includes('c-img');
    const logo = attrs.includes('logo-image');
    const sizes = hero ? '100vw' : logo ? '(max-width: 600px) 180px, 260px' : attrs.includes('floating-image') ? '48px' : '(max-width: 700px) 92vw, (max-width: 1100px) 48vw, 600px';
    attrs = attrs.replace(/src="[^"]+"/, `src="${variants.at(-1).src}"`);
    return `<img${attrs} width="${width}" height="${height}" srcset="${variants.map(v=>`${v.src} ${v.width}w`).join(', ')}" sizes="${sizes}" loading="${hero || logo ? 'eager' : 'lazy'}" decoding="async"${hero ? ' fetchpriority="high"' : ''}>`;
  }).replace(/href="(\/assets\/pictures\/[^"?]+)"/g, (all, src) => images[src] ? `href="${images[src].variants.at(-1).src}"` : all);
}
const nav = [['/', 'Home'], ['/services/', 'Services'], ['/photos/', 'Photos'], ['/about/', 'About us'], ['/contact/', 'Contact us']];
function links(url) {
  return nav.map(([href, name])=>`<a href="${href}"${href===url ? ' aria-current="page"' : ''}>${name}</a>`).join('');
}
function cards() {
  return `<div class="services-grid">${services.map(s=>`<a class="service-card" href="/services/${s.slug}/"><div class="service-card-icon">${s.icon}</div><h2>${escape(s.name)}</h2><p>${escape(s.intro)}</p><span class="read-more">Explore this service →</span></a>`).join('')}</div>`;
}
const cta = `<section class="cta-banner"><div class="container text-center"><h2 class="cta-title">Let’s talk about your project</h2><p class="cta-text">Contact Trevor for a free, no-obligation quote.</p><div class="cta-buttons"><a class="btn-primary-custom" href="/contact/">Request a quote</a><a class="btn-outline-custom" href="tel:+27614284712">Call 061 428 4712</a></div></div></section>`;
const areas = `<section class="area-section container"><h2>Working across Johannesburg</h2><p>Serving Johannesburg and surrounding areas, including Sandton, Midrand, Randburg, Fourways and the East and West Rand. <a href="/contact/">Contact Trevor</a> to discuss your property and arrange a quote.</p></section>`;

async function page({ url, title, description, body, style, extraSchema = [], noindex = false, output }) {
  const canonical = origin + url;
  const schema = {'@context':'https://schema.org','@graph':[
    {...business,'@context':undefined,'@id':origin+'/#business',url:origin+'/',image:origin + images['/assets/pictures/2.jpg'].variants.at(-1).src},
    {'@type':'WebPage','@id':canonical+'#webpage',url:canonical,name:title,description,isPartOf:{'@id':origin+'/#website'}},
    {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'Partridgewood Projects'}, ...extraSchema
  ]};
  const html = `<!doctype html>
<html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}">
<meta name="robots" content="${noindex?'noindex, follow':'index, follow'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Partridgewood Projects"><meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/pictures/2.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${origin}/assets/pictures/2.jpg">
<link rel="icon" href="/favicon.png" type="image/png"><link rel="stylesheet" href="${sharedCss}">${style?`<link rel="stylesheet" href="${styleUrls[style]}">`:''}
<script type="application/ld+json">${json(schema)}</script><script src="${clientJs}" defer></script>${style==='contact'?`<script src="${emailJs}" defer></script>`:''}
</head><body class="page-${style || 'default'}"><a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><a href="/" aria-label="Partridgewood Projects home"><img class="logo-image" src="/assets/pictures/PWPlogo.png" alt="Partridgewood Projects"></a>
<nav class="desktop-nav" aria-label="Main navigation">${links(url)}</nav><a class="header-quote btn-primary-custom" href="/contact/">Free Quote</a>
<details class="mobile-nav"><summary aria-label="Open navigation menu">Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation">${links(url)}</nav></details></header>
<main id="main" tabindex="-1">${body}</main>
${style!=='contact'?'<a class="floating-whatsapp" href="https://api.whatsapp.com/send?phone=27614284712" aria-label="Message Partridgewood Projects on WhatsApp"><img id="floating-image" src="/assets/pictures/WhatsApp.svg.png" alt="WhatsApp"></a>':''}
<footer class="site-footer"><nav aria-label="Footer">${links(url)}</nav><p>Partridgewood Projects · Johannesburg, Gauteng</p><p><a href="tel:+27614284712">061 428 4712</a> · <a href="mailto:partridgewoodprojects@gmail.com">partridgewoodprojects@gmail.com</a></p><small>© ${new Date().getUTCFullYear()} Partridgewood Projects. All rights reserved.</small></footer>
</body></html>`;
  await emit(output || (url === '/' ? 'index.html' : url.slice(1) + 'index.html'), optimiseImages(html));
}
const pages = [
  {url:'/',title:'Building & Renovation Johannesburg | Partridgewood Projects',description:'Painting, damp proofing, building alterations, tiling, gutters and aluminium installations in Johannesburg. Contact Trevor for a free quote.',style:'home',body:await read('site/pages/home.html') + areas},
  {url:'/about/',title:'About Trevor’s Team | Partridgewood Projects Johannesburg',description:'Learn about Partridgewood Projects, established in Johannesburg in 2015 with over 20 years of building and renovation experience.',style:'about',body:await read('site/pages/about.html') + areas + cta},
  {url:'/contact/',title:'Contact Trevor for a Free Quote | Partridgewood Projects',description:'Call Trevor on 061 428 4712 or send an enquiry for building, painting, damp proofing and renovation services in Johannesburg.',style:'contact',body:await read('site/pages/contact.html')},
  {url:'/photos/',title:'Project Photo Gallery | Partridgewood Projects Johannesburg',description:'Browse photographs and before-and-after examples from Partridgewood Projects. Discuss your building or renovation project with Trevor.',style:'photos',body:await read('site/pages/photos.html') + cta},
  {url:'/services/',title:'Building & Renovation Services | Partridgewood Projects',description:'Explore our painting, damp proofing, alterations, gutters, tiling and aluminium door and window services in Johannesburg.',style:'home',body:`<section class="section-padding"><div class="container"><h1 class="section-title text-center">Building & renovation services</h1><p class="section-subtitle text-center">Explore the work we do for homes and businesses across Johannesburg.</p>${cards()}</div></section>` + await read('site/pages/service-faqs.html') + areas + cta}
];
for (const s of services) {
  const url = `/services/${s.slug}/`;
  pages.push({url,title:`${s.name} in Johannesburg | Partridgewood Projects`,description:s.intro,style:'services',extraSchema:[
    {'@type':'Service','@id':origin+url+'#service',name:`${s.name} in Johannesburg`,serviceType:s.name,description:s.intro,url:origin+url,provider:{'@id':origin+'/#business'},areaServed:business.areaServed},
    {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:'Services',item:origin+'/services/'},{'@type':'ListItem',position:3,name:s.name,item:origin+url}]}
  ],body:`<div class="service-detail container"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/services/">Services</a> / <span>${escape(s.name)}</span></nav><h1>${escape(s.name)} in Johannesburg</h1><p class="service-intro">${escape(s.intro)}</p><a class="btn-primary-custom" href="/contact/">Request a free quote</a><div class="detail-grid"><section class="block"><h2>${escape(s.heading)}</h2>${s.body}</section><figure><img src="/${s.image}" alt="${escape(s.alt)}"><figcaption>${s.slug==='damp-proofing'||s.slug==='gutters'?'Service illustration':'From our service gallery'}. <a href="/photos/">Browse more photographs</a>.</figcaption></figure></div><section class="service-faqs"><h2>Your questions answered</h2>${s.faqs.map(([q,a])=>`<details class="faq-item"><summary>${escape(q)}</summary><p>${escape(a)}</p></details>`).join('')}</section><section class="related-services"><h2>Other services</h2><ul>${services.filter(x=>x.slug!==s.slug).map(x=>`<li><a href="/services/${x.slug}/">${escape(x.name)}</a></li>`).join('')}</ul></section></div>` + areas + cta});
}
for (const p of pages) await page(p);
await page({url:'/404/',title:'Page not found | Partridgewood Projects',description:'Find building and renovation services from Partridgewood Projects.',noindex:true,output:'404.html',body:'<section class="container section-padding"><h1>We couldn’t find that page</h1><p>The link may have changed. <a href="/">Visit the homepage</a> or <a href="/services/">explore our services</a>.</p></section>'});
// Fallback for static hosts without configurable redirects. Hosting rules use HTTP 301.
await emit('home/index.html',`<!doctype html><html lang="en-ZA"><head><meta charset="utf-8"><title>Partridgewood Projects</title><link rel="canonical" href="${origin}/"><meta http-equiv="refresh" content="0;url=/"></head><body><p><a href="/">Continue to Partridgewood Projects</a></p></body></html>`);
await emit('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`\n  <url><loc>${origin}${p.url}</loc></url>`).join('')}\n</urlset>\n`);
await emit('llms.txt',`# Partridgewood Projects\n\nBuilding and renovation services in Johannesburg. Contact Trevor on 061 428 4712.\n\n${pages.map(p=>`- [${p.title}](${origin}${p.url}): ${p.description}`).join('\n')}\n`);
await emit('_redirects','/home / 301\n/home/ / 301\n' + pages.filter(p=>p.url!=='/').map(p=>`${p.url.slice(0,-1)} ${p.url} 301`).join('\n') + '\n');
await emit('.nojekyll','');
console.log(`Built ${pages.length} indexable static pages, redirect fallback and 404 page in docs/.`);
