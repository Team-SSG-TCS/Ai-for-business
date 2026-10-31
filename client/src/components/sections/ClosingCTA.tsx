import React from 'react';
import { closingCtaContent } from '../../content/closingCta';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ShieldCheck } from 'lucide-react';

interface ClosingCTAProps {
  onOpenDemo: () => void;
}

export const ClosingCTA: React.FC<ClosingCTAProps> = ({ onOpenDemo }) => {
  const { title, paragraph, primaryButtonText, secondaryButtonText, metricBadge, bannerDetail } = closingCtaContent;

  return (
    <section
      id="closing-cta"
      aria-labelledby="closing-cta-title"
      className="relative bg-[var(--color-surface-inverse)] text-white py-20 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Radial Glow Top Right (Section 4.4) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] closing-glow pointer-events-none" aria-hidden="true" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-brand-50)] text-[var(--color-brand-400)] border border-[var(--color-brand-600)]/30">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{metricBadge}</span>
          </span>

          <h2 id="closing-cta-title" className="font-display text-white max-w-2xl mx-auto">
            {title}
          </h2>

          <p className="font-body-lg text-[#C9D0DD] max-w-xl mx-auto">
            {paragraph}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDemo}
              className="w-full sm:w-auto"
            >
              {primaryButtonText}
            </Button>
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto h-[52px] px-8 min-h-[48px] rounded-[var(--radius-sm)] border border-white/30 text-white font-semibold hover:bg-white/10 active:bg-white/20 transition-all text-[15px] cursor-pointer"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>

        {/* Wide Banner Visual 1200x520 proportion with radius-lg */}
        <div className="mt-12 max-w-5xl mx-auto rounded-[var(--radius-lg)] border border-white/15 bg-white/5 backdrop-blur-md p-6 sm:p-10 shadow-[var(--shadow-lg)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-600)] flex items-center justify-center text-white font-bold">
                C
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-white">
                  {bannerDetail.title}
                </h3>
                <span className="text-[12px] text-gray-400">
                  Global Distributed Clustering & Multi-Tenant Isolation
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[12px] font-mono text-emerald-300 font-medium">99.99% Production Uptime</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            {bannerDetail.metrics.map((m) => (
              <div key={m.label} className="p-4 rounded-[var(--radius-sm)] bg-white/5 border border-white/10">
                <div className="text-[28px] lg:text-[34px] font-bold text-white font-stat">
                  {m.value}
                </div>
                <div className="text-[13px] text-gray-400 mt-1">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
