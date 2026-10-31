import React from 'react';
import { awardsContent } from '../../content/awards';
import { Container } from '../ui/Container';
import { ArrowRight, Award } from 'lucide-react';

export const AwardsStrip: React.FC = () => {
  const { items } = awardsContent;

  return (
    <section
      id="awards"
      aria-labelledby="awards-strip-title"
      className="bg-[var(--bg-page)] py-8 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <h2 id="awards-strip-title" className="sr-only">
          Industry Recognitions and Analyst Accreditations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#1C2420]">
          {items.map((item, index) => (
            <a
              key={item.title}
              href={item.href}
              className={`group p-4 flex flex-col justify-between transition-colors duration-[var(--dur-fast)] hover:bg-[#0D1210] rounded-[var(--radius-sm)] ${
                index > 0 ? 'sm:pl-6' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                <span className="font-eyebrow text-gray-400 group-hover:text-[var(--color-brand-600)] transition-colors">
                  {item.eyebrow}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-bold text-white leading-snug">
                  {item.title}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[var(--color-brand-600)] group-hover:translate-x-1 transition-all shrink-0" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};
