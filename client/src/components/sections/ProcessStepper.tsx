import React, { useState } from 'react';
import { processStepperContent } from '../../content/steps';
import { Container } from '../ui/Container';
import { Eyebrow } from '../ui/Eyebrow';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const ProcessStepper: React.FC = () => {
  const { eyebrow, titleRegular, titleGreen, subheadline, actionButtonText, steps } = processStepperContent;
  const [activeStepId, setActiveStepId] = useState<string>('01');

  const activeStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <section
      id="stepper"
      aria-labelledby="process-stepper-title"
      className="bg-[var(--bg-page)] py-16 sm:py-20 lg:py-24 border-b border-[var(--border-subtle)]"
    >
      <Container>
        {/* Header Matching Image 1 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-3">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id="process-stepper-title" className="font-h2 text-white leading-tight">
              {titleRegular}
              <span className="text-[var(--color-brand-600)] block sm:inline">
                {titleGreen}
              </span>
            </h2>
            <p className="font-body text-[var(--text-muted)]">
              {subheadline}
            </p>
          </div>

          <a
            href="#demo-modal"
            className="hidden sm:inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius-sm)] border border-white/20 hover:border-white text-white font-bold text-[14px] transition-colors cursor-pointer shrink-0"
          >
            {actionButtonText}
          </a>
        </div>

        {/* 2-Column Desktop View / Vertical Interactive Stepper Matching Image 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Step Cards */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((step) => {
              const isActive = step.id === activeStepId;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepId(step.id)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`w-full text-left p-6 sm:p-7 rounded-[var(--radius-md)] border transition-all duration-[var(--dur-fast)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${
                    isActive
                      ? 'bg-[#121915] border-[var(--color-brand-600)] shadow-[0_0_20px_rgba(0,208,108,0.12)]'
                      : 'bg-[#0E1210] border-[#1C2420] hover:border-[#2D3A33] hover:bg-[#121714]'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <span
                      className={`text-[36px] sm:text-[44px] font-bold font-stat leading-none tracking-tight ${
                        isActive ? 'text-[var(--color-brand-600)]' : 'text-gray-600'
                      }`}
                    >
                      {step.numberText}
                    </span>
                    <div className="flex-1">
                      <h3
                        className={`text-[17px] font-bold transition-colors ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                      {isActive && (
                        <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-brand-600)]">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>Deliverable: {step.deliverable}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual for Active Step */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="screenshot-backdrop p-6 rounded-[var(--radius-lg)] border border-[var(--border-strong)] shadow-[var(--shadow-md)]">
              <div className="bg-[#0B0F0D] rounded-[var(--radius-md)] border border-[var(--border-strong)] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-[#1C2420] pb-4">
                  <span className="font-eyebrow text-[var(--color-brand-600)]">
                    {activeStep.visualDetail.tag}
                  </span>
                  <span className="text-[12px] font-mono px-2.5 py-1 rounded bg-[var(--color-brand-50)] text-[var(--color-brand-600)] font-bold border border-[var(--color-brand-600)]/30">
                    Step {activeStep.numberText} of 05
                  </span>
                </div>

                <div>
                  <h4 className="font-h3 text-white mb-2">
                    {activeStep.visualDetail.headline}
                  </h4>
                  <p className="font-body-sm text-gray-400">
                    Continuous econometric calibration designed to protect margins and eliminate spreadsheet errors.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {activeStep.visualDetail.dataPoints.map((dp) => (
                    <div
                      key={dp.label}
                      className="p-4 rounded-[var(--radius-sm)] bg-[#121614] border border-[#1C2420] flex items-center justify-between"
                    >
                      <span className="text-[13px] font-medium text-gray-300">
                        {dp.label}
                      </span>
                      <span className="text-[13px] font-mono font-bold text-[var(--color-brand-600)]">
                        {dp.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-[var(--radius-sm)] bg-[#0D2619] border border-[#113B26] flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[var(--color-brand-400)]">
                    Next: Step {activeStep.id === '05' ? '01' : `0${parseInt(activeStep.id, 10) + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextId = activeStep.id === '05' ? '01' : `0${parseInt(activeStep.id, 10) + 1}`;
                      setActiveStepId(nextId);
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--color-brand-600)] hover:underline cursor-pointer"
                  >
                    <span>Advance phase</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
