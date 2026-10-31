import React from 'react';
import { industriesContent } from '../../content/industries';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import {
  Apple,
  Tv,
  Shirt,
  Pill,
  Hammer,
  Fuel,
  Store,
  Wrench,
  ArrowRight,
} from 'lucide-react';

const renderIndustryIcon = (name: string) => {
  const iconProps = { className: "w-7 h-7 text-[var(--color-brand-600)] transition-transform duration-[var(--dur-fast)] group-hover:scale-110" };
  switch (name) {
    case 'Apple': return <Apple {...iconProps} />;
    case 'Tv': return <Tv {...iconProps} />;
    case 'Shirt': return <Shirt {...iconProps} />;
    case 'Pill': return <Pill {...iconProps} />;
    case 'Hammer': return <Hammer {...iconProps} />;
    case 'Fuel': return <Fuel {...iconProps} />;
    case 'Store': return <Store {...iconProps} />;
    case 'Wrench': return <Wrench {...iconProps} />;
    default: return <Store {...iconProps} />;
  }
};

export const IndustryGrid: React.FC = () => {
  const { eyebrow, title, subheadline, industries } = industriesContent;

  return (
    <section
      id="industries"
      aria-labelledby="industries-title"
      className="bg-[var(--bg-page)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="industries-title" className="font-h2 text-[var(--text-heading)]">
            {title}
          </h2>
          <p className="font-body text-[var(--text-body)]">
            {subheadline}
          </p>
        </div>

        {/* 8 Tiles: 4x2 on lg, 2x4 on sm/md, 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind) => (
            <a
              key={ind.id}
              href={ind.href}
              className="group p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] hover:-translate-y-0.5 shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--dur-fast)] flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--bg-section-alt)] group-hover:bg-white border border-[var(--border-subtle)] flex items-center justify-center mb-5 transition-colors">
                  {renderIndustryIcon(ind.iconName)}
                </div>
                <h3 className="font-h3 text-[var(--text-heading)] group-hover:text-[var(--color-brand-600)] transition-colors mb-1.5">
                  {ind.title}
                </h3>
                <p className="font-body-sm text-[var(--text-muted)] line-clamp-2">
                  {ind.metric}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] group-hover:border-[var(--color-brand-200)] flex items-center justify-between text-[13px] font-semibold text-[var(--color-brand-600)]">
                <span>See more</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};

