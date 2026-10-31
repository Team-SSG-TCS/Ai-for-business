import React, { useState } from 'react';
import {
  HelpCircle, Sparkles, Download, Send, Search, Bell, Moon, Sun,
  LogOut, CheckCircle2, ChevronDown, Database, Code2, Users,
  BarChart3, RefreshCw, Filter, ArrowUpRight
} from 'lucide-react';
import { PageId } from '../components/layout/AppLayout';

interface FacultyDataAssistantPageProps {
  onNavigate?: (page: PageId, meta?: any) => void;
}

interface PresetItem {
  id: number;
  category: string;
  categoryColor?: string;
  question: string;
  userQuery: string;
  timestamp: string;
  chartTitle: string;
  bars: { label: string; value: number; subtext?: string }[];
  maxValue: number;
  stats: {
    enrolled: string;
    completed: string;
    inProgress: string;
  };
  diagnosis: string;
  sqlQuery: string;
  tableData: {
    id: string;
    name: string;
    group: string;
    metric: string;
    score: string;
    status: 'Completed' | 'Struggling' | 'In Progress' | 'Flagged';
  }[];
}

const PRESETS: PresetItem[] = [
  {
    id: 1,
    category: 'TELEMETRY',
    categoryColor: 'bg-orange-50 text-orange-600 border-orange-200',
    question: 'What is the experiment completion status for my Physics Lab sections?',
    userQuery: 'What is the experiment completion status for my Physics Lab sections?',
    timestamp: '12:33 PM',
    chartTitle: 'Visual Analytics Distribution',
    maxValue: 100,
    bars: [
      { label: 'Section A (Morning)', value: 94 },
      { label: 'Section B (Morning)', value: 91 },
      { label: 'Section C (Afternoon)', value: 88 },
      { label: 'Section D (Evening)', value: 85 }
    ],
    stats: {
      enrolled: '248 Students',
      completed: '226 Students (91.1%)',
      inProgress: '22 Students'
    },
    diagnosis: 'Section A leads with 94.2% completion; all sections remain comfortably above the department passing threshold.',
    sqlQuery: `SELECT 
    section_name,
    COUNT(DISTINCT student_id) as total_enrolled,
    ROUND(SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) as completion_rate
FROM physics_lab_submissions
WHERE course_id = 'PHY-101' AND semester = '2026_FALL'
GROUP BY section_name
ORDER BY section_name ASC;`,
    tableData: [
      { id: 'STU-1048', name: 'Aarav Sharma', group: 'Section A', metric: 'Photoelectric Effect', score: '96/100', status: 'Completed' },
      { id: 'STU-1049', name: 'Diya Patel', group: 'Section A', metric: 'Millikan Oil Drop', score: '94/100', status: 'Completed' },
      { id: 'STU-1082', name: 'Rohan Verma', group: 'Section B', metric: 'Diffraction Grating', score: '91/100', status: 'Completed' },
      { id: 'STU-1120', name: 'Ananya Roy', group: 'Section C', metric: 'Michelson Interferometer', score: '88/100', status: 'Completed' },
      { id: 'STU-1154', name: 'Kabir Das', group: 'Section D', metric: 'Hall Effect', score: '85/100', status: 'Completed' },
      { id: 'STU-1162', name: 'Neha Gupta', group: 'Section D', metric: 'Zeeman Effect', score: '78/100', status: 'In Progress' }
    ]
  },
  {
    id: 2,
    category: 'HIGH PRIORITY',
    categoryColor: 'bg-red-50 text-red-600 border-red-200',
    question: 'Which students are struggling in Physics and need remedial trial assistance?',
    userQuery: 'Which students are struggling in Physics and need remedial trial assistance?',
    timestamp: '12:35 PM',
    chartTitle: 'Students Requiring Remedial Assistance by Module',
    maxValue: 50,
    bars: [
      { label: 'Quantum Mechanics', value: 38 },
      { label: 'Thermodynamics', value: 24 },
      { label: 'Wave Optics', value: 18 },
      { label: 'Electromagnetism', value: 12 }
    ],
    stats: {
      enrolled: '31 Students at Risk',
      completed: '12 High Friction (38.7%)',
      inProgress: '19 Remedial Queue'
    },
    diagnosis: 'Quantum Mechanics potential barrier tunneling accounts for 58% of student repeated trial retries; recommended remedial trial workshop scheduled.',
    sqlQuery: `SELECT 
    student_id, student_name, module_name, retry_count, ai_comprehension_score
FROM lab_student_telemetry
WHERE subject = 'Physics' AND (retry_count > 4 OR ai_comprehension_score < 60)
ORDER BY retry_count DESC;`,
    tableData: [
      { id: 'STU-1099', name: 'Kunal Sen', group: 'Section B', metric: 'Quantum Mechanics', score: '52/100', status: 'Struggling' },
      { id: 'STU-1104', name: 'Meera Joshi', group: 'Section B', metric: 'Quantum Mechanics', score: '58/100', status: 'Struggling' },
      { id: 'STU-1138', name: 'Tanya Nair', group: 'Section C', metric: 'Thermodynamics', score: '62/100', status: 'Struggling' },
      { id: 'STU-1175', name: 'Vivek Iyer', group: 'Section D', metric: 'Wave Optics', score: '55/100', status: 'Struggling' }
    ]
  },
  {
    id: 3,
    category: 'EVALUATION',
    categoryColor: 'bg-blue-50 text-blue-600 border-blue-200',
    question: 'Show student distribution by AI Viva defense score band',
    userQuery: 'Show student distribution by AI Viva defense score band',
    timestamp: '12:38 PM',
    chartTitle: 'AI Viva Defense Score Band Distribution (%)',
    maxValue: 100,
    bars: [
      { label: '90-100 (Distinction)', value: 72 },
      { label: '75-89 (Merit)', value: 89 },
      { label: '60-74 (Pass)', value: 64 },
      { label: 'Below 60 (Needs Support)', value: 28 }
    ],
    stats: {
      enrolled: '248 Defenses',
      completed: '161 Distinction & Merit (64.9%)',
      inProgress: '28 Re-defense Required'
    },
    diagnosis: '65% of students achieved merit or distinction during automated viva defense questioning; 28 candidates scheduled for concept clarification.',
    sqlQuery: `SELECT 
    CASE 
        WHEN viva_score >= 90 THEN '90-100 (Distinction)'
        WHEN viva_score >= 75 THEN '75-89 (Merit)'
        WHEN viva_score >= 60 THEN '60-74 (Pass)'
        ELSE 'Below 60 (Needs Support)'
    END as viva_band,
    COUNT(*) as student_count
FROM viva_defense_evaluations
GROUP BY viva_band;`,
    tableData: [
      { id: 'STU-1048', name: 'Aarav Sharma', group: 'Section A', metric: 'Defense: Wave Optics', score: '98/100', status: 'Completed' },
      { id: 'STU-1052', name: 'Pooja Hegde', group: 'Section A', metric: 'Defense: Mechanics', score: '92/100', status: 'Completed' },
      { id: 'STU-1089', name: 'Siddharth Rao', group: 'Section B', metric: 'Defense: Electricity', score: '76/100', status: 'Completed' },
      { id: 'STU-1142', name: 'Varun Dhawan', group: 'Section C', metric: 'Defense: Optics', score: '54/100', status: 'Flagged' }
    ]
  },
  {
    id: 4,
    category: 'LAB ANALYTICS',
    categoryColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    question: 'Which experiment modules have the highest student trial attempts & friction?',
    userQuery: 'Which experiment modules have the highest student trial attempts & friction?',
    timestamp: '12:40 PM',
    chartTitle: 'Average Retries & Friction Rate Per Experiment Module',
    maxValue: 10,
    bars: [
      { label: 'Photoelectric Effect', value: 8 },
      { label: 'Millikan Oil Drop', value: 7 },
      { label: 'Prism Spectrometer', value: 5 },
      { label: 'Ohm’s Law Verification', value: 2 }
    ],
    stats: {
      enrolled: '12 Active Modules',
      completed: 'Photoelectric (8.2 Avg Retries)',
      inProgress: '3 Modules Need Hints'
    },
    diagnosis: 'Stopping potential voltage step in Photoelectric Effect module generates the highest trial friction (8.2 retries per student).',
    sqlQuery: `SELECT 
    module_name,
    AVG(trial_retries) as avg_retries,
    AVG(time_spent_seconds) / 60 as avg_time_minutes
FROM student_lab_telemetry
GROUP BY module_name
ORDER BY avg_retries DESC
LIMIT 4;`,
    tableData: [
      { id: 'MOD-01', name: 'Photoelectric Effect', group: 'Quantum Lab', metric: 'Stopping Potential', score: '8.2 retries', status: 'Flagged' },
      { id: 'MOD-02', name: 'Millikan Oil Drop', group: 'Modern Physics', metric: 'Terminal Velocity Calc', score: '7.1 retries', status: 'Flagged' },
      { id: 'MOD-03', name: 'Prism Spectrometer', group: 'Optics Lab', metric: 'Angle of Minimum Deviation', score: '5.0 retries', status: 'In Progress' }
    ]
  },
  {
    id: 5,
    category: 'DIAGNOSTICS',
    categoryColor: 'bg-purple-50 text-purple-600 border-purple-200',
    question: 'Identify weak concepts and failure steps across Physics experiments',
    userQuery: 'Identify weak concepts and failure steps across Physics experiments',
    timestamp: '12:42 PM',
    chartTitle: 'Concept Failure Frequency Distribution',
    maxValue: 60,
    bars: [
      { label: 'Work Function & Cutoff', value: 54 },
      { label: 'Electric Dipole Alignment', value: 42 },
      { label: 'Interference Path Difference', value: 31 },
      { label: 'Thermodynamic Efficiency', value: 21 }
    ],
    stats: {
      enrolled: '148 Error Events',
      completed: 'Work Function (36.5% errors)',
      inProgress: 'Adaptive Hints Pushed'
    },
    diagnosis: 'Confusion between threshold frequency and light intensity remains the top conceptual error; interactive formula animations triggered.',
    sqlQuery: `SELECT 
    concept_name,
    COUNT(*) as total_failures,
    remediation_hint_id
FROM experiment_step_errors
GROUP BY concept_name, remediation_hint_id
ORDER BY total_failures DESC;`,
    tableData: [
      { id: 'ERR-301', name: 'Work Function & Cutoff', group: 'Photoelectric', metric: 'Kinetic energy slope', score: '54 errors', status: 'Flagged' },
      { id: 'ERR-302', name: 'Electric Dipole Alignment', group: 'Electromagnetism', metric: 'Torque cross product', score: '42 errors', status: 'Flagged' },
      { id: 'ERR-303', name: 'Interference Path Difference', group: 'Wave Optics', metric: 'Phase calculation', score: '31 errors', status: 'In Progress' }
    ]
  }
];

