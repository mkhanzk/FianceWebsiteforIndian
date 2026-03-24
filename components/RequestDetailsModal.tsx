import { X, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import LeadForm from './LeadForm';

type RequestDetailsModalProps = {
  open: boolean;
  onClose: () => void;
};

const RequestDetailsModal = ({ open, onClose }: RequestDetailsModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Request Details"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-4xl rounded-3xl bg-surface p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label">Request Details</p>
            <h2 className="mt-2 text-2xl font-semibold text-text">Get a personalized financial plan</h2>
            <p className="mt-2 text-sm text-muted">
              Share your details and receive a tailored plan for loans, investments, and tax savings within 24 hours.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-muted transition hover:text-text"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="card">
              <p className="text-sm font-semibold text-text">What you get</p>
              <div className="mt-4 space-y-3">
                {[
                  { icon: TrendingUp, label: 'Goal-based recommendations', detail: 'Actionable steps for 3, 6, and 12 months.' },
                  { icon: ShieldCheck, label: 'Secure handling', detail: 'Your details are encrypted and never sold.' },
                  { icon: Clock, label: 'Fast response', detail: 'Dedicated advisors reach out within 1 business day.' }
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-base p-4">
                    <item.icon className="text-accent" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-text">{item.label}</p>
                      <p className="text-xs text-muted">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-base/60 p-4 text-xs text-muted">
              By submitting, you agree to be contacted about financial services. We respect your privacy and never
              share data without consent.
            </div>
          </div>
          <LeadForm variant="compact" />
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;

