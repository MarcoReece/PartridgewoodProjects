# Partridgewood Projects

A static website for the Johannesburg building and renovation business. The existing burgundy/grey branding, photographs and contact details are retained. Pages are complete HTML at build time; there is no Angular runtime, Bootstrap dependency or client-side router.

## Development

Use Node.js 24 LTS (Node 22+ is supported). There are no npm dependencies to install.

```sh
npm run build   # Generate docs/
npm test        # Build and run content, asset, SEO and contact-form tests
npm start       # Build and preview at http://127.0.0.1:4173
```

`npm run deploy` only builds the output; it does not publish. Commit the source and generated `docs/` together when ready to release.

## Editing

- `site/pages/`: home, about, contact, gallery and existing service FAQ copy.
- `site/services.json`: six service pages, descriptions, images and service-specific questions.
- `site/business.json`: the existing public business schema. Verify changes with the owner.
- `site/styles/`: shared styles and page styles.
- `site/client.js`: mobile-menu enhancements, native-dialog gallery and analytics.
- `site/contact.js`: the existing EmailJS service/template integration, with accessible status, validation, retry handling and a honeypot.
- `scripts/build.mjs`: metadata, structured data, navigation, sitemap and static output generation.
- `src/assets/pictures/`: original images, preserved at their existing public URLs.
- `site/public/` and `site/images.json`: committed optimised assets and responsive image metadata.

To regenerate image variants after editing originals, install Pillow in a Python environment and run `python scripts/optimise-images.py`, then rebuild. Normal deployments do not need Python or Pillow. The script strips metadata from new WebP images; the original files are retained unchanged for compatibility.

## Pages and SEO

The canonical homepage is `/`. `/home` and `/home/` should redirect permanently to it. Other pages use trailing-slash URLs, backed by real `index.html` files. Existing service, contact, about and photo links continue to resolve through directory URLs. Six new service pages live beneath `/services/`.

Every indexable page includes a title, description, self-referencing canonical URL, social metadata and business schema in the initial HTML. Service pages also include Service and BreadcrumbList schema. `sitemap.xml` contains only canonical pages. It deliberately omits fabricated update dates. Unknown URLs should return a real 404 using `404.html`.

## Hosting and release

The current public response includes an `rndr-id` header, which suggests Render; the hosting account has not been inspected. Confirm the existing host and branch before publishing. Do not create a replacement service or change DNS just to ship this update.

For the existing Render static site:

1. Set the build command to `npm run build` and the publish directory to `docs`. Use Node 24.
2. Remove any old catch-all `/*` → `/index.html` SPA rewrite. This is essential for missing URLs to return 404 rather than the homepage.
3. Add `/home` → `/` and `/home/` → `/` as Redirect (301) rules. Render serves existing files ahead of rules: remove the generated `docs/home` fallback in the Render build command (`npm run build && rm -rf docs/home`) if using these HTTP redirects. The fallback is for static hosts without configurable redirects.
4. Check that `/services` resolves to `/services/`, each nested service URL loads directly and `/this-page-does-not-exist` returns 404.
5. Verify the HTTPS domain, sitemap, structured data and contact delivery after deployment.

`docs/_redirects` supplies 301 rules for hosts supporting that file. Render uses dashboard rules instead. No catch-all rewrite should be added. Original image URLs are preserved. The old GitHub Pages repository-path `base-href` deployment is retired: this build targets the existing custom domain at its root.

Render reference: https://render.com/docs/redirects-rewrites

## Analytics and contact verification

The existing GA property `G-W8198BVB2G` and GTM container `GTM-TVMZ9K89` are retained and load only on the production domain. New events are `contact_click` (phone/email/WhatsApp) and `generate_lead` (only after a successful EmailJS response). No enquiry field contents are included in these events. Audit the existing GTM container for duplicate GA configuration and mark the desired events as key events in GA4. Account configuration and event receipt have not been verified.

Tests mock EmailJS success, HTTP rejection, network failure and repeated submissions; they never send email. Browser checks validate the form's labels and required fields. Actual inbox delivery needs a separately authorised test enquiry. EmailJS public IDs are intentionally public; origin restrictions and any CAPTCHA/rate-limit settings are managed in the EmailJS account. The browser honeypot is only a basic filter.

## Business content requiring owner input

Existing testimonials, coverage areas, registration/insurance claims, address, hours and experience claims have been carried over, not independently verified. No new customer stories, review sources, credentials, prices or completed-project locations have been invented. Obtain verified project details and permission before adding case studies or review attribution. Google Business Profile, Search Console and Analytics account work remains separate from the code changes.
