const affiliateTag = process.env.NEXT_PUBLIC_AFFILIATE_TAG;

export const withAffiliate = (href: string, trackingParam = 'ref'): string => {
  if (!affiliateTag || !href || href === '#') return href;

  try {
    const url = new URL(href);
    url.searchParams.set(trackingParam, affiliateTag);
    return url.toString();
  } catch (error) {
    return href;
  }
};
