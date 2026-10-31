import React, { useState } from 'react';
import { PageId } from '../components/layout/AppLayout';
import {
  Database, UploadCloud, FileText, CheckCircle2,
  AlertTriangle, Play, RefreshCw, ArrowRight,
  Layers, Check, Clock, Plus, ShieldCheck, Sparkles
} from 'lucide-react';

interface DataManagementPageProps {
  onNavigate: (page: PageId, meta?: any) => void;
}

export const DataManagementPage: React.FC<DataManagementPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<string>('Transactions Stream');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [ingestionCompleted, setIngestionCompleted] = useState(false);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    senderName: 'Rajesh Kumar',
    senderAccount: 'ACC-9120',
    receiverName: 'Apex Traders Mumbai',
    receiverAccount: 'ACC-9042',
    amount: '450000',
    channel: 'IMPS',
    ipAddress: '185.220.101.45',
    deviceModel: 'Redmi Note 10S'
  });
  const [manualSuccess, setManualSuccess] = useState(false);

  // Ingested files history
  const [ingestedBatches, setIngestedBatches] = useState([
    { id: 'BATCH-2026-1031', name: 'core_cbs_transactions_oct2026.csv', category: 'Transactions', size: '48.2 MB', records: 24856, uploadedAt: '2026-10-31 08:30 IST', status: 'Enriched & Scored' },
    { id: 'BATCH-2026-1030', name: 'upi_switch_telemetry_batch4.xlsx', category: 'UPI Switched Logs', size: '12.4 MB', records: 18200, uploadedAt: '2026-10-30 23:15 IST', status: 'Enriched & Scored' },
    { id: 'BATCH-2026-1029', name: 'kyc_pan_aadhaar_registry.json', category: 'KYC Profiles', size: '8.1 MB', records: 4500, uploadedAt: '2026-10-29 14:10 IST', status: 'Entity Resolved' }
  ]);

  const handleSimulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setIngestionCompleted(true);
          setIngestedBatches(prevBatches => [
            {
              id: `BATCH-${Date.now().toString().slice(-4)}`,
              name: `new_ingested_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.csv`,
              category: selectedCategory,
              size: '14.8 MB',
              records: 1250,
              uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
              status: 'Enriched & Scored'
            },
            ...prevBatches
          ]);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualSuccess(true);
    setIngestedBatches(prev => [
      {
        id: `MANUAL-${Date.now().toString().slice(-4)}`,
        name: `Single Ingestion • ${manualForm.senderAccount} → ${manualForm.receiverAccount}`,
        category: 'Live Ingestion',
        size: '1.2 KB',
        records: 1,
        uploadedAt: 'Just now',
        status: 'Enriched & Scored'
      },
      ...prev
    ]);
    setTimeout(() => {
      setManualSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] flex items-center gap-2.5">
            <span>Data Ingestion & Schema Management</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-mono font-semibold">
              ETL & Enrichment Pipeline
            </span>
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Ingest financial transactions, account ledgers, and device telemetry. Ingested data is automatically parsed, resolved into entity identities, and scored for risk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('faculty-assistant')}
            className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Faculty Data Assistant (NL Filter)</span>
          </button>
          <button
            onClick={() => onNavigate('transactions')}
            className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Go to Transactions List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          Option A: Batch File Ingestion (CSV / XLSX / JSON)
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'manual'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
          }`}
        >
          Option B: Instant Single Transaction Ingestion Form
        </button>
      </div>

      {/* Tab 1: File Ingestion */}
      {activeTab === 'upload' && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#059669]" />
                <span>Upload Financial Dataset Batch</span>
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Supports automated delimiter detection, column header normalization, and encryption in transit.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['Transactions Stream', 'Account Master', 'Device Logs', 'KYC Registry'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#059669] text-white font-bold shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#CBD5E1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-[#CBD5E1] hover:border-[#059669] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-[#F8FAFC] hover:bg-[#ECFDF5]/30 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>

            <h3 className="text-sm font-bold text-[#0F172A]">
              Click or drag and drop your <span className="text-[#059669] font-bold">{selectedCategory}</span> file here
            </h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-md">
              Supports CSV, XLSX, JSON, or ISO 20022 XML formats. Maximum file size: 250 MB.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button className="px-4 py-2 bg-white group-hover:bg-[#059669] text-[#334155] group-hover:text-white rounded-lg text-xs font-semibold border border-[#CBD5E1] transition-colors shadow-xs">
                Browse System Files
              </button>
            </div>

            {uploadProgress !== null && (
              <div className="w-full max-w-md mt-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#475569] font-medium">Validating schema & computing risk scores...</span>
                  <span className="font-mono text-[#059669] font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {ingestionCompleted && (
            <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                <div>
                  <span className="text-sm font-bold text-[#065F46] block">Ingestion & Enrichment Pipeline Complete</span>
                  <span className="text-xs text-[#065F46]">
                    Successfully ingested and resolved 1,250 new transaction records into the live financial graph.
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('transactions')}
                className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>View in Transactions List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Single Transaction Manual Ingestion Form */}
      {activeTab === 'manual' && (
        <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#059669]" />
              <span>Direct Core Banking Transaction Ingestion</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Enter individual wire or payment details for immediate pipeline execution, anomaly identification, and scoring.
            </p>
          </div>

          {manualSuccess && (
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#065F46] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>Transaction successfully ingested and passed through the 9-stage investigation pipeline!</span>
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Sender Customer Name</label>
                <input
                  type="text"
                  value={manualForm.senderName}
                  onChange={e => setManualForm({ ...manualForm, senderName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:border-[#059669] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Sender Account ID (Core Banking)</label>
                <input
                  type="text"
                  value={manualForm.senderAccount}
                  onChange={e => setManualForm({ ...manualForm, senderAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] font-mono focus:border-[#059669] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Receiver Beneficiary Name</label>
                <input
                  type="text"
                  value={manualForm.receiverName}
                  onChange={e => setManualForm({ ...manualForm, receiverName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:border-[#059669] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Receiver Account ID</label>
                <input
                  type="text"
                  value={manualForm.receiverAccount}
                  onChange={e => setManualForm({ ...manualForm, receiverAccount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] font-mono focus:border-[#059669] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Amount (INR ₹)</label>
                <input
                  type="number"
                  value={manualForm.amount}
                  onChange={e => setManualForm({ ...manualForm, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] font-mono font-bold focus:border-[#059669] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Payment Channel</label>
                <select
                  value={manualForm.channel}
                  onChange={e => setManualForm({ ...manualForm, channel: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:border-[#059669] outline-none"
                >
                  <option value="IMPS">IMPS (Immediate Payment Service)</option>
                  <option value="UPI">UPI (Unified Payments Interface)</option>
                  <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
                  <option value="NEFT">NEFT (National Electronic Funds Transfer)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Client IP Address</label>
                <input
                  type="text"
                  value={manualForm.ipAddress}
                  onChange={e => setManualForm({ ...manualForm, ipAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] font-mono focus:border-[#059669] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">Device Model / User-Agent</label>
                <input
                  type="text"
                  value={manualForm.deviceModel}
                  onChange={e => setManualForm({ ...manualForm, deviceModel: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:border-[#059669] outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ingest & Calculate Risk Score</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ingestion Stream & History Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <h3 className="text-sm font-bold text-[#0F172A]">Recent Ingestion Batches & Datasets</h3>
          <p className="text-xs text-[#64748B]">Audit log of all financial streams received and processed by NEXUS.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-bold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Batch ID</th>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Records Parsed</th>
                <th className="py-3 px-4">Ingested At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {ingestedBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-mono font-bold text-[#0F172A]">{batch.id}</td>
                  <td className="py-3 px-4 font-medium text-[#0F172A] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>{batch.name}</span>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">{batch.category}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{batch.size}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#2563EB]">{batch.records.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">{batch.uploadedAt}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {batch.status}
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
