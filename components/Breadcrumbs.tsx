import Link from 'next/link';
import { useRouter } from 'next/router';

const Breadcrumbs = () => {
  const router = useRouter();
  const path = router.asPath.split('?')[0];
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <div className="section-pad">
      <div className="container-max py-4 text-sm text-muted">
        <nav className="flex flex-wrap items-center gap-2">
          <Link href="/" className="text-accent">
            Home
          </Link>
          {segments.map((segment, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');
            const label = segment
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase());
            const isLast = index === segments.length - 1;
            return (
              <span key={href} className="flex items-center gap-2">
                <span className="text-muted">/</span>
                {isLast ? (
                  <span className="text-text">{label}</span>
                ) : (
                  <Link href={href} className="text-accent">
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
