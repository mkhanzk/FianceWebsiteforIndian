import type { DefaultSeoProps } from 'next-seo';

const siteUrl = 'https://rupeeplanner.in';

const title = 'RupeePlanner - Smart Financial Planning for Every Indian';
const description =
  'RupeePlanner helps Indians calculate loans, investments, tax, retirement, and savings with modern calculators, insights, and downloadable reports.';

const seoConfig: DefaultSeoProps = {
  title,
  description,
  canonical: siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'RupeePlanner',
    title,
    description,
    images: [
      {
        url: `${siteUrl}/og-cover.png`,
        width: 1200,
        height: 630,
        alt: 'RupeePlanner - Financial Planning for Indians'
      }
    ]
  },
  twitter: {
    handle: '@rupeeplanner',
    site: '@rupeeplanner',
    cardType: 'summary_large_image'
  },
  additionalLinkTags: [
    { rel: 'icon', href: '/icons/icon.svg' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
};

export default seoConfig;
