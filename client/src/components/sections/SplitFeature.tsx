import React from 'react';
import { splitFeatureContent } from '../../content/splitFeature';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Check, ShieldCheck } from 'lucide-react';

interface SplitFeatureProps {
  onOpenDemo: () => void;
  reverse?: boolean;
}

export const SplitFeature: React.FC<SplitFeatureProps> = ({ onOpenDemo, reverse = false }) => {
  const { eyebrow, title, paragraph, bullets, cta, visual } = splitFeatureContent;

  return (
    <section
      id="split-feature"
      aria-labelledby="split-feature-title"
      className="bg-[var(--bg-section-alt)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Column (5 cols or 6 cols) */}
          <div className={`lg:col-span-6 space-y-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="split-feature-title" className="font-h2 text-[var(--text-heading)] leading-tight">
              {title}
            </h2>
            <p className="font-body text-[var(--text-body)] leading-relaxed">
              {paragraph}
            </p>

            {/* Bullets with Check Icons */}
            <div className="space-y-4 pt-2">
              {bullets.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--color-brand-100)]">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[var(--text-heading)]">
                      {b.title}
                    </h3>
                    <p className="text-[13px] text-[var(--text-muted)] mt-0.5 leading-normal">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button variant="primary" size="md" onClick={onOpenDemo}>
                {cta.label}
              </Button>
            </div>
          </div>

          {/* Media Column (6 cols) with gradient backdrop */}
          <div className={`lg:col-span-6 ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="screenshot-backdrop p-4 sm:p-6 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)]">
              <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] border border-[var(--border-strong)] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="font-eyebrow text-[var(--color-brand-600)] block">
                      {visual.badge}
                    </span>
                    <h4 className="font-h4 text-[var(--text-heading)]">
                      {visual.diagramTitle}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-[var(--text-muted)] block">{visual.metricLabel}</span>
                    <span className="text-[18px] font-bold text-[var(--color-brand-600)] font-stat">{visual.metricValue}</span>
                  </div>
                </div>

                {/* Simulated Pipeline Stages */}
                <div className="space-y-3">
                  {visual.stages.map((stage, idx) => (
                    <div
                      key={stage.name}
                      className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-section-alt)] border border-[var(--border-subtle)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] text-[11px] font-mono font-bold flex items-center justify-center text-[var(--text-heading)]">
                          {idx + 1}
                        </span>
                        <span className="text-[13px] font-medium text-[var(--text-heading)]">
                          {stage.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-mono text-[var(--text-muted)]">{stage.speed}</span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--color-success-50)] text-[var(--color-success-600)]">
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)] text-[12px] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Real-time POS Execution Engine</span>
                  </span>
                  <span className="font-semibold">{visual.secondaryMetricValue} Bounded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
