import { NextSeo } from 'next-seo';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { withAffiliate } from '../../lib/affiliate';

const insurancePartners = [
  {
    name: 'Policybazaar',
    description: 'Compare term and health plans in minutes.',
    href: 'https://www.policybazaar.com',
    trackingParam: 'ref'
  },
  {
    name: 'HDFC Life',
    description: 'Term insurance and protection plans.',
    href: 'https://www.hdfclife.com',
    trackingParam: 'ref'
  },
  {
    name: 'ICICI Lombard',
    description: 'Health and motor insurance coverage.',
    href: 'https://www.icicilombard.com',
    trackingParam: 'ref'
  },
  {
    name: 'Max Life',
    description: 'Long-term family protection plans.',
    href: 'https://www.maxlifeinsurance.com',
    trackingParam: 'ref'
  }
];

export default function InsurancePartnersPage() {
  return (
    <>
      <NextSeo title="Insurance Partners - RupeePlanner" description="Compare term and health insurance options." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Insurance Partners" subtitle="Protect your family with the right cover" />
          <p className="max-w-2xl text-sm text-muted">
            Review trusted insurers and compare plans. Links include your affiliate tag when configured.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {insurancePartners.map((partner) => (
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
            <AdSlot label="Insurance Partner Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
          </div>
        </div>
      </section>
    </>
  );
}