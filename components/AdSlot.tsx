import { ReactNode, useEffect } from 'react';

type AdSlotProps = {
  label: ReactNode;
  className?: string;
  adSlot?: string;
  format?: string;
};

const AdSlot = ({ label, className, adSlot, format = 'auto' }: AdSlotProps) => {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const shouldRenderAd = Boolean(client && adSlot);

  useEffect(() => {
    if (!shouldRenderAd) return;
    try {
      const adsbygoogle = ((window as any).adsbygoogle = (window as any).adsbygoogle || []);
      adsbygoogle.push({});
    } catch (error) {
      console.warn('AdSense failed to load', error);
    }
  }, [shouldRenderAd, adSlot]);

  if (!shouldRenderAd) return null;

  return (
    <div
      className={`flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-accent/40 bg-surface/70 text-sm text-muted ${className ?? ''}`}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block', minHeight: 120 }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
