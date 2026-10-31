import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Hero } from '../components/sections/Hero';
import { FeatureTabs } from '../components/sections/FeatureTabs';
import { ValueProps } from '../components/sections/ValueProps';
import { LogoMarquee } from '../components/sections/LogoMarquee';
import { AwardsStrip } from '../components/sections/AwardsStrip';
import { SplitFeature } from '../components/sections/SplitFeature';
import { FeatureGrid } from '../components/sections/FeatureGrid';
import { CaseStudies } from '../components/sections/CaseStudies';
import { ProcessStepper } from '../components/sections/ProcessStepper';
import { SecurityBand } from '../components/sections/SecurityBand';
import { IndustryGrid } from '../components/sections/IndustryGrid';
import { NewsGrid } from '../components/sections/NewsGrid';
import { ClosingCTA } from '../components/sections/ClosingCTA';
import { BadgeRow } from '../components/sections/BadgeRow';
import { Footer } from '../components/layout/Footer';
import { DemoModal } from '../components/ui/DemoModal';

interface LandingPageProps {
  onOpenPlatform?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenPlatform }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-body)] flex flex-col font-sans selection:bg-[var(--color-brand-600)] selection:text-black">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Sticky Header + Mega-Menu */}
      <Header
        onOpenDemo={handleOpenDemo}
        onOpenPlatform={onOpenPlatform}
        onTogglePlayground={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
        isPlaygroundOpen={isPlaygroundOpen}
      />

      <main id="main-content" className="flex-1">
        {/* 3. Hero Section */}
        <Hero onOpenDemo={handleOpenDemo} onOpenPlatform={onOpenPlatform} />

        {/* 4. Feature Tabs + Product Screenshot */}
        <FeatureTabs />

        {/* 5. Value-Prop Block with 3 Stat Chips */}
        <ValueProps />

        {/* 6. Customer Logo Marquee */}
        <LogoMarquee />

        {/* 7. Awards Strip */}
        <AwardsStrip />

        {/* 8. Split Section (Text + Product Visual) */}
        <SplitFeature />

        {/* 9. Feature Grid (5 items) */}
        <FeatureGrid />

        {/* 10. Case-Study Carousel (4 cards) */}
        <CaseStudies />

        {/* 11. Numbered Process Stepper (01-05) */}
        <ProcessStepper />

        {/* 12. Security Band */}
        <SecurityBand />

        {/* 13. Industries Grid (8 tiles) */}
        <IndustryGrid />

        {/* 14. News / Articles (3 cards) */}
        <NewsGrid />

        {/* 15. Closing CTA + Wide Banner */}
        <ClosingCTA onOpenDemo={handleOpenDemo} />

        {/* 16. Recognition Badges Row */}
        <BadgeRow />
      </main>

      {/* 17. Footer */}
      <Footer />

      {/* Demo Request Modal Dialog (Section 9.20) */}
      <DemoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </div>
  );
};

export default LandingPage;
