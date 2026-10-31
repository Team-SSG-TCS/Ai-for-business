import React from 'react';
import { badgesContent } from '../../content/badges';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';

export const BadgeRow: React.FC = () => {
  const { eyebrow, badges } = badgesContent;

  return (
    <section
      aria-labelledby="recognition-badges-title"
      className="bg-[var(--bg-page)] py-12 sm:py-16 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="text-center mb-10">
          <Eyebrow id="recognition-badges-title" as="p">
            {eyebrow}
          </Eyebrow>
        </div>

        {/* 6 Badges: equal height 64-80px, wrap 3x2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="h-20 p-3 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-card)] flex flex-col items-center justify-center text-center shadow-[var(--shadow-xs)] hover:border-[var(--color-brand-500)] transition-colors duration-[var(--dur-fast)]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-600)]">
                {badge.organization}
              </span>
              <span className="text-[12px] font-bold text-[var(--text-heading)] leading-tight mt-0.5">
                {badge.name}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">
                {badge.year}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
