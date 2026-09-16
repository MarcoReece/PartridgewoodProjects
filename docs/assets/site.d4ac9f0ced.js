(() => {
  // Preserve the existing GA property and GTM container. Audit the container in
  // the owner's account before removing tags; it may contain other integrations.
  // Never include enquiry contents or personal details in analytics events.
  const isProduction = /^(www\.)?partridgewoodprojects\.co\.za$/.test(location.hostname);
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  if (isProduction) {
    window.gtag('js', new Date());
    window.gtag('config', 'G-W8198BVB2G');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-W8198BVB2G';
    document.head.append(script);
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const tagManager = document.createElement('script');
    tagManager.async = true;
    tagManager.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TVMZ9K89';
    document.head.append(tagManager);
  }
  window.trackEnquiry = (name, method) => {
    if (isProduction) window.gtag('event', name, { contact_method: method });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('tel:')) window.trackEnquiry('contact_click', 'phone');
    else if (href.startsWith('mailto:')) window.trackEnquiry('contact_click', 'email');
    else if (href.startsWith('https://api.whatsapp.com/')) window.trackEnquiry('contact_click', 'whatsapp');
  });
  const menu = document.querySelector('.mobile-nav');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
  const links = [...document.querySelectorAll('.gallery-link')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'gallery-dialog';
  dialog.setAttribute('aria-label', 'Project photograph');
  dialog.innerHTML = '<div class="gallery-controls"><button type="button" data-prev>Previous</button><span aria-live="polite" data-counter></span><button type="button" data-next>Next</button><button type="button" data-close>Close</button></div><img alt="">';
  document.body.append(dialog);
  let selected = 0;
  let opener;
  function show(index) {
    selected = (index + links.length) % links.length;
    const source = links[selected].querySelector('img');
    const image = dialog.querySelector('img');
    image.src = links[selected].href;
    image.alt = source.alt;
    dialog.querySelector('[data-counter]').textContent = `${selected + 1} of ${links.length}`;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    show(index);
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(selected - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(selected + 1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(selected - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(selected + 1); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
})();
