import React from 'react';
import { marqueeContent } from '../../content/marquee';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';

export const LogoMarquee: React.FC = () => {
  const { eyebrow, logos } = marqueeContent;

  return (
    <section
      aria-labelledby="marquee-title"
      className="bg-[var(--bg-page)] py-12 sm:py-16 border-b border-[var(--border-subtle)] overflow-hidden"
    >
      <Container>
        <div className="text-center mb-8">
          <Eyebrow id="marquee-title" as="p">
            {eyebrow}
          </Eyebrow>
        </div>

        {/* Marquee Track with edge fade masks */}
        <div className="relative w-full mask-edge-fade">
          <div className="animate-marquee flex items-center gap-8 py-2">
            {/* First Set of Logos (Crisp white monochrome on dark) */}
            {logos.map((logo, idx) => (
              <a
                key={`logo-1-${idx}`}
                href={logo.href}
                aria-label={`${logo.name} case study`}
                className="group shrink-0 px-6 py-3.5 rounded-[var(--radius-sm)] border border-[#1C2420] bg-[#0E1210] flex items-center gap-3 transition-all duration-[var(--dur-fast)] hover:border-[var(--color-brand-600)] hover:shadow-[0_0_15px_rgba(0,208,108,0.15)]"
              >
                <div className="w-8 h-8 rounded-full bg-[#141C17] flex items-center justify-center font-bold text-[var(--color-brand-600)] text-[13px] border border-[#1E2E24]">
                  {logo.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white group-hover:text-[var(--color-brand-600)] transition-colors whitespace-nowrap tracking-wide">
                    {logo.name}
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span>{logo.category}</span>
                    <span className="font-semibold text-[var(--color-brand-600)]">{logo.metric}</span>
                  </div>
                </div>
              </a>
            ))}

            {/* Duplicated Track (aria-hidden) for seamless loop */}
            {logos.map((logo, idx) => (
              <a
                key={`logo-2-${idx}`}
                href={logo.href}
                aria-hidden="true"
                tabIndex={-1}
                className="group shrink-0 px-6 py-3.5 rounded-[var(--radius-sm)] border border-[#1C2420] bg-[#0E1210] flex items-center gap-3 transition-all duration-[var(--dur-fast)] hover:border-[var(--color-brand-600)] hover:shadow-[0_0_15px_rgba(0,208,108,0.15)]"
              >
                <div className="w-8 h-8 rounded-full bg-[#141C17] flex items-center justify-center font-bold text-[var(--color-brand-600)] text-[13px] border border-[#1E2E24]">
                  {logo.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white group-hover:text-[var(--color-brand-600)] transition-colors whitespace-nowrap tracking-wide">
                    {logo.name}
                  </div>
                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span>{logo.category}</span>
                    <span className="font-semibold text-[var(--color-brand-600)]">{logo.metric}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
