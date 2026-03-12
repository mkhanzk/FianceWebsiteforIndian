# RupeePlanner.in

A modern multi-page financial planning website for Indian users with calculators, SEO, monetization placeholders, and lead capture.

## Features
- Loan, investment, tax, savings, retirement, and other calculators
- Chart.js visualizations and PDF exports (jsPDF)
- Lead capture API with rate limiting
- Blog with SEO schema markup
- Dark/light mode and PWA support
- Ad and affiliate placeholders

## Quick Start
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm start
```

## Deploy
- Vercel: import the repo and deploy.
- Cloudflare Pages: set build command to `npm run build` and output to `.next`.

## Customization
- Update calculators and FAQs: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\data\calculators.ts`
- Update blog content: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\data\blogPosts.ts`
- Update SEO defaults: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\next-seo.config.js`
- Update sitemap: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\public\sitemap.xml`

## Lead Capture
The endpoint `POST /api/leads` stores leads in `data/leads.json` for local development. Replace this with your CRM or Google Sheets integration in production.

## Notes
- Replace `public/og-cover.png` and `public/icons/icon.svg` with your brand assets.
- Tax slab values are sample defaults. Update them to match current regulations.
