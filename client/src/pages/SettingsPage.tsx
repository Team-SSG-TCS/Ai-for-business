import React, { useState } from 'react';
import {
  Settings, Sliders, Shield, Database, Lock, Cpu,
  CheckCircle2, Building, RefreshCw, Key, Bell
} from 'lucide-react';
import { PageId } from '../components/layout/AppLayout';

interface SettingsPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [riskSensitivity, setRiskSensitivity] = useState<number>(75);
  const [enablePmlaRules, setEnablePmlaRules] = useState<boolean>(true);
  const [enableFatfRules, setEnableFatfRules] = useState<boolean>(true);
  const [enableRbiRules, setEnableRbiRules] = useState<boolean>(true);
  const [autoGenerateHypotheses, setAutoGenerateHypotheses] = useState<boolean>(true);
  const [enforceMdmCheck, setEnforceMdmCheck] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Platform Intelligence Settings</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#0D2619] text-[#00D06C] border border-[#00D06C]/30 font-mono">
              Enterprise Configuration
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure risk classification thresholds, statutory regulatory frameworks, and multi-agent AI parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#00D06C] hover:bg-[#05B860] text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/20 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Configuration parameters persisted across cluster intelligence engines.</span>
        </div>
      )}

      {/* 1. Risk Sensitivity & Alert Generation */}
      <div className="bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-lg space-y-4">
        <div className="pb-3 border-b border-[#1C2420]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00D06C]" />
            <span>Risk Sensitivity & Community Clustering Threshold</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Adjust the graph partition density threshold for flagging multi-account clusters.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Minimum Anomaly Score to Trigger Automatic Case:</span>
            <span className="font-mono text-[#00D06C] font-bold">{riskSensitivity} / 100</span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={riskSensitivity}
            onChange={e => setRiskSensitivity(Number(e.target.value))}
            className="w-full accent-[#00D06C]"
          />
          <div className="flex justify-between text-[10px] text-gray-500 font-mono">
            <span>50 (High Recall / More Alerts)</span>
            <span>75 (Recommended Baseline)</span>
            <span>95 (High Precision / Critical Only)</span>
          </div>
        </div>
      </div>

      {/* 2. Statutory Regulatory Frameworks */}
      <div className="bg-[#131B2B] p-5 rounded-xl border border-[#273449] shadow-lg space-y-4">
        <div className="pb-3 border-b border-[#273449]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Statutory Compliance & AML Frameworks</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Active rule engines evaluated against core banking transactions.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-[#0B0F19] rounded-lg border border-[#273449] cursor-pointer hover:border-gray-600">
            <div>
              <span className="font-bold text-white block">PMLA 2002 (Prevention of Money Laundering Act - India)</span>
              <span className="text-gray-400 text-[11px]">Enforces ₹50,000 cash/PAN reporting threshold and 30-day velocity audits.</span>
            </div>
            <input
              type="checkbox"
              checked={enablePmlaRules}
              onChange={e => setEnablePmlaRules(e.target.checked)}
              className="w-4 h-4 accent-[#00D06C] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#08090A] rounded-lg border border-[#1C2420] cursor-pointer hover:border-gray-600">
            <div>
              <span className="font-bold text-white block">RBI Master Directions on Fraud Classification & Monitoring</span>
              <span className="text-gray-400 text-[11px]">Enforces Early Warning Signals (EWS) and mule account freeze triggers.</span>
            </div>
            <input
              type="checkbox"
              checked={enableRbiRules}
              onChange={e => setEnableRbiRules(e.target.checked)}
              className="w-4 h-4 accent-[#00D06C] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#08090A] rounded-lg border border-[#1C2420] cursor-pointer hover:border-gray-600">
            <div>
              <span className="font-bold text-white block">FATF 40 Recommendations (Cross-Border Wire Tracing)</span>
              <span className="text-gray-400 text-[11px]">Travel Rule compliance and offshore correspondent intermediary tracking.</span>
            </div>
            <input
              type="checkbox"
              checked={enableFatfRules}
              onChange={e => setEnableFatfRules(e.target.checked)}
              className="w-4 h-4 accent-[#00D06C] rounded"
            />
          </label>
        </div>
      </div>

      {/* 3. Multi-Agent AI Safeguards */}
      <div className="bg-[#131715] p-5 rounded-xl border border-[#1C2420] shadow-lg space-y-4">
        <div className="pb-3 border-b border-[#1C2420]">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00D06C]" />
            <span>Multi-Agent AI Reasoning Safeguards</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Strict parameters ensuring non-hallucinated evidence binding and balanced hypotheses.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-[#08090A] rounded-lg border border-[#1C2420] cursor-pointer">
            <div>
              <span className="font-bold text-white block">Mandatory Alternative Hypothesis Testing</span>
              <span className="text-gray-400 text-[11px]">Forces the Alternative Explanation Agent to evaluate corporate structures prior to conclusion.</span>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateHypotheses}
              onChange={e => setAutoGenerateHypotheses(e.target.checked)}
              className="w-4 h-4 accent-[#00D06C] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-[#08090A] rounded-lg border border-[#1C2420] cursor-pointer">
            <div>
              <span className="font-bold text-white block">Enforce MDM & Corporate Fleet Verification</span>
              <span className="text-gray-400 text-[11px]">Cross-references shared hardware fingerprints against enrolled enterprise devices before flagging mule rings.</span>
            </div>
            <input
              type="checkbox"
              checked={enforceMdmCheck}
              onChange={e => setEnforceMdmCheck(e.target.checked)}
              className="w-4 h-4 accent-[#00D06C] rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
