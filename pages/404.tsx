import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-max flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <h1 className="text-4xl font-semibold text-text">Page not found</h1>
        <p className="text-sm text-muted">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </div>
    </section>
  );
}
