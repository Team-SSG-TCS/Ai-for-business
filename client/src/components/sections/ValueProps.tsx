import React from 'react';
import { valuePropsContent } from '../../content/valueProps';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { LayoutGrid, GitFork, Clock } from 'lucide-react';

const renderChipIcon = (name: string) => {
  const iconProps = { className: "w-6 h-6 text-[var(--color-brand-600)]" };
  switch (name) {
    case 'Layers': return <LayoutGrid {...iconProps} />;
    case 'TrendingUp': return <GitFork {...iconProps} />;
    case 'Clock': return <Clock {...iconProps} />;
    default: return <LayoutGrid {...iconProps} />;
  }
};

export const ValueProps: React.FC = () => {
  const { eyebrow, title, subheadline, chips } = valuePropsContent;

  return (
    <section
      id="value-props"
      aria-labelledby="value-props-title"
      className="bg-[var(--bg-page)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="value-props-title" className="font-h2 text-white">
            {title}
          </h2>
          <p className="font-body text-gray-400">
            {subheadline}
          </p>
        </div>

        {/* 3-up Stat Chip Row Matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {chips.map((chip) => (
            <div
              key={chip.label}
              className="bg-[#0E1310] p-6 sm:p-8 rounded-[var(--radius-md)] border border-[#1C2420] hover:border-[var(--color-brand-600)] flex flex-col justify-between transition-all duration-[var(--dur-fast)] hover:-translate-y-1 shadow-[var(--shadow-xs)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[#121A15] border border-[#1E2E24] flex items-center justify-center">
                  {renderChipIcon(chip.iconName)}
                </div>
                <span className="text-[11px] font-bold text-[var(--color-brand-600)] uppercase tracking-wider px-2 py-0.5 rounded bg-[#0D2619] border border-[var(--color-brand-600)]/20">
                  Feature
                </span>
              </div>

              <div>
                <div className="text-[44px] lg:text-[52px] font-bold text-[var(--color-brand-600)] font-stat leading-none tracking-tight">
                  {chip.stat}
                </div>
                <h3 className="font-h3 text-white mt-3">
                  {chip.label}
                </h3>
                <p className="font-caption text-gray-400 mt-2 leading-relaxed">
                  {chip.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
