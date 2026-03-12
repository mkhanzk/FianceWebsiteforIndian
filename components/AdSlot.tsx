import { ReactNode } from 'react';

const AdSlot = ({ label, className }: { label: ReactNode; className?: string }) => {
  return (
    <div className={`flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-accent/40 bg-surface/70 text-sm text-muted ${className ?? ''}`}>
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-muted">Ad Placement</div>
        <div className="mt-2 font-semibold text-text">{label}</div>
        <div className="mt-1 text-xs text-muted">Google AdSense / Affiliate Banner</div>
      </div>
    </div>
  );
};

export default AdSlot;
