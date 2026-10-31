import React, { useState } from 'react';
import { PageId } from '../components/layout/AppLayout';
import {
  Sliders, Shield, Cpu, Lock, CheckCircle2,
  AlertTriangle, RefreshCw, Save
} from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [riskSensitivity, setRiskSensitivity] = useState(75);
  const [enablePmlaRules, setEnablePmlaRules] = useState(true);
  const [enableRbiRules, setEnableRbiRules] = useState(true);
  const [enableFatfRules, setEnableFatfRules] = useState(true);
  const [autoGenerateHypotheses, setAutoGenerateHypotheses] = useState(true);
  const [enforceMdmCheck, setEnforceMdmCheck] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span>Detection Sensitivity & Statutory Policy Engine</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-semibold">
              Live Configuration
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure risk classification thresholds, statutory regulatory frameworks, and multi-agent AI parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy Parameters</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#065F46] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          <span>Configuration parameters persisted across cluster intelligence engines.</span>
        </div>
      )}

      {/* 1. Risk Sensitivity Slider */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="pb-3 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#059669]" />
            <span>Risk Sensitivity & Community Clustering Threshold</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Adjust the graph partition density threshold for flagging multi-account clusters.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#334155] font-medium">Minimum Anomaly Score to Trigger Automatic Hold:</span>
            <span className="font-mono text-[#059669] font-bold text-sm">{riskSensitivity} / 100</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={riskSensitivity}
            onChange={e => setRiskSensitivity(Number(e.target.value))}
            className="w-full accent-[#059669]"
          />
          <div className="flex justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>50 (High Sensitivity / More Alerts)</span>
            <span>75 (Recommended Baseline)</span>
            <span>95 (Conservative / High Precision)</span>
          </div>
        </div>
      </div>

      {/* 2. Statutory Regulatory Frameworks */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="pb-3 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2563EB]" />
            <span>Statutory Compliance Rulesets</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active regulatory standards applied during transaction pattern reasoning.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-pointer hover:border-[#CBD5E1]">
            <div>
              <span className="font-bold text-[#0F172A] block">PMLA 2002 (Prevention of Money Laundering Act - India)</span>
              <span className="text-[#64748B] text-[11px]">Enforces ₹50,000 cash/PAN reporting threshold and 30-day velocity audits.</span>
            </div>
            <input
              type="checkbox"
              checked={enablePmlaRules}
              onChange={e => setEnablePmlaRules(e.target.checked)}
              className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-pointer hover:border-[#CBD5E1]">
            <div>
              <span className="font-bold text-[#0F172A] block">RBI Master Directions on Fraud Classification & Monitoring</span>
              <span className="text-[#64748B] text-[11px]">Enforces Early Warning Signals (EWS) and mule account freeze triggers.</span>
            </div>
            <input
              type="checkbox"
              checked={enableRbiRules}
              onChange={e => setEnableRbiRules(e.target.checked)}
              className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-pointer hover:border-[#CBD5E1]">
            <div>
              <span className="font-bold text-[#0F172A] block">FATF 40 Recommendations (Cross-Border Wire Tracing)</span>
              <span className="text-[#64748B] text-[11px]">Travel Rule compliance and offshore correspondent intermediary tracking.</span>
            </div>
            <input
              type="checkbox"
              checked={enableFatfRules}
              onChange={e => setEnableFatfRules(e.target.checked)}
              className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 3. Multi-Agent AI Reasoning Safeguards */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="pb-3 border-b border-[#E2E8F0]">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#7C3AED]" />
            <span>Multi-Agent AI Reasoning Safeguards</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Strict parameters ensuring non-hallucinated evidence binding and balanced hypotheses.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-pointer">
            <div>
              <span className="font-bold text-[#0F172A] block">Mandatory Alternative Hypothesis Testing</span>
              <span className="text-[#64748B] text-[11px]">Forces the Alternative Explanation Agent to evaluate corporate structures prior to conclusion.</span>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateHypotheses}
              onChange={e => setAutoGenerateHypotheses(e.target.checked)}
              className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] cursor-pointer">
            <div>
              <span className="font-bold text-[#0F172A] block">Enforce MDM & Corporate Fleet Verification</span>
              <span className="text-[#64748B] text-[11px]">Cross-references shared hardware fingerprints against enrolled enterprise devices before flagging mule rings.</span>
            </div>
            <input
              type="checkbox"
              checked={enforceMdmCheck}
              onChange={e => setEnforceMdmCheck(e.target.checked)}
              className="w-4 h-4 accent-[#059669] rounded cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
