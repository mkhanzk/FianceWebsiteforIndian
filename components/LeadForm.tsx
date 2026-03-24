import { useEffect, useState } from 'react';

type LeadFormProps = {
  variant?: 'default' | 'compact';
};

type StatusState = {
  type: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
};

const LeadForm = ({ variant = 'default' }: LeadFormProps) => {
  const [status, setStatus] = useState<StatusState>({ type: 'idle' });
  const [submittedAt, setSubmittedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!submittedAt) return;
    const timer = window.setTimeout(() => {
      setStatus({ type: 'idle' });
      setSubmittedAt(null);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [submittedAt]);

  const clearStatus = () => {
    if (status.type === 'error' || status.type === 'success') {
      setStatus({ type: 'idle' });
    }
  };

  const validate = (payload: { name: string; email: string; phone: string }) => {
    const errors: string[] = [];
    if (payload.name.trim().length < 2) {
      errors.push('Please enter your full name.');
    }
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      errors.push('Please enter a valid email.');
    }
    const digits = payload.phone.replace(/\D/g, '');
    if (digits.length < 8) {
      errors.push('Please enter a valid phone number.');
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    };
    const errors = validate(payload);
    if (errors.length > 0) {
      setStatus({ type: 'error', message: errors[0] });
      return;
    }

    setStatus({ type: 'loading', message: 'Sending request...' });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let data: { message?: string } | null = null;
      try {
        data = await res.json();
      } catch (error) {
        data = null;
      }

      if (!res.ok) {
        setStatus({ type: 'error', message: data?.message || 'Unable to submit. Please try again.' });
        return;
      }

      setStatus({ type: 'success', message: data?.message || 'Thanks! We will reach out shortly.' });
      setSubmittedAt(Date.now());
      event.currentTarget.reset();
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-surface p-6 shadow-card"
      id={variant === 'default' ? 'lead-form' : undefined}
    >
      <div>
        <p className="text-sm font-semibold text-text">Get Free Financial Plan</p>
        <p className="text-xs text-muted">Share your details and our partner advisors will reach out.</p>
      </div>
      <div className={`grid gap-4 ${variant === 'compact' ? '' : 'md:grid-cols-3'}`}>
        <input className="input" name="name" placeholder="Name" required onChange={clearStatus} minLength={2} />
        <input className="input" type="email" name="email" placeholder="Email" required onChange={clearStatus} />
        <input className="input" name="phone" placeholder="Phone" required onChange={clearStatus} minLength={8} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={status.type === 'loading'}>
          {status.type === 'loading' ? 'Sending...' : 'Request Plan'}
        </button>
        {status.type === 'success' && (
          <span className="text-xs text-accent" role="status" aria-live="polite">
            {status.message}
          </span>
        )}
        {status.type === 'error' && (
          <span className="text-xs text-red-500" role="alert">
            {status.message || 'Something went wrong. Try again.'}
          </span>
        )}
      </div>
      <p className="text-xs text-muted">By submitting, you agree to be contacted about financial services.</p>
    </form>
  );
};

export default LeadForm;
