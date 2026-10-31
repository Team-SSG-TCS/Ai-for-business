import React, { useState } from 'react';
import {
  UploadCloud, FileText, CheckCircle2, Clock, AlertCircle,
  ArrowRight, Play, RefreshCw, Eye, Database, FileSpreadsheet,
  Check, Settings2, Sparkles, Filter, ChevronDown
} from 'lucide-react';
import { PageId } from '../components/layout/AppLayout';

interface DataManagementPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  category: string;
  size: string;
  records: number;
  uploadedAt: string;
  status: 'Ready' | 'Processing' | 'Validated' | 'Failed';
}

export const DataManagementPage: React.FC<DataManagementPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Transactions');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isProcessingPipeline, setIsProcessingPipeline] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(5); // all completed initially
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(false);

  const categories = [
    'Customers',
    'Accounts',
    'Transactions',
    'Beneficiaries',
    'Merchants',
    'Device Logs',
    'Login Sessions',
    'IP Intelligence',
    'Historical Alerts'
  ];

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: 'FILE-101', name: 'core_banking_txns_oct2026.csv', category: 'Transactions', size: '14.2 MB', records: 24856, uploadedAt: '2026-10-31 08:30:15 IST', status: 'Validated' },
    { id: 'FILE-102', name: 'device_sensor_telemetry.parquet', category: 'Device Logs', size: '28.4 MB', records: 84120, uploadedAt: '2026-10-31 08:31:02 IST', status: 'Validated' },
    { id: 'FILE-103', name: 'kyc_customer_registry.xlsx', category: 'Customers', size: '3.1 MB', records: 12500, uploadedAt: '2026-10-31 08:32:44 IST', status: 'Validated' },
    { id: 'FILE-104', name: 'ip_geo_intelligence_feed.json', category: 'IP Intelligence', size: '8.7 MB', records: 41200, uploadedAt: '2026-10-31 08:33:10 IST', status: 'Validated' },
  ]);

  const [schemaMappings, setSchemaMappings] = useState([
    { uploaded: 'cust_id', standard: 'customer_id', status: 'Matched' },
    { uploaded: 'acc_no', standard: 'account_number', status: 'Matched' },
    { uploaded: 'trans_amt', standard: 'transaction_amount', status: 'Matched' },
    { uploaded: 'trans_date', standard: 'transaction_timestamp', status: 'Matched' },
    { uploaded: 'device_hash', standard: 'device_fingerprint', status: 'Suggested' },
    { uploaded: 'ip_addr_v4', standard: 'ip_address', status: 'Matched' },
    { uploaded: 'geo_city_code', standard: 'geolocation_city', status: 'Suggested' },
  ]);

  const standardFieldOptions = [
    'customer_id',
    'account_number',
    'transaction_amount',
    'transaction_timestamp',
    'device_fingerprint',
    'ip_address',
    'geolocation_city',
    'beneficiary_id',
    'merchant_category_code',
    'risk_indicator_score'
  ];

  // Pipeline Steps
  const pipelineSteps = [
    { title: 'Upload', status: 'Completed', duration: '1.2s', records: '24,856' },
    { title: 'Validation', status: 'Completed', duration: '2.4s', records: '24,856 valid (0 rejected)' },
    { title: 'Normalization', status: 'Completed', duration: '3.1s', records: 'Cleaned ISO-8601 & INR' },
    { title: 'Entity Resolution', status: 'Completed', duration: '4.8s', records: '100 Customers / 120 Accounts' },
    { title: 'Graph Construction', status: 'Completed', duration: '6.2s', records: '480 Nodes / 1,240 Edges' },
    { title: 'Detection', status: 'Completed', duration: '5.5s', records: '38 Suspicious Networks Discovered' },
  ];

  const handleSimulateUpload = () => {
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            setUploadedFiles(prev => [
              {
                id: `FILE-${Date.now().toString().slice(-3)}`,
                name: `new_financial_dataset_${selectedCategory.toLowerCase()}.csv`,
                category: selectedCategory,
                size: '9.4 MB',
                records: 18450,
                uploadedAt: new Date().toLocaleTimeString() + ' IST',
                status: 'Validated'
              },
              ...prev
            ]);
          }, 400);
          return 100;
        }
        return p + 25;
      });
    }, 200);
  };

  const handleRunAnalysis = () => {
    setIsProcessingPipeline(true);
    setActivePipelineStep(0);
    setAnalysisCompleted(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActivePipelineStep(step);
      if (step >= 5) {
        clearInterval(interval);
        setIsProcessingPipeline(false);
        setAnalysisCompleted(true);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Data Management & Ingestion</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Pipeline Ready
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Import financial records and prepare them for network intelligence graph construction and anomaly analysis.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isProcessingPipeline}
          className="px-5 py-2.5 bg-[#00D06C] hover:bg-[#05B860] disabled:opacity-50 text-black rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#00D06C]/20 transition-all cursor-pointer"
        >
          {isProcessingPipeline ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Processing Intelligence Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Run Intelligence Analysis</span>
            </>
          )}
        </button>
      </div>

      {analysisCompleted && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-sm font-bold text-white block">Intelligence Pipeline Analysis Complete</span>
              <span className="text-xs text-emerald-300">
                Processed 24,856 transactions, constructed graph relationships, and isolated 38 high-risk network clusters.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('network-intelligence')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Explore Network Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Large Drag & Drop Upload Section */}
      <div className="bg-[#131B2B] p-6 rounded-xl border border-[#273449] shadow-lg">
        {/* Category Selector Tabs */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-400 block mb-2">Select Dataset Target Category:</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#00D06C] text-black font-bold shadow-md shadow-[#00D06C]/20'
                    : 'bg-[#08090A] text-gray-400 hover:text-white border border-[#1C2420]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        <div
          onClick={handleSimulateUpload}
          className="border-2 border-dashed border-[#1C2420] hover:border-[#00D06C]/70 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#08090A]/60 hover:bg-[#08090A] transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-[#0D2619] border border-[#00D06C]/30 flex items-center justify-center text-[#00D06C] mb-3 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-sm font-bold text-white">
            Drag and drop your <span className="text-[#00D06C] font-semibold">{selectedCategory}</span> dataset here
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            Supports CSV, XLSX, or JSON files. Automated delimiter detection, header validation, and encryption in transit.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button className="px-4 py-2 bg-[#131715] group-hover:bg-[#00D06C] text-gray-200 group-hover:text-black rounded-lg text-xs font-semibold border border-[#1C2420] transition-colors cursor-pointer">
              Browse Files
            </button>
            <span className="text-[11px] text-gray-500">Max file size: 250 MB per batch</span>
          </div>

          {uploadProgress !== null && (
            <div className="w-full max-w-md mt-6">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Uploading & Validating schema...</span>
                <span className="font-mono text-[#00D06C] font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00D06C] transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Processing Pipeline Visualization */}
      <div className="bg-[#131B2B] p-5 rounded-xl border border-[#273449] shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
          <div>
            <h2 className="text-sm font-bold text-white">Data Processing & Intelligence Pipeline</h2>
            <p className="text-xs text-gray-400">Step-by-step ingestion lifecycle from raw file to graph community detection.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800">
            Automated Ingestion Engine v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {pipelineSteps.map((step, idx) => {
            const isCompleted = idx <= activePipelineStep;
            const isCurrent = idx === activePipelineStep && isProcessingPipeline;

            return (
              <div
                key={step.title}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#0D2619] border-[#00D06C] ring-1 ring-[#00D06C]'
                    : isCompleted
                    ? 'bg-[#08090A] border-[#1C2420]'
                    : 'bg-[#08090A]/40 border-gray-800/40 opacity-40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">0{idx + 1}</span>
                    {isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-[#00D06C] animate-spin" />
                    ) : isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-white mt-1.5">{step.title}</div>
                  <div className="text-[10px] text-gray-400 mt-1 leading-tight">{step.records}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#182235] flex items-center justify-between text-[9px] font-mono text-gray-500">
                  <span>Latency</span>
                  <span className="text-gray-300">{step.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row: Schema Mapping & Dataset Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schema Mapping Interface */}
        <div className="bg-[#131B2B] p-5 rounded-xl border border-[#273449] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
              <div>
                <h2 className="text-sm font-bold text-white">Schema Field Mapping</h2>
                <p className="text-xs text-gray-400">Map uploaded column headers into the standardized NEXUS financial ontology.</p>
              </div>
              <button className="text-xs text-[#00D06C] hover:underline font-semibold flex items-center gap-1 cursor-pointer">
                <RefreshCw className="w-3 h-3" />
                <span>Auto-Detect</span>
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D110F] text-gray-400 font-semibold border-b border-[#1C2420]">
                  <tr>
                    <th className="py-2.5 px-3">Uploaded Column</th>
                    <th className="py-2.5 px-3">Standard Field</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2420]">
                  {schemaMappings.map((row, index) => (
                    <tr key={row.uploaded} className="hover:bg-[#131715]">
                      <td className="py-2.5 px-3 font-mono font-medium text-white">{row.uploaded}</td>
                      <td className="py-2.5 px-3">
                        <select
                          value={row.standard}
                          onChange={e => {
                            const newMappings = [...schemaMappings];
                            newMappings[index].standard = e.target.value;
                            newMappings[index].status = 'Matched';
                            setSchemaMappings(newMappings);
                          }}
                          className="bg-[#08090A] text-xs text-[#00D06C] border border-[#1C2420] rounded px-2 py-1 focus:border-[#00D06C] font-mono"
                        >
                          {standardFieldOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            row.status === 'Matched'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
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
          </div>

          <div className="mt-4 pt-3 border-t border-[#182235] flex items-center justify-between text-xs text-gray-400">
            <span>7 of 7 fields mapped (100% confidence)</span>
            <button className="px-3 py-1 bg-[#182235] hover:bg-[#1E2D45] text-white rounded border border-[#273449] font-medium">
              Save Schema Mapping
            </button>
          </div>
        </div>

        {/* Dataset Preview Table */}
        <div className="bg-[#131B2B] p-5 rounded-xl border border-[#273449] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#273449]">
              <div>
                <h2 className="text-sm font-bold text-white">Dataset Preview (First 5 Rows)</h2>
                <p className="text-xs text-gray-400">Parsed sample records from core_banking_txns_oct2026.csv</p>
              </div>
              <span className="text-[11px] font-mono text-gray-400">Total: 24,856 rows</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0D1320] text-gray-400 border-b border-[#273449]">
                  <tr>
                    <th className="py-2.5 px-2">cust_id</th>
                    <th className="py-2.5 px-2">acc_no</th>
                    <th className="py-2.5 px-2">trans_amt</th>
                    <th className="py-2.5 px-2">device_hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182235] text-gray-300">
                  <tr className="hover:bg-[#182235]">
                    <td className="py-2 px-2 text-white">CUST-1004</td>
                    <td className="py-2 px-2">ACC-9004</td>
                    <td className="py-2 px-2 text-emerald-400 font-bold">₹10,00,000</td>
                    <td className="py-2 px-2 text-gray-400 truncate max-w-[100px]">fp_sha256_9841</td>
                  </tr>
                  <tr className="hover:bg-[#182235]">
                    <td className="py-2 px-2 text-white">CUST-1019</td>
                    <td className="py-2 px-2">ACC-9019</td>
                    <td className="py-2 px-2 text-emerald-400 font-bold">₹6,00,000</td>
                    <td className="py-2 px-2 text-gray-400 truncate max-w-[100px]">fp_sha256_9841</td>
                  </tr>
                  <tr className="hover:bg-[#182235]">
                    <td className="py-2 px-2 text-white">CUST-1042</td>
                    <td className="py-2 px-2">ACC-9042</td>
                    <td className="py-2 px-2 text-emerald-400 font-bold">₹4,00,000</td>
                    <td className="py-2 px-2 text-gray-400 truncate max-w-[100px]">fp_sha256_9841</td>
                  </tr>
                  <tr className="hover:bg-[#182235]">
                    <td className="py-2 px-2 text-white">CUST-1077</td>
                    <td className="py-2 px-2">ACC-9077</td>
                    <td className="py-2 px-2 text-emerald-400 font-bold">₹5,50,000</td>
                    <td className="py-2 px-2 text-gray-400 truncate max-w-[100px]">fp_sha256_9841</td>
                  </tr>
                  <tr className="hover:bg-[#182235]">
                    <td className="py-2 px-2 text-white">CUST-1008</td>
                    <td className="py-2 px-2">ACC-9008</td>
                    <td className="py-2 px-2 text-cyan-400 font-bold">₹85,000</td>
                    <td className="py-2 px-2 text-gray-400 truncate max-w-[100px]">fp_sha256_1120</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182235] text-[11px] text-gray-400 flex items-center justify-between">
            <span>Encoding: UTF-8 · Delimiter: Comma (,)</span>
            <span className="text-emerald-400 font-medium">Validation: 0 schema errors</span>
          </div>
        </div>
      </div>

      {/* Uploaded File History */}
      <div className="bg-[#131B2B] rounded-xl border border-[#273449] shadow-lg overflow-hidden">
        <div className="p-4 border-b border-[#273449] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Uploaded File Ingestion History</h2>
            <p className="text-xs text-gray-400">All financial batches stored in the compliance data lake.</p>
          </div>
          <span className="text-xs text-gray-400 font-mono">{uploadedFiles.length} files ingested</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1320] text-gray-400 font-semibold border-b border-[#273449]">
              <tr>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Records Parsed</th>
                <th className="py-3 px-4">Uploaded At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182235]">
              {uploadedFiles.map(file => (
                <tr key={file.id} className="hover:bg-[#182235]">
                  <td className="py-3 px-4 font-mono font-medium text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00D06C] shrink-0" />
                    <span>{file.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{file.category}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{file.size}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{file.records.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono">{file.uploadedAt}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
