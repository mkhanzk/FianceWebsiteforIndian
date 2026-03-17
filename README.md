# RupeePlanner.in

A modern multi-page financial planning website for Indian users with calculators, SEO, monetization, and lead capture.

## Features
- Loan, investment, tax, savings, retirement, and other calculators
- Chart.js visualizations and PDF exports (jsPDF)
- Lead capture API with rate limiting and webhook forwarding
- Blog with SEO schema markup
- Dark/light mode and PWA support
- AdSense Auto Ads and affiliate tracking

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

## Environment Variables
Copy `.env.example` to `.env.local` and fill in your values.

- `NEXT_PUBLIC_ADSENSE_CLIENT`
- `NEXT_PUBLIC_AFFILIATE_TAG`
- `LEADS_WEBHOOK_URL`
- `LEADS_WEBHOOK_SECRET`

## Deploy
- Vercel: import the repo and deploy.
- Cloudflare Pages: build command `npm run build`, output `.next`.

## Lead Capture
The endpoint `POST /api/leads` stores leads in `data/leads.json` during local development. In production, set `LEADS_WEBHOOK_URL` to forward leads to Google Sheets (Apps Script Web App) or your CRM webhook.

## Customization
- Update calculators and FAQs: `data/calculators.ts`
- Update blog content: `data/blogPosts.ts`
- Update SEO defaults: `next-seo.config.ts`
- Update sitemap: `public/sitemap.xml`

## Notes
- Replace `public/og-cover.png` and `public/icons/icon.svg` with your brand assets.
- Tax slab values are sample defaults. Update them to match current regulations.
