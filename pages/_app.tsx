import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';
import Layout from '../components/Layout';
import AdSenseScript from '../components/AdSenseScript';
import '../styles/globals.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
      });
    }
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <AdSenseScript />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
