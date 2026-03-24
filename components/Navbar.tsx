import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { label: 'Calculators', href: '/calculators' },
  { label: 'Tools', href: '/tools' },
  { label: 'Blog', href: '/blog' }
];

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-base/90 backdrop-blur">
      <div className="section-pad">
        <div className="container-max flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-semibold text-text">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white">RP</span>
              RupeePlanner
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const active = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition ${active ? 'text-accent' : 'text-muted hover:text-text'}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ThemeToggle />
            <Link href="/calculators" className="btn-primary">
              Start Calculating
            </Link>
          </nav>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="rounded-xl border border-accent/30 p-2 text-accent"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <div className="container-max pb-4 md:hidden">
            <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-card">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-semibold text-muted"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/calculators" className="btn-primary" onClick={() => setOpen(false)}>
                Start Calculating
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
