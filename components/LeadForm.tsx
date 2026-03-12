import { useState } from 'react';

const LeadForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || '')
    };
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-surface p-6 shadow-card" id="lead-form">
      <div>
        <p className="text-sm font-semibold text-text">Get Free Financial Plan</p>
        <p className="text-xs text-muted">Share your details and our partner advisors will reach out.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <input className="input" name="name" placeholder="Name" required />
        <input className="input" type="email" name="email" placeholder="Email" required />
        <input className="input" name="phone" placeholder="Phone" required />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Request Plan'}
        </button>
        {status === 'success' && <span className="text-xs text-accent">Thanks! We will reach out shortly.</span>}
        {status === 'error' && <span className="text-xs text-red-500">Something went wrong. Try again.</span>}
      </div>
      <p className="text-xs text-muted">By submitting, you agree to be contacted about financial services.</p>
    </form>
  );
};

export default LeadForm;
