import type { Metadata } from 'next';
import { LandingNav } from '@/components/landing/LandingNav';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCta } from '@/components/landing/FinalCta';
import { LandingFooter } from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'Invoila — Real-time invoicing & payments for Indonesian SMEs',
  description:
    'Create professional invoices in two minutes, accept online payments via Midtrans, and watch every payment land in real time.',
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FinalCta />
      </main>
      <LandingFooter />
    </>
  );
}
