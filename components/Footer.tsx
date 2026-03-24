import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="section-pad mt-16 border-t border-white/10 bg-base">
      <div className="container-max grid gap-8 py-12 md:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">RP</span>
            RupeePlanner
          </div>
          <p className="text-sm text-muted">
            Smart financial planning tools for every Indian. Build wealth with clarity and confidence.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">Calculators</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/calculators/emi-calculator">EMI Calculator</Link></li>
            <li><Link href="/calculators/sip-calculator">SIP Calculator</Link></li>
            <li><Link href="/calculators/income-tax-calculator">Income Tax</Link></li>
            <li><Link href="/calculators/retirement-corpus-calculator">Retirement</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/tools">Tools</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/partners/banking">Partners</Link></li>
            <li><Link href="/#lead-form">Free Plan</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">Legal</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Disclaimer</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted">
        RupeePlanner is for educational purposes only. Always verify financial decisions with certified advisors.
      </div>
    </footer>
  );
};

export default Footer;
