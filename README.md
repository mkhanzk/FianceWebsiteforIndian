# RupeePlanner.in

A modern multi-page financial planning website for Indian users with calculators, SEO, monetization, and lead capture.

## Features
- Loan, investment, tax, savings, retirement, and other calculators
- Chart.js visualizations and Excel exports
- Lead capture API with rate limiting and webhook forwarding
- Blog with SEO schema markup
- Dark/light mode and PWA support
- AdSense-ready placements and affiliate tracking

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
- `NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER`
- `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`
- `NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT`
- `NEXT_PUBLIC_ADSENSE_SLOT_BLOG_INLINE`
- `NEXT_PUBLIC_AFFILIATE_TAG`
- `LEADS_WEBHOOK_URL`
- `LEADS_WEBHOOK_SECRET`

## Deploy
- Vercel: import the repo and deploy.
- Cloudflare Pages: build command `npm run build`, output `.next`.

## Lead Capture
The endpoint `POST /api/leads` stores leads in `data/leads.json` during local development. In production, set `LEADS_WEBHOOK_URL` to forward leads to Google Sheets (Apps Script Web App) or your CRM webhook.

## Customization
- Update calculators and FAQs: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\data\calculators.ts`
- Update blog content: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\data\blogPosts.ts`
- Update SEO defaults: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\next-seo.config.js`
- Update sitemap: `C:\Users\Mohd Faiz Khan\Downloads\FianceWebsiteforIndian\public\sitemap.xml`

## Notes
- Replace `public/og-cover.png` and `public/icons/icon.svg` with your brand assets.
- Tax slab values are sample defaults. Update them to match current regulations.
