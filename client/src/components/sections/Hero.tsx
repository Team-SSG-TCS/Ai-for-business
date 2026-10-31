import React from 'react';
import { heroContent } from '../../content/hero';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { TrendingUp, CheckCircle, ArrowUpRight, ShieldCheck, Activity, Star } from 'lucide-react';

interface HeroProps {
  onOpenDemo: () => void;
  onOpenPlatform?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDemo, onOpenPlatform }) => {
  const { eyebrow, titleRegular, titleBold, supportingCopy, primaryCta, secondaryCta, socialProof, dashboardPreview } = heroContent;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative bg-[var(--bg-page)] ambient-green-glow pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 border-b border-[var(--border-subtle)] overflow-hidden"
    >
      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>

          {/* Single H1 matching Image 2 */}
          <h1
            id="hero-title"
            className="font-display text-white max-w-3xl mx-auto leading-tight"
          >
            {titleRegular}
            <span className="text-[var(--color-brand-600)] font-extrabold">
              {titleBold}
            </span>
          </h1>

          {/* Subheading matching Image 2 */}
          <p className="font-body-lg text-[var(--text-body)] max-w-2xl mx-auto leading-relaxed">
            {supportingCopy}
          </p>

          {/* Action Buttons matching Image 2 (Watch product tour + REQUEST A DEMO) */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="ghost-play"
              size="lg"
              asAnchor
              href={secondaryCta.href}
              className="w-full sm:w-auto"
            >
              {secondaryCta.label}
            </Button>
            <Button
              variant="primary"
              size="lg"
              uppercase
              onClick={onOpenDemo}
              className="w-full sm:w-auto shadow-[0_0_25px_rgba(0,208,108,0.4)]"
            >
              {primaryCta.label}
            </Button>
            {onOpenPlatform && (
              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenPlatform}
                className="w-full sm:w-auto border-[var(--color-brand-600)]/70 text-[var(--color-brand-400)] hover:bg-[var(--color-brand-50)] hover:text-white"
              >
                Launch Live App →
              </Button>
            )}
          </div>

          {/* Social Proof Review Row (Matching Image 2: Capterra 5.0, G2 4.9, Crozdesk 4.9) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[13px] text-[var(--text-muted)]">
            <span className="text-[var(--text-body)] font-medium">
              {socialProof.leadText}
            </span>
            <div className="h-4 w-px bg-[var(--border-strong)] hidden sm:block" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-4 text-white font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400 font-normal">Capterra</span>
                <span className="text-white">5.0</span>
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating)] text-[var(--color-rating)]" />
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400 font-normal">G2</span>
                <span className="text-white">4.9</span>
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating)] text-[var(--color-rating)]" />
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-400 font-normal">crozdesk</span>
                <span className="text-white">4.9</span>
                <Star className="w-3.5 h-3.5 fill-[var(--color-rating)] text-[var(--color-rating)]" />
              </span>
            </div>
          </div>
        </div>

        {/* Hero Product UI Visual (Matching Image 2 with dark card & green controls) */}
        <div className="mt-12 lg:mt-16 relative">
          <div className="screenshot-backdrop p-3 sm:p-6 lg:p-8 rounded-[var(--radius-lg)] border border-[var(--border-strong)] shadow-[var(--shadow-md)]">
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] border border-[var(--border-strong)] shadow-[var(--shadow-md)] overflow-hidden">
              {/* Dashboard Header Bar */}
              <div className="px-5 py-3.5 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 bg-[#0B0F0D]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50" />
                    <span className="w-3 h-3 rounded-full bg-white/20" />
                    <span className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <span className="text-[12px] font-mono text-[var(--text-muted)]">
                    {dashboardPreview.activeCategory}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border border-[var(--color-brand-500)]/30">
                    <Activity className="w-3.5 h-3.5 animate-pulse" aria-hidden="true" />
                    <span>Real-time Active Engine</span>
                  </span>
                </div>
              </div>

              {/* Dashboard Content with Competera Style Controls */}
              <div className="p-5 sm:p-7 space-y-6">
                {/* Competera Style Mode Selectors (Automated pricing workflow / Pricing optimisation) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-[var(--radius-sm)] bg-[#0E1A14] border border-[var(--color-brand-600)] text-center cursor-pointer shadow-[0_0_15px_rgba(0,208,108,0.15)]">
                    <div className="flex items-center justify-center gap-2 text-[var(--color-brand-600)] font-bold text-[13px]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-600)]" />
                      <span>Automated pricing workflow</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-[var(--radius-sm)] bg-[#0C100E] border border-[var(--border-subtle)] text-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-2 font-medium text-[13px]">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                      <span>Pricing optimisation</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-[var(--radius-sm)] bg-[#0C100E] border border-[var(--border-subtle)] text-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-2 font-medium text-[13px]">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                      <span>Price intelligence</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-[var(--radius-sm)] bg-[#0C100E] border border-[var(--border-subtle)] text-center text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-2 font-medium text-[13px]">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                      <span>Omnichannel price sync</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-[var(--radius-sm)] bg-[#0B0F0D] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">Audited Margin Lift</span>
                      <TrendingUp className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                    </div>
                    <div className="text-[28px] font-bold text-[var(--color-brand-600)] mt-1 font-stat">
                      {dashboardPreview.grossMarginGain}
                    </div>
                    <span className="text-[11px] text-[var(--color-brand-600)] font-semibold flex items-center gap-1 mt-0.5">
                      <ArrowUpRight className="w-3 h-3" /> +140 bps vs prior qtr
                    </span>
                  </div>

                  <div className="p-4 rounded-[var(--radius-sm)] bg-[#0B0F0D] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">Active Optimized SKUs</span>
                      <CheckCircle className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                    </div>
                    <div className="text-[28px] font-bold text-white mt-1 font-stat">
                      {dashboardPreview.optimizedSkus}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                      100% catalog coverage
                    </span>
                  </div>

                  <div className="p-4 rounded-[var(--radius-sm)] bg-[#0B0F0D] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">Forecast Accuracy</span>
                      <ShieldCheck className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                    </div>
                    <div className="text-[28px] font-bold text-white mt-1 font-stat">
                      {dashboardPreview.forecastAccuracy}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                      Across 450 store nodes
                    </span>
                  </div>

                  <div className="p-4 rounded-[var(--radius-sm)] bg-[#0B0F0D] border border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">Model Confidence</span>
                      <Activity className="w-4 h-4 text-[var(--color-brand-600)]" aria-hidden="true" />
                    </div>
                    <div className="text-[28px] font-bold text-white mt-1 font-stat">
                      {dashboardPreview.confidenceScore}
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                      Auto-validated constraints
                    </span>
                  </div>
                </div>

                {/* Live Recommendation Table Preview */}
                <div className="border border-[var(--border-subtle)] rounded-[var(--radius-sm)] overflow-hidden">
                  <div className="bg-[#0B0F0D] px-4 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-white">
                      Recent Automated Pricing Recommendations
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Updated 2 mins ago
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#08090A] border-b border-[var(--border-subtle)] text-[var(--text-muted)] font-medium">
                        <tr>
                          <th className="py-2.5 px-4">SKU / Item Description</th>
                          <th className="py-2.5 px-4">Current Price</th>
                          <th className="py-2.5 px-4">AI Recommended</th>
                          <th className="py-2.5 px-4">Elasticity</th>
                          <th className="py-2.5 px-4">Estimated Gain</th>
                          <th className="py-2.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-body)] font-normal">
                        <tr>
                          <td className="py-3 px-4 font-medium text-white">UltraWide 4K Gaming Monitor 34"</td>
                          <td className="py-3 px-4 font-mono">$649.00</td>
                          <td className="py-3 px-4 font-mono font-bold text-[var(--color-brand-600)]">$679.00</td>
                          <td className="py-3 px-4">-0.64 (Inelastic)</td>
                          <td className="py-3 px-4 text-[var(--color-brand-600)] font-semibold">+$42.5K / mo</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border border-[var(--color-brand-500)]/30">
                              Approved
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-white">Wireless Ergonomic Keyboard V2</td>
                          <td className="py-3 px-4 font-mono">$119.00</td>
                          <td className="py-3 px-4 font-mono font-bold text-[var(--color-brand-600)]">$114.00</td>
                          <td className="py-3 px-4">-1.72 (Elastic)</td>
                          <td className="py-3 px-4 text-[var(--color-brand-600)] font-semibold">+22% Units</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border border-[var(--color-brand-500)]/30">
                              Auto-Synced
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium text-white">Organic Cold Pressed Juice 1L</td>
                          <td className="py-3 px-4 font-mono">$4.99</td>
                          <td className="py-3 px-4 font-mono font-bold text-[var(--color-brand-600)]">$5.29</td>
                          <td className="py-3 px-4">-0.38 (Inelastic)</td>
                          <td className="py-3 px-4 text-[var(--color-brand-600)] font-semibold">+$18.2K / mo</td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-[var(--color-brand-50)] text-[var(--color-brand-600)] border border-[var(--color-brand-500)]/30">
                              Approved
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
