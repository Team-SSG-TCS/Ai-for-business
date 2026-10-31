import React, { useState } from 'react';
import { navContent } from '../../content/nav';
import { ArrowRight, Zap, X } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { announcement } = navContent;
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="w-full min-h-[40px] py-1.5 px-4 bg-[#0A120E] text-[var(--text-body)] text-[13px] sm:text-[14px] flex items-center justify-between border-b border-[var(--border-subtle)] transition-colors duration-[var(--dur-base)]"
    >
      <div className="flex-1 flex flex-wrap items-center justify-center gap-1.5 max-w-7xl mx-auto">
        <span className="flex items-center gap-1.5 font-bold text-[var(--color-brand-600)]">
          <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>{announcement.lead}</span>
        </span>
        <span className="text-[var(--text-body)]">{announcement.text}</span>
        <a
          href={announcement.href}
          className="inline-flex items-center gap-1 font-semibold text-[var(--color-brand-600)] hover:underline ml-1 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        type="button"
        aria-label="Dismiss banner"
        className="p-1 text-gray-500 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
