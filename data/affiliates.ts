export type Affiliate = {
  name: string;
  description: string;
  href: string;
  trackingParam?: string;
};

export const affiliates: Affiliate[] = [
  {
    name: 'Groww',
    description: 'Start SIPs and stocks with a seamless investing app.',
    href: 'https://groww.in',
    trackingParam: 'ref'
  },
  {
    name: 'Zerodha',
    description: 'India\'s leading brokerage platform for long-term investors.',
    href: 'https://zerodha.com',
    trackingParam: 'ref'
  },
  {
    name: 'Banking Partners',
    description: 'Compare home loan, personal loan, and credit card offers.',
    href: '#'
  },
  {
    name: 'Insurance Partners',
    description: 'Find term and health plans that match your goals.',
    href: '#'
  }
];
