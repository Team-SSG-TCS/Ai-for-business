import React from 'react';
import { featuresContent } from '../../content/features';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { Zap, ShieldAlert, Layers, Database, UserCheck } from 'lucide-react';

const renderFeatureIcon = (name: string) => {
  const iconProps = { className: "w-8 h-8 text-[var(--color-brand-600)] transition-transform duration-[var(--dur-fast)] group-hover:scale-105" };
  switch (name) {
    case 'Zap': return <Zap {...iconProps} />;
    case 'ShieldAlert': return <ShieldAlert {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Database': return <Database {...iconProps} />;
    case 'UsersCheck': return <UserCheck {...iconProps} />;
    default: return <Zap {...iconProps} />;
  }
};

export const FeatureGrid: React.FC = () => {
  const { eyebrow, title, subheadline, items } = featuresContent;

  return (
    <section
      id="feature-grid"
      aria-labelledby="feature-grid-title"
      className="bg-[var(--bg-page)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="feature-grid-title" className="font-h2 text-[var(--text-heading)]">
            {title}
          </h2>
          <p className="font-body text-[var(--text-body)]">
            {subheadline}
          </p>
        </div>

        {/* 5-item Grid: 3 in first row, 2 centered in second row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {items.map((item, idx) => {
            // First 3 items take 2 cols each (3 items total)
            // Next 2 items take 3 cols each (centered pair) on large screens
            const colSpan = idx < 3 ? 'lg:col-span-2' : 'lg:col-span-3';

            return (
              <div
                key={item.title}
                className={`group p-6 sm:p-8 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-brand-500)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--dur-fast)] flex flex-col justify-between ${colSpan}`}
              >
                <div>
                  <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--bg-section-alt)] group-hover:bg-[var(--color-brand-50)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 transition-colors duration-[var(--dur-fast)]">
                    {renderFeatureIcon(item.iconName)}
                  </div>

                  <h3 className="font-h3 text-[var(--text-heading)] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-body-sm text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-[var(--color-brand-600)] uppercase tracking-wider">
                    Specification
                  </span>
                  <span className="text-[13px] font-mono font-medium text-[var(--text-heading)]">
                    {item.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

