import React from 'react';
import { newsContent } from '../../content/news';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { Calendar, Clock } from 'lucide-react';

export const NewsGrid: React.FC = () => {
  const { eyebrow, title, subheadline, articles } = newsContent;

  return (
    <section
      id="news"
      aria-labelledby="news-grid-title"
      className="bg-[var(--bg-section-alt)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="news-grid-title" className="font-h2 text-[var(--text-heading)]">
            {title}
          </h2>
          <p className="font-body text-[var(--text-body)]">
            {subheadline}
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <a
              key={article.title}
              href={article.href}
              className="group bg-[var(--bg-card)] p-6 sm:p-7 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] hover:border-[var(--color-brand-500)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-md)] transition-all duration-[var(--dur-fast)] flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-eyebrow text-[var(--color-brand-600)]">
                    {article.typeLabel}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-section-alt)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {article.tag}
                  </span>
                </div>

                <h3 className="font-h3 text-[var(--text-heading)] group-hover:underline underline-offset-4 decoration-[var(--color-brand-600)] mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="font-body-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{article.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{article.readTime}</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
};
