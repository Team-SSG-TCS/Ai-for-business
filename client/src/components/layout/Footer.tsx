import React, { useState } from 'react';
import { footerContent } from '../../content/footer';
import { Container } from '../ui/Container';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { brandDescription, columns, contact, newsletter, legal, social } = footerContent;
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const renderSocialIcon = (name: string) => {
    switch (name) {
      case 'LinkedIn':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        );
      case 'X (Twitter)':
        return (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'Facebook':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <footer
      aria-label="Footer"
      className="bg-[var(--color-surface-inverse)] text-gray-300 pt-16 sm:pt-20 pb-12 border-t border-gray-800"
    >
      <Container>
        {/* Top Newsletter & Brand Band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 sm:pb-16 border-b border-gray-800 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-600)] flex items-center justify-center text-white">
                <span className="font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Competera AI</span>
            </div>
            <p className="text-[14px] text-gray-400 max-w-sm leading-relaxed">
              {brandDescription}
            </p>
            <div className="pt-2 text-[13px] text-gray-400 space-y-1">
              <p>Email: <a href={`mailto:${contact.email}`} className="text-white hover:underline">{contact.email}</a></p>
              <p>Sales Hotline: <span className="text-white">{contact.salesPhone}</span></p>
              <p className="text-gray-500">{contact.headquarters}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[var(--radius-md)] p-6 sm:p-8">
            <h3 className="text-[16px] font-semibold text-white mb-1">
              {newsletter.heading}
            </h3>
            <p className="text-[13px] text-gray-400 mb-4">
              {newsletter.subheading}
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 text-[14px] font-semibold text-emerald-400 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you. You are enrolled in our empirical econometric dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="newsletter-email" className="sr-only">Enterprise email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  className="flex-1 h-12 px-4 rounded-[var(--radius-sm)] bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] text-[14px]"
                />
                <button
                  type="submit"
                  className="h-12 px-6 min-h-[44px] rounded-[var(--radius-sm)] bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-700)] text-white font-semibold text-[14px] transition-colors cursor-pointer shrink-0"
                >
                  {newsletter.buttonText}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 5 Column Navigation (Desktop 5-col, Mobile accordion) */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
            {columns.map((col) => {
              const isOpen = openAccordion === col.title;
              return (
                <div key={col.title} className="border-b md:border-b-0 border-gray-800 pb-4 md:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(col.title)}
                    className="w-full flex items-center justify-between text-left md:pointer-events-none py-2 md:py-0"
                  >
                    <span className="font-eyebrow text-white tracking-wider">
                      {col.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 md:hidden transition-transform duration-[var(--dur-fast)] ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <ul className={`mt-3 space-y-2.5 ${isOpen ? 'block' : 'hidden md:block'}`}>
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-[13px] text-gray-400 hover:text-white transition-colors duration-[var(--dur-fast)] inline-block min-h-[32px] py-1 cursor-pointer"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Legal & Social Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] text-gray-500">
          <div className="space-y-2 text-center md:text-left">
            <p>{legal.copyright}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-400">
              {legal.links.map((item) => (
                <a key={item.label} href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links (44px min hit targets) */}
          <div className="flex items-center gap-3">
            {social.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${s.name} page`}
                className="w-11 h-11 rounded-[var(--radius-sm)] border border-gray-800 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
              >
                {renderSocialIcon(s.name)}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};
