import React from 'react';
import { securityContent } from '../../content/security';
import { Container } from '../ui/Container';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const SecurityBand: React.FC = () => {
  const { badgeLabel, badgeTitle, badgeSubtitle, title, paragraph, certifications, cta } = securityContent;

  return (
    <section
      id="security"
      aria-labelledby="security-band-title"
      className="bg-[var(--bg-section-alt)] py-16 sm:py-20 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-8 sm:p-12 shadow-[var(--shadow-xs)] flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
          {/* Badge Visual Left (≈160px) */}
          <div className="shrink-0 w-40 h-40 rounded-[var(--radius-md)] bg-[var(--color-brand-50)] border-2 border-[var(--color-brand-100)] flex flex-col items-center justify-center text-center p-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand-600)] text-white flex items-center justify-center mb-2 shadow-xs">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-[10px] font-bold text-[var(--color-brand-600)] tracking-wider uppercase">
              {badgeLabel}
            </span>
            <span className="text-[14px] font-bold text-[var(--color-ink-900)] leading-tight mt-0.5">
              {badgeTitle}
            </span>
            <span className="text-[10px] font-mono text-[var(--color-ink-500)] mt-0.5">
              {badgeSubtitle}
            </span>
          </div>

          {/* Right Column: Information & Certifications */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <h2 id="security-band-title" className="font-h2 text-[var(--text-heading)]">
              {title}
            </h2>
            <p className="font-body text-[var(--text-body)] max-w-2xl">
              {paragraph}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-heading)] justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-success-600)] shrink-0" aria-hidden="true" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <a
                href={cta.href}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-brand-600)] hover:underline min-h-[44px]"
              >
                <span>{cta.label}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
