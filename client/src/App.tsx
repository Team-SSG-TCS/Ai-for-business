import React, { useState } from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { FeatureTabs } from './components/sections/FeatureTabs';
import { ValueProps } from './components/sections/ValueProps';
import { LogoMarquee } from './components/sections/LogoMarquee';
import { AwardsStrip } from './components/sections/AwardsStrip';
import { SplitFeature } from './components/sections/SplitFeature';
import { FeatureGrid } from './components/sections/FeatureGrid';
import { CaseStudies } from './components/sections/CaseStudies';
import { ProcessStepper } from './components/sections/ProcessStepper';
import { SecurityBand } from './components/sections/SecurityBand';
import { IndustryGrid } from './components/sections/IndustryGrid';
import { NewsGrid } from './components/sections/NewsGrid';
import { ClosingCTA } from './components/sections/ClosingCTA';
import { BadgeRow } from './components/sections/BadgeRow';
import { Footer } from './components/layout/Footer';
import { DemoModal } from './components/ui/DemoModal';

// Developer Playground components for Hackathon Architecture testing
import { ServiceStatus } from './components/dashboard/ServiceStatus';
import { AiTester } from './components/dashboard/AiTester';
import { DbTester } from './components/dashboard/DbTester';
import { TeamGuide } from './components/dashboard/TeamGuide';
import { Terminal, X } from 'lucide-react';

export const App: React.FC = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] selection:bg-[var(--color-brand-500)] selection:text-white">
      {/* 1. Announcement bar */}
      <AnnouncementBar />

      {/* 2. Sticky header + mega-menu */}
      <Header
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onTogglePlayground={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
        isPlaygroundOpen={isPlaygroundOpen}
      />

      {/* Collapsible Live Architecture Diagnostics Bar (for Hackathon Judges & Devs) */}
      {isPlaygroundOpen && (
        <aside
          aria-label="Developer Architecture Diagnostics"
          className="bg-[#0b0f19] text-gray-100 border-b border-indigo-900/50 py-8 px-4 sm:px-6 lg:px-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Developer Architecture Hub & Live Diagnostics</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Hackathon Mode
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400">
                    Live end-to-end verification of Supabase PostgreSQL, Node Express backend, and Python FastAPI AI microservice.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaygroundOpen(false)}
                className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
                aria-label="Close Developer Diagnostics"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Service Status */}
            <ServiceStatus />

            {/* Test Playgrounds */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DbTester />
              <AiTester />
            </div>

            {/* Team Hackathon Setup Guide */}
            <TeamGuide />
          </div>
        </aside>
      )}

      {/* Main Content Landmark (WCAG 2.2) */}
      <main id="main-content" className="flex-1">
        {/* 3. Hero */}
        <Hero onOpenDemo={() => setIsDemoModalOpen(true)} />

        {/* 4. Feature tabs + product screenshot */}
        <FeatureTabs />

        {/* 5. Value-prop block with 3 stat chips */}
        <ValueProps />

        {/* 6. Customer logo marquee */}
        <LogoMarquee />

        {/* 7. Awards strip */}
        <AwardsStrip />

        {/* 8. Split section (text + product image) */}
        <SplitFeature onOpenDemo={() => setIsDemoModalOpen(true)} />

        {/* 9. Feature grid (5 items) */}
        <FeatureGrid />

        {/* 10. Case-study carousel (4 cards) */}
        <CaseStudies onOpenDemo={() => setIsDemoModalOpen(true)} />

        {/* 11. Numbered process stepper (01-05) */}
        <ProcessStepper />

        {/* 12. Security band */}
        <SecurityBand />

        {/* 13. Industries grid (8 tiles) */}
        <IndustryGrid />

        {/* 14. News / articles (3 cards) */}
        <NewsGrid />

        {/* 15. Closing CTA + wide banner */}
        <ClosingCTA onOpenDemo={() => setIsDemoModalOpen(true)} />

        {/* 16. Recognition badges row */}
        <BadgeRow />
      </main>

      {/* 17. Footer */}
      <Footer />

      {/* Accessible Demo Request Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
};

export default App;
