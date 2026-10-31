import React, { useState, useRef } from 'react';
import { featureTabsContent } from '../../content/tabs';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { CheckCircle2, TrendingUp, Layers } from 'lucide-react';

export const FeatureTabs: React.FC = () => {
  const { eyebrow, title, subheadline, tabs } = featureTabsContent;
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActiveTabId(tabs[nextIndex].id);
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <section
      id="feature-tabs"
      aria-labelledby="features-tabs-title"
      className="bg-[var(--bg-section-alt)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-14">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="features-tabs-title" className="font-h2 text-[var(--text-heading)]">
            {title}
          </h2>
          <p className="font-body text-[var(--text-body)]">
            {subheadline}
          </p>
        </div>

        {/* Tab Buttons (role="tablist") */}
        <div className="border-b border-[var(--border-strong)] mb-8 sm:mb-12">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Platform feature capabilities"
            className="flex items-center justify-start sm:justify-center gap-2 sm:gap-8 overflow-x-auto pb-1 no-scrollbar"
          >
            {tabs.map((tab, idx) => {
              const isActive = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTabId(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`relative pb-4 px-2 min-h-[44px] text-[15px] font-semibold whitespace-nowrap transition-colors duration-[var(--dur-fast)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-t-[var(--radius-sm)] ${
                    isActive
                      ? 'text-[var(--color-brand-600)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-600)] transition-all duration-[var(--dur-base)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panel */}
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={`tab-${activeTab.id}`}
          className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] shadow-[var(--shadow-md)] overflow-hidden transition-opacity duration-[var(--dur-slow)]"
        >
          {/* Panel Header & Summary */}
          <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{activeTab.highlightChip}</span>
                </span>
                <h3 className="font-h3 text-[var(--text-heading)]">
                  {activeTab.title}
                </h3>
                <p className="font-body-sm text-[var(--text-body)]">
                  {activeTab.description}
                </p>
              </div>

              {/* Metric Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
                {activeTab.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-section-alt)] border border-[var(--border-subtle)] text-center min-w-[140px]"
                  >
                    <div className="text-[20px] font-bold text-[var(--color-brand-600)] font-stat">
                      {metric.value}
                    </div>
                    <div className="text-[12px] font-semibold text-[var(--text-heading)] mt-0.5">
                      {metric.label}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Interactive UI Display */}
          <div className="p-6 sm:p-8 bg-[var(--bg-section-alt)]">
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] border border-[var(--border-strong)] shadow-[var(--shadow-xs)] overflow-hidden">
              <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)]">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                  <span className="text-[13px] font-semibold text-[var(--text-heading)]">
                    {activeTab.uiView.chartTitle}
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--color-brand-50)] text-[var(--color-brand-600)] font-semibold">
                  {activeTab.uiView.badge}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[var(--bg-section-alt)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-medium">
                    <tr>
                      {activeTab.uiView.tableColumns.map((col) => (
                        <th key={col} className="py-2.5 px-4 font-semibold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)]">
                    {activeTab.uiView.sampleRows.map((row, i) => (
                      <tr key={i} className="hover:bg-[var(--bg-section-alt)] transition-colors">
                        <td className="py-3 px-4 font-mono font-medium text-[var(--text-heading)]">{row.sku}</td>
                        <td className="py-3 px-4">{row.category}</td>
                        <td className="py-3 px-4 font-mono">{row.currentPrice}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-[var(--color-brand-600)]">{row.recommendedPrice}</td>
                        <td className="py-3 px-4">{row.elasticity}</td>
                        <td className="py-3 px-4 font-semibold text-[var(--color-success-600)] flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{row.impact}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
