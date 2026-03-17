import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { ArrowRight, BadgeCheck, TrendingUp, Shield } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import LeadForm from '../components/LeadForm';
import SectionHeading from '../components/SectionHeading';
import { tips } from '../data/tips';
import { tools } from '../data/tools';
import { blogPosts } from '../data/blogPosts';
import { affiliates } from '../data/affiliates';
import { calculators } from '../data/calculators';
import { withAffiliate } from '../lib/affiliate';

const quickCalculators = calculators.slice(0, 6);

export default function Home() {
  return (
    <>
      <NextSeo
        title="RupeePlanner - Smart Financial Planning for Every Indian"
        description="Modern financial calculators, insights, and planning tools for Indians. Plan loans, investments, tax, and retirement in one place."
      />

      <section className="section-pad">
        <div className="container-max grid items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="badge">RupeePlanner.in</div>
            <h1 className="text-3xl font-semibold text-text md:text-5xl">
              Smart Financial Planning for Every Indian
            </h1>
            <p className="text-base text-muted md:text-lg">
              All-in-one calculators, insights, and goal tracking that help you plan loans, investments, tax, and retirement faster.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/calculators" className="btn-primary">
                Explore Calculators
                <ArrowRight size={16} />
              </Link>
              <Link href="/tools" className="btn-secondary">
                View Planning Tools
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card">
                <TrendingUp className="text-accent" size={20} />
                <div>
                  <p className="text-sm font-semibold text-text">Growth Ready</p>
                  <p className="text-xs text-muted">Investment planning</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card">
                <Shield className="text-accent" size={20} />
                <div>
                  <p className="text-sm font-semibold text-text">Secure</p>
                  <p className="text-xs text-muted">Privacy-first forms</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card">
                <BadgeCheck className="text-accent" size={20} />
                <div>
                  <p className="text-sm font-semibold text-text">Fast Results</p>
                  <p className="text-xs text-muted">Instant calculations</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <AdSlot label="Top Banner Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER} />
            <div className="rounded-3xl bg-surface p-6 shadow-card">
              <p className="text-sm font-semibold text-text">Your Financial Dashboard</p>
              <p className="mt-2 text-xs text-muted">Track EMI, SIP, and tax in one view.</p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-base p-4">
                  <p className="text-xs text-muted">Monthly EMIs</p>
                  <p className="text-lg font-semibold text-text">INR 42,600</p>
                </div>
                <div className="rounded-2xl bg-base p-4">
                  <p className="text-xs text-muted">Monthly SIP</p>
                  <p className="text-lg font-semibold text-text">INR 12,000</p>
                </div>
                <div className="rounded-2xl bg-base p-4">
                  <p className="text-xs text-muted">Tax Savings</p>
                  <p className="text-lg font-semibold text-text">INR 1.2L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Quick Calculators" subtitle="Jump into the most used tools" />
          <div className="grid gap-4 md:grid-cols-3">
            {quickCalculators.map((calc) => (
              <Link key={calc.slug} href={`/calculators/${calc.slug}`} className="card">
                <p className="text-sm font-semibold text-text">{calc.title}</p>
                <p className="mt-2 text-xs text-muted">{calc.description}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-accent">Try now</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Financial Tips" subtitle="Daily money moves that matter" />
          <div className="grid gap-4 md:grid-cols-3">
            {tips.map((tip) => (
              <div key={tip.title} className="card">
                <span className="badge">{tip.tag}</span>
                <h3 className="mt-4 text-lg font-semibold text-text">{tip.title}</h3>
                <p className="mt-2 text-sm text-muted">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Featured Tools" subtitle="Plan, track, and stay ahead" />
          <div className="grid gap-4 md:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="card">
                <h3 className="text-lg font-semibold text-text">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted">{tool.description}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-accent">Explore</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Latest Articles" subtitle="SEO-optimized insights from our blog" />
          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
                <p className="badge">{post.category}</p>
                <h3 className="mt-4 text-lg font-semibold text-text">{post.title}</h3>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-accent">Read more</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Monetization" subtitle="Ad placements and affiliate partners" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <AdSlot label="Sidebar Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} />
              <AdSlot label="In-Content Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-text">Affiliate Partners</h3>
              <div className="mt-4 space-y-4">
                {affiliates.map((partner) => (
                  <div key={partner.name} className="rounded-2xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-text">{partner.name}</p>
                    <p className="text-xs text-muted">{partner.description}</p>
                    <a
                      className="mt-2 inline-flex text-xs font-semibold text-accent"
                      href={withAffiliate(partner.href, partner.trackingParam)}
                      target="_blank"
                      rel="noreferrer nofollow sponsored"
                    >
                      View offer
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="Call To Action" subtitle="Get your custom financial roadmap" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <h3 className="text-lg font-semibold text-text">Let our partners build your plan</h3>
              <p className="mt-2 text-sm text-muted">
                Share your goals and we will connect you to trusted advisors for loans, investments, and insurance.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-base p-4">
                  <p className="text-xs text-muted">Average response time</p>
                  <p className="text-lg font-semibold text-text">15 minutes</p>
                </div>
                <div className="rounded-2xl bg-base p-4">
                  <p className="text-xs text-muted">Lead conversion</p>
                  <p className="text-lg font-semibold text-text">High intent</p>
                </div>
              </div>
            </div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
