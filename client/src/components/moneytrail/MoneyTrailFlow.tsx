import React, { useState, useEffect } from 'react';
import {
  Play, Pause, SkipForward, RotateCcw, Clock, ArrowRight,
  TrendingUp, AlertTriangle, ShieldCheck, Sparkles, Filter, ChevronRight
} from 'lucide-react';
import { formatINR } from '../../mock/financialData';

interface MoneyTrailHop {
  id: string;
  stepIndex: number;
  time: string;
  interHopDelta: string;
  fromAccount: string;
  fromName: string;
  toAccount: string;
  toName: string;
  amount: number;
  percentageMoved: number;
  remainingInSource: number;
  channel: string;
  txnId: string;
  flagType: string;
  isCircularReturn?: boolean;
}

const TRAIL_STEPS: MoneyTrailHop[] = [
  {
    id: 'HOP-0',
    stepIndex: 0,
    time: '09:15:00 IST',
    interHopDelta: 'Initial Funding Influx',
    fromAccount: 'EXT-WIRE (Offshore)',
    fromName: 'Offshore Capital Wire',
    toAccount: 'ACC-9004',
    toName: 'Vikram Mehra (Account A)',
    amount: 1000000,
    percentageMoved: 100,
    remainingInSource: 0,
    channel: 'RTGS',
    txnId: 'TXN-88041',
    flagType: 'VELOCITY_INGRESS_SPIKE'
  },
  {
    id: 'HOP-1A',
    stepIndex: 1,
    time: '09:32:15 IST',
    interHopDelta: '+17 mins',
    fromAccount: 'ACC-9004',
    fromName: 'Vikram Mehra (Account A)',
    toAccount: 'ACC-9019',
    toName: 'Priya Sharma (Account B)',
    amount: 600000,
    percentageMoved: 60,
    remainingInSource: 400000,
    channel: 'NEFT',
    txnId: 'TXN-88042',
    flagType: 'RAPID_DISPERSION_SPLIT'
  },
  {
    id: 'HOP-1B',
    stepIndex: 1,
    time: '09:34:40 IST',
    interHopDelta: '+2 mins',
    fromAccount: 'ACC-9004',
    fromName: 'Vikram Mehra (Account A)',
    toAccount: 'ACC-9042',
    toName: 'Amit Verma (Account C)',
    amount: 400000,
    percentageMoved: 40,
    remainingInSource: 0,
    channel: 'IMPS',
    txnId: 'TXN-88043',
    flagType: 'EXHAUSTION_DISPERSION'
  },
  {
    id: 'HOP-2A',
    stepIndex: 2,
    time: '09:47:05 IST',
    interHopDelta: '+13 mins',
    fromAccount: 'ACC-9019',
    fromName: 'Priya Sharma (Account B)',
    toAccount: 'ACC-9077',
    toName: 'Ramesh Chawla (Account D - Mule)',
    amount: 550000,
    percentageMoved: 91.6,
    remainingInSource: 50000,
    channel: 'IMPS',
    txnId: 'TXN-88044',
    flagType: 'MULE_CHAIN_LAYER'
  },
  {
    id: 'HOP-2B',
    stepIndex: 2,
    time: '09:52:30 IST',
    interHopDelta: '+5 mins',
    fromAccount: 'ACC-9042',
    fromName: 'Amit Verma (Account C)',
    toAccount: 'MER-501',
    toName: 'Zaveri Bazaar Gold (Merchant X)',
    amount: 380000,
    percentageMoved: 95.0,
    remainingInSource: 20000,
    channel: 'RTGS',
    txnId: 'TXN-88045',
    flagType: 'BULLION_CASH_CONVERSION'
  },
  {
    id: 'HOP-3',
    stepIndex: 3,
    time: '10:02:12 IST',
    interHopDelta: '+10 mins',
    fromAccount: 'ACC-9077',
    fromName: 'Ramesh Chawla (Account D)',
    toAccount: 'ACC-9098',
    toName: 'Apex Bullion Trade (Account E)',
    amount: 500000,
    percentageMoved: 90.9,
    remainingInSource: 50000,
    channel: 'RTGS',
    txnId: 'TXN-88046',
    flagType: 'FINAL_LIQUIDATION_CONSOLIDATION'
  },
  {
    id: 'HOP-4',
    stepIndex: 4,
    time: '10:45:00 IST',
    interHopDelta: '+43 mins',
    fromAccount: 'ACC-9098',
    fromName: 'Apex Bullion Trade (Account E)',
    toAccount: 'ACC-9004',
    toName: 'Vikram Mehra (Account A)',
    amount: 150000,
    percentageMoved: 15.0,
    remainingInSource: 350000,
    channel: 'NEFT',
    txnId: 'TXN-88047',
    flagType: 'CIRCULAR_LOOP_KICKBACK',
    isCircularReturn: true
  }
];