export const FacultyDataAssistantPage: React.FC<FacultyDataAssistantPageProps> = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>('');
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [showDataTable, setShowDataTable] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [liveSynced, setLiveSynced] = useState<boolean>(true);

  const activePreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleSelectPreset = (id: number) => {
    setSelectedPresetId(id);
  };

  const handleCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Fuzzy matcher to appropriate preset
    const q = inputValue.toLowerCase();
    if (q.includes('struggl') || q.includes('help') || q.includes('remedial') || q.includes('risk')) {
      setSelectedPresetId(2);
    } else if (q.includes('viva') || q.includes('defense') || q.includes('score') || q.includes('grade')) {
      setSelectedPresetId(3);
    } else if (q.includes('friction') || q.includes('attempt') || q.includes('module') || q.includes('retri')) {
      setSelectedPresetId(4);
    } else if (q.includes('fail') || q.includes('concept') || q.includes('weak') || q.includes('error')) {
      setSelectedPresetId(5);
    } else {
      setSelectedPresetId(1);
    }
    setInputValue('');
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['ID', 'Name', 'Group', 'Metric', 'Score', 'Status'];
      const rows = activePreset.tableData.map(r => [r.id, r.name, r.group, r.metric, r.score, r.status]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${activePreset.category.toLowerCase()}_analytics_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#1E293B] flex flex-col font-sans">
      {/* 1. TOP NAV / HEADER */}
      <header className="bg-white border-b border-[#F1E8DF] px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Breadcrumb Title */}
        <div className="flex items-center gap-2">
          <span className="text-[#64748B] text-sm font-medium">Faculty</span>
          <span className="text-[#CBD5E1]">/</span>
          <h1 className="text-[#0F172A] font-bold text-base tracking-tight flex items-center gap-2">
            Faculty Data Assistant
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search experiments, lab tasks, topics..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-xs text-[#334155] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Institute Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#F97316]/30 text-[#EA580C] rounded-md text-xs font-semibold shadow-xs">
            <span className="text-sm">🏛️</span>
            <span>BIT INSTITUTE</span>
          </div>

          {/* Language Selector */}
          <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-md text-xs text-[#475569] hover:bg-[#F8FAFC]">
            <span>🌐</span>
            <span className="font-medium">GB English</span>
            <span className="text-[#EA580C] text-[10px] bg-[#FFF7ED] px-1 rounded">भाषा</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {/* Notifications */}
          <div className="relative p-1.5 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#EA580C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </div>

          {/* Moon Theme Toggle */}
          <button className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-md">
            <Moon className="w-4 h-4" />
          </button>

          {/* Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#0284C7] to-[#38BDF8] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              PR
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-[#0F172A]">Prof. Rakesh Rao</div>
              <div className="text-[11px] text-[#64748B]">Faculty</div>
            </div>
            <button title="Logout" className="ml-1 text-[#94A3B8] hover:text-[#475569]">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT CANVAS */}
      <div className="flex-1 p-6 flex gap-6 max-w-7xl mx-auto w-full">
        {/* LEFT PANEL: QUERY SUGGESTIONS (5 PRESETS) */}
        <aside className="w-80 shrink-0 bg-white border border-[#F1E8DF] rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F8FAFC]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#475569]">
                <HelpCircle className="w-4 h-4 text-[#EA580C]" />
                <span>QUERY SUGGESTIONS</span>
              </div>
              <span className="text-[11px] font-semibold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FFEDD5]">
                5 Presets
              </span>
            </div>

            {/* Presets List */}
            <div className="space-y-3">
              {PRESETS.map(preset => {
                const isActive = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer border flex gap-3 ${
                      isActive
                        ? 'bg-[#FFF7ED] border-[#F97316] shadow-xs ring-1 ring-[#F97316]/30'
                        : 'bg-white border-[#F1E8DF] hover:border-[#E2E8F0] hover:bg-[#FAFAFA]'
                    }`}
                  >
                    {/* Number Badge */}
                    <div
                      className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isActive
                          ? 'bg-[#EA580C] text-white shadow-xs'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {preset.id}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <span
                        className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md mb-1.5 border ${
                          isActive
                            ? 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/20'
                            : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                        }`}
                      >
                        {preset.category}
                      </span>
                      <p
                        className={`text-xs leading-relaxed ${
                          isActive ? 'font-semibold text-[#0F172A]' : 'font-normal text-[#475569]'
                        }`}
                      >
                        {preset.question}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Telemetry Status */}
          <div className="pt-4 border-t border-[#F8FAFC] flex items-center justify-between text-xs text-[#64748B]">
            <span>Department Telemetry</span>
            <div className="flex items-center gap-1.5 font-semibold text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Live Synced</span>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL: CHAT STREAM & ANALYTICS CANVAS */}
        <main className="flex-1 flex flex-col justify-between bg-transparent">
          {/* Stream of Query & AI Response */}
          <div className="space-y-5 flex-1">
            {/* User Speech Bubble */}
            <div className="flex items-start gap-3 justify-end">
              <div className="max-w-xl bg-[#EA580C] text-white px-5 py-3.5 rounded-2xl rounded-tr-xs shadow-[0_4px_12px_rgba(234,88,12,0.2)]">
                <p className="text-sm font-medium leading-relaxed">
                  {activePreset.userQuery}
                </p>
                <div className="text-[10px] text-white/80 text-right mt-1.5 font-mono">
                  {activePreset.timestamp}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                👤
              </div>
            </div>

            {/* AI Response Card Container */}
            <div className="flex items-start gap-3">
              {/* Bot Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Main Analytics Card */}
              <div className="flex-1 bg-white border border-[#F1E8DF] rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
                {/* Analytics Header & Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F8FAFC]">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#EA580C]" />
                    <h2 className="text-sm font-bold text-[#0F172A] tracking-tight">
                      {activePreset.chartTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* SQL Inspector Button */}
                    <button
                      onClick={() => setShowSqlModal(!showSqlModal)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg transition"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#EA580C]" />
                      <span>{showSqlModal ? 'Hide SQL' : 'View SQL Query'}</span>
                    </button>

                    {/* Export CSV Button */}
                    <button
                      onClick={handleExportCSV}
                      disabled={isExporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#EA580C] bg-[#FFF7ED] hover:bg-[#FFEDD5] border border-[#FFEDD5] rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                    </button>
                  </div>
                </div>

                {/* SQL Query Inspector (Accordion) */}
                {showSqlModal && (
                  <div className="bg-[#0F172A] text-[#E2E8F0] p-4 rounded-xl text-xs font-mono border border-[#334155] space-y-2">
                    <div className="flex items-center justify-between text-[#94A3B8] pb-1 border-b border-[#334155]">
                      <span className="font-bold flex items-center gap-1 text-[#F97316]">
                        <Database className="w-3.5 h-3.5" />
                        AI-Synthesized Parameterized SQL
                      </span>
                      <span>Target: Postgres DB</span>
                    </div>
                    <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {activePreset.sqlQuery}
                    </pre>
                  </div>
                )}

                {/* 1. VISUAL BAR CHART */}
                <div className="pt-2">
                  <div className="h-56 w-full flex items-end justify-around gap-6 px-4 pb-2 border-b border-[#E2E8F0]">
                    {activePreset.bars.map((bar, idx) => {
                      const heightPercent = Math.min(100, Math.round((bar.value / activePreset.maxValue) * 100));
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group max-w-[100px]">
                          {/* Value on top of the bar */}
                          <div className="text-xs font-bold text-[#0F172A] mb-1.5 font-mono group-hover:text-[#EA580C] transition">
                            {bar.value}
                          </div>

                          {/* Orange Bar */}
                          <div className="w-full bg-[#F1F5F9] rounded-t-lg overflow-hidden h-44 flex items-end">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className="w-full bg-linear-to-t from-[#EA580C] to-[#F97316] rounded-t-md transition-all duration-500 ease-out group-hover:brightness-110 shadow-xs"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-around gap-6 px-4 pt-2.5 text-center text-xs text-[#64748B] font-medium">
                    {activePreset.bars.map((bar, idx) => (
                      <div key={idx} className="flex-1 max-w-[100px]">
                        {bar.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. STAT SUMMARY BOXES (3 Columns) */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  {/* Total Enrolled */}
                  <div className="p-3.5 bg-white border border-[#F1E8DF] rounded-xl shadow-xs">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      TOTAL ENROLLED
                    </div>
                    <div className="text-base font-extrabold text-[#0F172A]">
                      {activePreset.stats.enrolled}
                    </div>
                  </div>

                  {/* Fully Completed */}
                  <div className="p-3.5 bg-white border border-[#F1E8DF] rounded-xl shadow-xs">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      FULLY COMPLETED
                    </div>
                    <div className="text-base font-extrabold text-[#0F172A]">
                      {activePreset.stats.completed}
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="p-3.5 bg-white border border-[#F1E8DF] rounded-xl shadow-xs">
                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      IN PROGRESS
                    </div>
                    <div className="text-base font-extrabold text-[#0F172A]">
                      {activePreset.stats.inProgress}
                    </div>
                  </div>
                </div>

                {/* 3. AI ANALYTICAL DIAGNOSIS BANNER */}
                <div className="p-3.5 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl flex items-start gap-2.5 text-xs text-[#9A3412]">
                  <Sparkles className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    <strong className="font-bold text-[#C2410C]">AI Analytical Diagnosis: </strong>
                    {activePreset.diagnosis}
                  </div>
                </div>

                {/* 4. FILTERED DATA DRILL-DOWN TABLE */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#EA580C]" />
                      Filtered Database Records ({activePreset.tableData.length})
                    </span>
                    <button
                      onClick={() => setShowDataTable(!showDataTable)}
                      className="text-xs text-[#EA580C] font-semibold hover:underline"
                    >
                      {showDataTable ? 'Collapse Table' : 'Expand Table'}
                    </button>
                  </div>

                  {showDataTable && (
                    <div className="overflow-x-auto border border-[#E2E8F0] rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] uppercase tracking-wider text-[10px] font-bold">
                          <tr>
                            <th className="py-2.5 px-3">Student ID</th>
                            <th className="py-2.5 px-3">Name</th>
                            <th className="py-2.5 px-3">Section</th>
                            <th className="py-2.5 px-3">Experiment Module</th>
                            <th className="py-2.5 px-3">Viva Score / Metric</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F5F9] text-[#334155]">
                          {activePreset.tableData.map(row => (
                            <tr key={row.id} className="hover:bg-[#F8FAFC] transition">
                              <td className="py-2 px-3 font-mono font-semibold text-[#0F172A]">{row.id}</td>
                              <td className="py-2 px-3 font-medium">{row.name}</td>
                              <td className="py-2 px-3 text-[#64748B]">{row.group}</td>
                              <td className="py-2 px-3">{row.metric}</td>
                              <td className="py-2 px-3 font-bold font-mono">{row.score}</td>
                              <td className="py-2 px-3">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    row.status === 'Completed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : row.status === 'Struggling'
                                      ? 'bg-red-50 text-red-700 border border-red-200'
                                      : row.status === 'Flagged'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                                  }`}
                                >
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM QUERY INPUT BAR */}
          <div className="pt-6 sticky bottom-0 bg-[#FDFBF9] pb-2 z-10">
            <form
              onSubmit={handleCustomQuery}
              className="relative flex items-center bg-white border border-[#E2E8F0] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden focus-within:ring-2 focus-within:ring-[#F97316] focus-within:border-transparent transition"
            >
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask any custom question about student struggles, scores, completion, or viva..."
                className="flex-1 pl-4 pr-24 py-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Query</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDataAssistantPage;
