import { NextSeo } from 'next-seo';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { withAffiliate } from '../../lib/affiliate';

const bankingPartners = [
  {
    name: 'HDFC Bank',
    description: 'Home and personal loans with competitive rates.',
    href: 'https://www.hdfcbank.com/personal/borrow/home-loan',
    trackingParam: 'ref'
  },
  {
    name: 'ICICI Bank',
    description: 'Credit cards, auto loans, and EMI offers.',
    href: 'https://www.icicibank.com',
    trackingParam: 'ref'
  },
  {
    name: 'SBI',
    description: 'Government-backed home loan options.',
    href: 'https://sbi.co.in/web/personal-banking/loans/home-loans',
    trackingParam: 'ref'
  },
  {
    name: 'Axis Bank',
    description: 'Personal loans and credit cards for salaried professionals.',
    href: 'https://www.axisbank.com/retail/loans/personal-loan',
    trackingParam: 'ref'
  }
];

export default function BankingPartnersPage() {
  return (
    <>
      <NextSeo title="Banking Partners - RupeePlanner" description="Compare banking partners for loans and credit cards." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Banking Partners" subtitle="Choose verified lenders and card partners" />
          <p className="max-w-2xl text-sm text-muted">
            These partners can offer home loans, personal loans, and credit cards. Links include your affiliate tag when configured.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {bankingPartners.map((partner) => (
              <a
                key={partner.name}
                href={withAffiliate(partner.href, partner.trackingParam)}
                target="_blank"
                rel="noreferrer sponsored"
                className="card"
              >
                <h3 className="text-lg font-semibold text-text">{partner.name}</h3>
                <p className="mt-2 text-sm text-muted">{partner.description}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-accent">Visit partner</span>
              </a>
            ))}
          </div>
          <div className="mt-8">
            <AdSlot label="Banking Partner Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
          </div>
        </div>
      </section>
    </>
  );
}