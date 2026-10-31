import React, { useState, useEffect, useRef } from 'react';
import { navContent, type NavGroup } from '../../content/nav';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Cpu,
  TrendingUp,
  Radar,
  Percent,
  ShoppingCart,
  Smartphone,
  Shirt,
  HeartPulse,
  FileText,
  BarChart3,
  Shield,
  Code2,
  Building2,
  FlaskConical,
  Users,
  Briefcase,
  Terminal,
} from 'lucide-react';

interface HeaderProps {
  onOpenDemo: () => void;
  onTogglePlayground?: () => void;
  isPlaygroundOpen?: boolean;
}

// Icon mapper for dynamic nav item icons
const renderNavIcon = (name: string) => {
  const iconProps = { className: "w-5 h-5 text-[var(--color-brand-600)]" };
  switch (name) {
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'TrendingUp': return <TrendingUp {...iconProps} />;
    case 'Radar': return <Radar {...iconProps} />;
    case 'Percent': return <Percent {...iconProps} />;
    case 'ShoppingCart': return <ShoppingCart {...iconProps} />;
    case 'Smartphone': return <Smartphone {...iconProps} />;
    case 'Shirt': return <Shirt {...iconProps} />;
    case 'HeartPulse': return <HeartPulse {...iconProps} />;
    case 'FileText': return <FileText {...iconProps} />;
    case 'BarChart3': return <BarChart3 {...iconProps} />;
    case 'Shield': return <Shield {...iconProps} />;
    case 'Code2': return <Code2 {...iconProps} />;
    case 'Building2': return <Building2 {...iconProps} />;
    case 'FlaskConical': return <FlaskConical {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'Briefcase': return <Briefcase {...iconProps} />;
    default: return <Cpu {...iconProps} />;
  }
};

export const Header: React.FC<HeaderProps> = ({
  onOpenDemo,
  onTogglePlayground,
  isPlaygroundOpen = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(null);
  const menuTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle escape to close mega menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (key: string) => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = window.setTimeout(() => {
      setActiveMenu(key);
    }, 120); // 120ms intent delay
  };

  const handleMouseLeave = () => {
    if (menuTimerRef.current) clearTimeout(menuTimerRef.current);
    menuTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const navGroups: Record<string, NavGroup> = navContent.links;

  return (
    <>
      {/* Skip to Content for WCAG 2.2 */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] ${
          isScrolled
            ? 'bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-[var(--shadow-xs)]'
            : 'bg-[var(--bg-page)] border-b border-transparent'
        }`}
      >
        <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Brand Logo (Matching Competera Logo Mark) */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              aria-label="Competera AI Home"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded-[var(--radius-sm)] p-1 cursor-pointer"
            >
              <svg className="w-7 h-7 text-[var(--color-brand-600)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c4.89 0 8.93-3.5 9.83-8.14h-4.09c-.82 2.46-3.09 4.24-5.74 4.24-3.37 0-6.1-2.73-6.1-6.1s2.73-6.1 6.1-6.1c2.65 0 4.92 1.78 5.74 4.24h4.09C20.93 5.5 16.89 2 12 2z" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-[var(--text-heading)] lowercase leading-none">
                competera
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1">
              {Object.entries(navGroups).map(([key, group]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(key)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    aria-expanded={activeMenu === key}
                    onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                    className={`h-10 px-3.5 inline-flex items-center gap-1.5 text-[15px] font-medium rounded-[var(--radius-sm)] transition-colors duration-[var(--dur-fast)] cursor-pointer ${
                      activeMenu === key
                        ? 'text-[var(--color-brand-600)] bg-[var(--color-brand-50)]'
                        : 'text-[var(--text-body)] hover:text-[var(--text-heading)] hover:bg-[var(--bg-section-alt)]'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-[var(--dur-fast)] ${
                        activeMenu === key ? 'rotate-180 text-[var(--color-brand-600)]' : 'text-[var(--text-muted)]'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Mega Menu Panel */}
                  {activeMenu === key && (
                    <div
                      role="region"
                      aria-label={`${group.label} Submenu`}
                      className="absolute top-full left-0 mt-2 w-[720px] bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-[var(--dur-base)]"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                        <span className="font-eyebrow text-[var(--color-brand-600)]">
                          {group.label} Overview
                        </span>
                        <a
                          href={group.items[0]?.href || '#'}
                          onClick={() => setActiveMenu(null)}
                          className="text-[13px] font-semibold text-[var(--color-brand-600)] hover:underline inline-flex items-center gap-1"
                        >
                          <span>Explore all</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {group.items.map((item) => (
                          <a
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className="group p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-brand-50)] transition-colors duration-[var(--dur-fast)] flex items-start gap-3.5 cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--bg-section-alt)] flex items-center justify-center shrink-0 group-hover:bg-white border border-[var(--border-subtle)] transition-colors">
                              {renderNavIcon(item.iconName)}
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-[var(--text-heading)] group-hover:text-[var(--color-brand-600)] transition-colors flex items-center gap-1">
                                <span>{item.title}</span>
                                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[var(--dur-fast)]" aria-hidden="true" />
                              </div>
                              <p className="text-[12px] text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>

                      {group.promo && (
                        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-section-alt)] -mx-6 -mb-6 p-4 rounded-b-[var(--radius-lg)]">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[var(--color-brand-600)] text-white rounded">
                              Spotlight
                            </span>
                            <span className="text-[13px] font-medium text-[var(--text-heading)]">
                              {group.promo.title}: <span className="text-[var(--text-muted)]">{group.promo.description}</span>
                            </span>
                          </div>
                          <a
                            href={group.promo.href}
                            onClick={() => setActiveMenu(null)}
                            className="text-[13px] font-semibold text-[var(--color-brand-600)] hover:underline inline-flex items-center gap-1 shrink-0 ml-4"
                          >
                            <span>{group.promo.cta}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Developer Hub Playground Toggle (for Hackathon Evaluation) */}
            {onTogglePlayground && (
              <button
                type="button"
                onClick={onTogglePlayground}
                className={`hidden md:inline-flex items-center gap-2 h-10 px-3.5 text-[13px] font-semibold rounded-[var(--radius-sm)] border transition-all cursor-pointer ${
                  isPlaygroundOpen
                    ? 'bg-purple-950/60 border-purple-500 text-purple-300 shadow-sm'
                    : 'bg-indigo-950/40 border-indigo-900/50 text-indigo-300 hover:bg-indigo-900/40 hover:text-white'
                }`}
                title="Open live backend & AI microservice diagnostics"
              >
                <Terminal className="w-4 h-4 text-purple-400" aria-hidden="true" />
                <span>{isPlaygroundOpen ? 'Close Dev Hub' : 'Live Dev Hub'}</span>
              </button>
            )}

            {/* Competera Style Navigation Items: About Us + Pricing + Market Test CTA */}
            <a
              href="#closing-cta"
              className="hidden xl:inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--text-body)] hover:text-white px-2 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-600)] animate-pulse" />
              <span>About us</span>
            </a>

            <a
              href="#value-props"
              className="hidden sm:inline-block text-[14px] font-medium text-white border border-white/20 hover:border-white/50 rounded-[var(--radius-sm)] px-3.5 py-1.5 transition-colors cursor-pointer"
            >
              Pricing
            </a>

            <ThemeToggle />

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenDemo}
              className="hidden sm:inline-flex font-bold"
            >
              Market test
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[var(--text-heading)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Section 9.2) */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 z-50 bg-[var(--bg-page)] overflow-y-auto flex flex-col p-6 animate-in slide-in-from-right duration-[var(--dur-base)]"
        >
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-600)] flex items-center justify-center text-white">
                <span className="font-bold text-lg">C</span>
              </div>
              <span className="text-lg font-bold text-[var(--text-heading)]">Competera</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-heading)] border border-[var(--border-subtle)]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav className="flex-1 py-6 space-y-4">
            {Object.entries(navGroups).map(([key, group]) => {
              const isOpen = openMobileAccordion === key;
              return (
                <div key={key} className="border-b border-[var(--border-subtle)] pb-4">
                  <button
                    type="button"
                    onClick={() => setOpenMobileAccordion(isOpen ? null : key)}
                    className="w-full min-h-[44px] flex items-center justify-between text-left text-[16px] font-semibold text-[var(--text-heading)] py-2"
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-[var(--dur-fast)] ${
                        isOpen ? 'rotate-180 text-[var(--color-brand-600)]' : 'text-[var(--text-muted)]'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-2 pl-2 space-y-2.5">
                      {group.items.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-start gap-3 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--bg-section-alt)]"
                        >
                          <div className="mt-0.5">{renderNavIcon(item.iconName)}</div>
                          <div>
                            <span className="block text-[14px] font-medium text-[var(--text-heading)]">
                              {item.title}
                            </span>
                            <span className="block text-[12px] text-[var(--text-muted)]">
                              {item.description}
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {onTogglePlayground && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onTogglePlayground();
                }}
                className="w-full flex items-center justify-between p-3 rounded-[var(--radius-sm)] bg-indigo-950/30 border border-indigo-900/40 text-indigo-300 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Developer Diagnostics Hub</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </nav>

          <div className="pt-6 border-t border-[var(--border-subtle)] space-y-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
            >
              {navContent.actions.demoButtonText}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
