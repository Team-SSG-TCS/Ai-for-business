import React, { useState } from 'react';
import { caseStudiesContent } from '../../content/caseStudies';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CaseStudiesProps {
  onOpenDemo: () => void;
}

export const CaseStudies: React.FC<CaseStudiesProps> = ({ onOpenDemo }) => {
  const { eyebrow, title, subheadline, items } = caseStudiesContent;
  const [mobileIndex, setMobileIndex] = useState(0);

  const prevSlide = () => {
    setMobileIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const nextSlide = () => {
    setMobileIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-title"
      className="bg-[var(--bg-section-alt)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-4">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="case-studies-title" className="font-h2 text-[var(--text-heading)]">
              {title}
            </h2>
            <p className="font-body text-[var(--text-body)]">
              {subheadline}
            </p>
          </div>

          {/* Carousel Navigation Buttons for < 1024 */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous case study"
              className="p-2 min-h-[44px] min-w-[44px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:bg-[var(--bg-section-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer inline-flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <span className="text-[13px] font-mono text-[var(--text-muted)] px-2">
              {mobileIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next case study"
              className="p-2 min-h-[44px] min-w-[44px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-heading)] hover:bg-[var(--bg-section-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer inline-flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Desktop 4-up or 2x2 Grid / Mobile carousel view */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {items.map((study) => (
            <div
              key={study.slug}
              className="group bg-[var(--bg-card)] p-7 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] hover:border-[var(--color-brand-500)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-[var(--dur-base)] flex flex-col justify-between"
            >
              <div>
                <span className="font-eyebrow text-[var(--color-brand-600)] block mb-1">
                  {study.industry}
                </span>
                <h3 className="font-h3 text-[var(--text-heading)] mb-6">
                  {study.customer}
                </h3>

                {/* 2 Stats with font-stat */}
                <div className="space-y-4 mb-6">
                  {study.stats.map((stat, i) => (
                    <div key={i} className="border-t border-[var(--border-subtle)] pt-3">
                      <div className="text-[32px] font-bold text-[var(--text-heading)] font-stat leading-none">
                        {stat.value}
                      </div>
                      <div className="text-[12px] text-[var(--text-muted)] mt-1 line-clamp-2">
                        {stat.caption}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="font-body-sm text-[var(--text-body)] mb-6 line-clamp-3">
                  {study.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[12px] font-mono text-[var(--text-muted)]">
                  {study.timeframe}
                </span>
                <button
                  onClick={onOpenDemo}
                  type="button"
                  className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand-600)] group-hover:underline cursor-pointer"
                >
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Single Active Card */}
        <div className="lg:hidden">
          {(() => {
            const study = items[mobileIndex];
            return (
              <div
                key={study.slug}
                className="bg-[var(--bg-card)] p-6 sm:p-7 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)] flex flex-col justify-between"
              >
                <div>
                  <span className="font-eyebrow text-[var(--color-brand-600)] block mb-1">
                    {study.industry}
                  </span>
                  <h3 className="font-h3 text-[var(--text-heading)] mb-6">
                    {study.customer}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {study.stats.map((stat, i) => (
                      <div key={i} className="border-t border-[var(--border-subtle)] pt-3">
                        <div className="text-[28px] font-bold text-[var(--text-heading)] font-stat leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[12px] text-[var(--text-muted)] mt-1">
                          {stat.caption}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="font-body-sm text-[var(--text-body)] mb-6">
                    {study.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[var(--text-muted)]">
                    {study.timeframe}
                  </span>
                  <button
                    onClick={onOpenDemo}
                    type="button"
                    className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-brand-600)] cursor-pointer"
                  >
                    <span>Read more</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </Container>
    </section>
  );
};