export const MoneyTrailFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);
  const [selectedHop, setSelectedHop] = useState<MoneyTrailHop>(TRAIL_STEPS[1]);

  // Filters
  const [startingAccount, setStartingAccount] = useState<string>('ACC-9004');
  const [minAmountFilter, setMinAmountFilter] = useState<number>(0);
  const [maxHopsFilter, setMaxHopsFilter] = useState<number>(5);

  // Playback timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const displayedHops = TRAIL_STEPS.filter(
    h => h.stepIndex <= activeStep && h.amount >= minAmountFilter && h.stepIndex <= maxHopsFilter
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Left Main Flow Interactive Visualization */}
      <div className="flex-1 flex flex-col gap-5">
        {/* Filter bar */}
        <div className="bg-[#131B2B] p-4 rounded-xl border border-[#273449] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">Starting Origin Account</label>
              <select
                value={startingAccount}
                onChange={e => setStartingAccount(e.target.value)}
                className="bg-[#0B0F19] text-xs text-white border border-[#273449] rounded px-3 py-1.5 focus:border-indigo-500"
              >
                <option value="ACC-9004">ACC-9004 (Vikram Mehra - ₹10,00,000)</option>
                <option value="ACC-9012">ACC-9012 (Alok Saxena - ₹24,00,000)</option>
                <option value="ACC-9029">ACC-9029 (Layering Outflow - ₹32,00,000)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                Min Amount: <span className="text-white font-mono">{formatINR(minAmountFilter)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="500000"
                step="50000"
                value={minAmountFilter}
                onChange={e => setMinAmountFilter(Number(e.target.value))}
                className="w-32 accent-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                Max Hops: <span className="text-white font-mono">{maxHopsFilter}</span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={maxHopsFilter}
                onChange={e => setMaxHopsFilter(Number(e.target.value))}
                className="w-24 accent-indigo-500"
              />
            </div>
          </div>

          {/* Timeline Playback Controls */}
          <div className="flex items-center gap-2 bg-[#0B0F19] p-1.5 rounded-lg border border-[#273449]">
            <button
              onClick={() => { setActiveStep(0); setIsPlaying(false); }}
              className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded"
              title="Reset Timeline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
            </button>
            <button
              onClick={() => setActiveStep(s => Math.min(4, s + 1))}
              className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded"
              title="Next Step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-400 px-2 border-l border-gray-800">
              Stage {activeStep + 1} / 5
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Stage Flow Diagram */}
        <div className="bg-[#131B2B] border border-[#273449] rounded-xl p-6 min-h-[480px] flex flex-col justify-between relative overflow-x-auto">
          {/* Top flow metrics header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-[#273449] text-xs">
            <div>
              <span className="text-gray-400 block">Original Influx</span>
              <span className="text-lg font-bold font-mono text-white">₹10,00,000</span>
              <span className="text-[10px] text-gray-500 block">09:15:00 IST via RTGS</span>
            </div>
            <div>
              <span className="text-gray-400 block">Dispersed Across</span>
              <span className="text-lg font-bold font-mono text-cyan-400">5 Accounts / Hops</span>
              <span className="text-[10px] text-gray-500 block">45 mins elapsed time</span>
            </div>
            <div>
              <span className="text-gray-400 block">Fund Retention Velocity</span>
              <span className="text-lg font-bold font-mono text-rose-400">94.2% Outflow</span>
              <span className="text-[10px] text-rose-500/80 block">Aggressive zero-balance</span>
            </div>
            <div>
              <span className="text-gray-400 block">Circular Kickback</span>
              <span className="text-lg font-bold font-mono text-amber-400">₹1,50,000 (15%)</span>
              <span className="text-[10px] text-amber-500/80 block">Returned to Account A</span>
            </div>
          </div>

          {/* Node-Link Multi-Tier Hop Visualization */}
          <div className="py-8 flex flex-col gap-6">
            {/* Stage 0: Initial Funding Node */}
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="text-[11px] font-mono text-gray-400 block">09:15 IST</span>
                <span className="text-xs font-semibold text-gray-300">Stage 0 (Origin)</span>
              </div>

              <div className="p-3 bg-[#182235] border border-cyan-500/40 rounded-lg flex items-center justify-between w-72 shadow-md">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono block">ACCOUNT A (ACC-9004)</span>
                  <span className="text-xs font-bold text-white">Vikram Mehra</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">+₹10,00,000</span>
                  <span className="text-[10px] text-gray-400 block">Initial Credit</span>
                </div>
              </div>
            </div>

            {/* Stage 1: Split into 2 accounts */}
            <div className={`flex items-start gap-4 transition-opacity duration-300 ${activeStep >= 1 ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-32 text-right pt-2">
                <span className="text-[11px] font-mono text-amber-400 block">+17 mins (09:32)</span>
                <span className="text-xs font-semibold text-gray-300">Stage 1 (Dispersion)</span>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                {/* Branch 1: Account B */}
                <div
                  onClick={() => setSelectedHop(TRAIL_STEPS[1])}
                  className={`p-3 bg-[#0B0F19] border rounded-lg flex-1 cursor-pointer transition-all ${
                    selectedHop.id === 'HOP-1A' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-[#273449] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-mono block">ACCOUNT B (ACC-9019)</span>
                      <span className="text-xs font-bold text-white">Priya Sharma</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">₹6,00,000 (60%)</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>TXN-88042 (NEFT)</span>
                    <span className="text-amber-400">Retained: ₹4,00,000</span>
                  </div>
                </div>

                {/* Branch 2: Account C */}
                <div
                  onClick={() => setSelectedHop(TRAIL_STEPS[2])}
                  className={`p-3 bg-[#0B0F19] border rounded-lg flex-1 cursor-pointer transition-all ${
                    selectedHop.id === 'HOP-1B' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-[#273449] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-indigo-400 font-mono block">ACCOUNT C (ACC-9042)</span>
                      <span className="text-xs font-bold text-white">Amit Verma</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">₹4,00,000 (40%)</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>TXN-88043 (IMPS)</span>
                    <span className="text-rose-400">Retained: ₹0 (Exhausted)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2: Second Layer of Movement */}
            <div className={`flex items-start gap-4 transition-opacity duration-300 ${activeStep >= 2 ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-32 text-right pt-2">
                <span className="text-[11px] font-mono text-amber-400 block">+15 mins (09:47)</span>
                <span className="text-xs font-semibold text-gray-300">Stage 2 (Layering)</span>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row gap-4">
                {/* Account B -> Account D */}
                <div
                  onClick={() => setSelectedHop(TRAIL_STEPS[3])}
                  className={`p-3 bg-[#0B0F19] border rounded-lg flex-1 cursor-pointer transition-all ${
                    selectedHop.id === 'HOP-2A' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-[#273449] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-purple-400 font-mono block">ACCOUNT D (ACC-9077)</span>
                      <span className="text-xs font-bold text-white">Ramesh Chawla (Mule)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">₹5,50,000 (91.6%)</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>TXN-88044 (IMPS)</span>
                    <span className="text-gray-400">Residual: ₹50,000</span>
                  </div>
                </div>

                {/* Account C -> Merchant X (Bullion) */}
                <div
                  onClick={() => setSelectedHop(TRAIL_STEPS[4])}
                  className={`p-3 bg-[#0B0F19] border rounded-lg flex-1 cursor-pointer transition-all ${
                    selectedHop.id === 'HOP-2B' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-[#273449] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono block">MERCHANT X (MER-501)</span>
                      <span className="text-xs font-bold text-white">Zaveri Bazaar Gold Trading</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">₹3,80,000 (95%)</span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                    <span>TXN-88045 (RTGS)</span>
                    <span className="text-emerald-400">Converted to Gold</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3: Account D -> Account E (Final Consolidation) */}
            <div className={`flex items-start gap-4 transition-opacity duration-300 ${activeStep >= 3 ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-32 text-right pt-2">
                <span className="text-[11px] font-mono text-amber-400 block">+10 mins (10:02)</span>
                <span className="text-xs font-semibold text-gray-300">Stage 3 (Consolidation)</span>
              </div>

              <div
                onClick={() => setSelectedHop(TRAIL_STEPS[5])}
                className={`p-3 bg-[#0B0F19] border rounded-lg flex-1 cursor-pointer transition-all ${
                  selectedHop.id === 'HOP-3' ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-[#273449] hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-mono block">ACCOUNT E (ACC-9098)</span>
                    <span className="text-xs font-bold text-white">Apex Bullion Trade (Common Beneficiary)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">₹5,00,000 (90.9%)</span>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 flex justify-between">
                  <span>TXN-88046 (RTGS)</span>
                  <span className="text-rose-400">Final Beneficiary Settlement</span>
                </div>
              </div>
            </div>

            {/* Stage 4: Circular Loop Return to Account A */}
            <div className={`flex items-start gap-4 transition-opacity duration-300 ${activeStep >= 4 ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-32 text-right pt-2">
                <span className="text-[11px] font-mono text-rose-400 block">+43 mins (10:45)</span>
                <span className="text-xs font-semibold text-gray-300">Stage 4 (Circular Return)</span>
              </div>

              <div
                onClick={() => setSelectedHop(TRAIL_STEPS[6])}
                className={`p-3 bg-rose-500/10 border border-rose-500/40 rounded-lg flex-1 cursor-pointer transition-all ${
                  selectedHop.id === 'HOP-4' ? 'ring-1 ring-rose-500' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-rose-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <div>
                      <span className="text-[10px] text-rose-400 font-mono block">CIRCULAR RETURN LOOP → ACCOUNT A</span>
                      <span className="text-xs font-bold text-white">Rebate Invoice to Vikram Mehra</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-400">₹1,50,000 (15%)</span>
                </div>
                <div className="mt-2 text-[10px] text-rose-300/80 flex justify-between">
                  <span>TXN-88047 (NEFT)</span>
                  <span>Closed Ring Topology Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel: AI Money Trail Summary & Detailed Hop Inspector */}
      <div className="w-full xl:w-96 flex flex-col gap-4">
        {/* AI Money Trail Summary */}
        <div className="bg-[#131B2B] border border-[#273449] rounded-xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">AI Money Trail Summary</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Pattern Reconstructed
            </span>
          </div>

          <div className="p-3 bg-[#0B0F19] rounded-lg border border-[#273449] text-xs leading-relaxed text-gray-300 space-y-2">
            <p>
              <strong className="text-white">₹10 Lakh</strong> entered Account A (<span className="font-mono text-cyan-300">ACC-9004</span>) at 09:15 via <span className="font-mono text-gray-400">TXN-88041</span>.
            </p>
            <p>
              Within 45 minutes, funds were distributed into two accounts: <span className="font-mono text-indigo-300">ACC-9019</span> (₹6,00,000 via <span className="font-mono text-gray-400">TXN-88042</span>) and <span className="font-mono text-indigo-300">ACC-9042</span> (₹4,00,000 via <span className="font-mono text-gray-400">TXN-88043</span>).
            </p>
            <p>
              A substantial portion subsequently moved to two further destinations: <span className="font-mono text-purple-300">ACC-9077</span> (₹5,50,000 via <span className="font-mono text-gray-400">TXN-88044</span>) and bullion merchant <span className="font-mono text-amber-300">MER-501</span> (₹3,80,000 via <span className="font-mono text-gray-400">TXN-88045</span>).
            </p>
            <p className="text-rose-400 font-medium">
              Critically, ₹1,50,000 returned to the originating Account A via <span className="font-mono text-rose-300">TXN-88047</span>, completing a circular layering cycle.
            </p>
          </div>

          {/* Explain this Money Trail Button & Detailed Breakdown */}
          <div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full py-2 bg-[#182235] hover:bg-[#1E2D45] text-cyan-300 rounded border border-cyan-800/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showExplanation ? 'Hide Detailed Reasoning' : 'Explain This Money Trail'}</span>
            </button>

            {showExplanation && (
              <div className="mt-3 p-3 bg-[#0B0F19] rounded border border-[#273449] text-xs space-y-2 text-gray-300 animate-in fade-in duration-200">
                <div className="font-semibold text-white">Investigation Hypotheses:</div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Velocity Exhaustion:</strong> 94% of the originating ₹10L was wiped out within 32 minutes across secondary hops, typical of mule pass-through accounts.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Liquidation Destination:</strong> ₹8,80,000 was converted into non-traceable assets through bullion merchants (<span className="font-mono text-white">BEN-401</span> & <span className="font-mono text-white">MER-501</span>).
                  </span>
                </div>
                <div className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong>Alternative Legitimacy:</strong> Vendor reconciliation statement for Mehra-Sharma Logistics asserts gold bullion was procured for export collateral.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Hop Inspector Card */}
        <div className="bg-[#131B2B] border border-[#273449] rounded-xl p-4 text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#273449]">
            <span className="font-bold text-white">Selected Transfer Details</span>
            <span className="font-mono text-xs text-indigo-400">{selectedHop.txnId}</span>
          </div>

          <div className="space-y-1.5 text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp:</span>
              <span className="font-mono text-white">{selectedHop.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inter-Hop Latency:</span>
              <span className="font-mono text-amber-400 font-bold">{selectedHop.interHopDelta}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transfer Amount:</span>
              <span className="font-mono text-white font-bold">{formatINR(selectedHop.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Channel:</span>
              <span className="font-mono text-cyan-400">{selectedHop.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Source Account:</span>
              <span className="font-mono text-gray-200">{selectedHop.fromAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Destination:</span>
              <span className="font-mono text-gray-200">{selectedHop.toAccount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pattern Classification:</span>
              <span className="text-rose-400 font-semibold">{selectedHop.flagType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
