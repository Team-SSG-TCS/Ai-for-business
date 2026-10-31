import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core } from 'cytoscape';
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw,
  Layers, ShieldAlert, Smartphone, Globe,
  User, CreditCard, Building2, Info, Eye
} from 'lucide-react';

export interface CytoscapeGraphProps {
  networkId?: string;
  focusEntityId?: string | null;
  onSelectEntity?: (entity: any) => void;
  customElements?: cytoscape.ElementsDefinition;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  networkId = 'NET-004',
  focusEntityId,
  onSelectEntity,
  customElements
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
  const [activeLayout, setActiveLayout] = useState<'cose' | 'breadthfirst' | 'concentric'>('cose');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance if re-initializing
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    // Graph Elements for NET-004 (Mule Ring & Circular Layering)
    const elements: cytoscape.ElementsDefinition = {
      nodes: [
        // Customers
        { data: { id: 'CUST-004', label: 'Vikram Mehra', type: 'customer', score: 92, role: 'Origin Ring Orchestrator', kyc: 'PAN: ABCPM****F' } },
        { data: { id: 'CUST-019', label: 'Priya Sharma', type: 'customer', score: 88, role: 'Secondary Intermediary', kyc: 'PAN: BKPPS****K' } },
        { data: { id: 'CUST-042', label: 'Amit Verma', type: 'customer', score: 85, role: 'Layering Mule', kyc: 'PAN: ALMPV****L' } },
        { data: { id: 'CUST-088', label: 'Ramesh Chawla', type: 'customer', score: 79, role: 'Cash Out Proxy', kyc: 'PAN: CKHPC****M' } },

        // Accounts
        { data: { id: 'ACC-9004', label: 'HDFC: 5010049281', type: 'account', balance: '₹14,20,000', bank: 'HDFC Bank', status: 'Flagged Hold' } },
        { data: { id: 'ACC-9019', label: 'ICICI: 0012059381', type: 'account', balance: '₹4,80,000', bank: 'ICICI Bank', status: 'Active Watch' } },
        { data: { id: 'ACC-9042', label: 'SBI: 3829104829', type: 'account', balance: '₹2,10,000', bank: 'State Bank of India', status: 'Active Watch' } },
        { data: { id: 'ACC-9088', label: 'Axis: 9190284729', type: 'account', balance: '₹85,000', bank: 'Axis Bank', status: 'Restricted' } },

        // Physical / Virtual Hardware
        { data: { id: 'DEV-F8821', label: 'Redmi Note 10S (Bluestacks Emulator)', type: 'device', os: 'Android 11 (QEMU_VM)', risk: 'Critical', indicator: 'build.prop qemu=1' } },

        // Network / IP Infrastructure
        { data: { id: 'IP-TOR-01', label: '185.220.101.45 (Tor Exit Node)', type: 'ip', isp: 'M247 Europe VPS', risk: 'High' } },
        { data: { id: 'IP-VPN-02', label: '103.21.244.12 (Mullvad VPN)', type: 'ip', isp: 'DataCamp Hosting', risk: 'High' } },

        // Merchants / Liquidation Endpoints
        { data: { id: 'MER-301', label: 'Zaveri Bullion Mumbai', type: 'merchant', category: 'High-Value Bullion / Gold', volume: '₹12.4L in 24h' } }
      ],
      edges: [
        // Ownership links
        { data: { id: 'e-c1-a1', source: 'CUST-004', target: 'ACC-9004', label: 'Owns Account', type: 'ownership' } },
        { data: { id: 'e-c2-a2', source: 'CUST-019', target: 'ACC-9019', label: 'Owns Account', type: 'ownership' } },
        { data: { id: 'e-c3-a3', source: 'CUST-042', target: 'ACC-9042', label: 'Owns Account', type: 'ownership' } },
        { data: { id: 'e-c4-a4', source: 'CUST-088', target: 'ACC-9088', label: 'Owns Account', type: 'ownership' } },

        // Shared device ties (critical syndicate clue)
        { data: { id: 'e-dev-c1', source: 'DEV-F8821', target: 'CUST-004', label: 'Shared Login (IMEI: 869402...)', type: 'device-binding' } },
        { data: { id: 'e-dev-c2', source: 'DEV-F8821', target: 'CUST-019', label: 'Shared Login (IMEI: 869402...)', type: 'device-binding' } },
        { data: { id: 'e-dev-c3', source: 'DEV-F8821', target: 'CUST-042', label: 'Shared Login (IMEI: 869402...)', type: 'device-binding' } },

        // IP Network routing
        { data: { id: 'e-ip1-dev', source: 'IP-TOR-01', target: 'DEV-F8821', label: 'Tunnel Routing', type: 'network' } },
        { data: { id: 'e-ip2-dev', source: 'IP-VPN-02', target: 'DEV-F8821', label: 'Proxy Gateway', type: 'network' } },

        // Transaction flows
        { data: { id: 'e-tx1', source: 'ACC-9004', target: 'ACC-9019', label: '₹5,00,000 (IMPS)', amount: 500000, type: 'transaction', velocity: '00:14m' } },
        { data: { id: 'e-tx2', source: 'ACC-9004', target: 'ACC-9042', label: '₹5,00,000 (RTGS)', amount: 500000, type: 'transaction', velocity: '00:18m' } },
        { data: { id: 'e-tx3', source: 'ACC-9019', target: 'MER-301', label: '₹3,50,000 (Bullion POS)', amount: 350000, type: 'transaction', velocity: '00:08m' } },
        { data: { id: 'e-tx4', source: 'ACC-9042', target: 'ACC-9088', label: '₹3,50,000 (UPI)', amount: 350000, type: 'transaction', velocity: '00:06m' } },
        // Circular Return Loop (Key evidence)
        { data: { id: 'e-tx5-return', source: 'ACC-9088', target: 'ACC-9004', label: '₹1,50,000 (Circular Loop)', amount: 150000, type: 'circular-transaction', isCircular: true } }
      ]
    };

    const cy = cytoscape({
      container: containerRef.current,
      elements: (customElements && customElements.nodes && customElements.nodes.length > 0) ? customElements : elements,
      style: [
        // Default Node Styling (Clean light enterprise)
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'color': '#0F172A',
            'text-background-opacity': 0.85,
            'text-background-color': '#FFFFFF',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'border-width': 2,
            'border-color': '#CBD5E1',
            'background-color': '#FFFFFF',
            'transition-property': 'background-color, border-color, border-width, width, height',
            'transition-duration': 0.2
          }
        },
        // Customer Nodes (Emerald Green Accent)
        {
          selector: 'node[type="customer"]',
          style: {
            'shape': 'ellipse',
            'width': 44,
            'height': 44,
            'background-color': '#ECFDF5',
            'border-color': '#059669',
            'border-width': 3
          }
        },
        // Account Nodes (Blue)
        {
          selector: 'node[type="account"]',
          style: {
            'shape': 'round-rectangle',
            'width': 42,
            'height': 42,
            'background-color': '#EFF6FF',
            'border-color': '#2563EB',
            'border-width': 2.5
          }
        },
        // Hardware / Device Nodes (Amber/Red)
        {
          selector: 'node[type="device"]',
          style: {
            'shape': 'diamond',
            'width': 46,
            'height': 46,
            'background-color': '#FFFBEB',
            'border-color': '#D97706',
            'border-width': 3
          }
        },
        // IP / Proxy Nodes (Purple)
        {
          selector: 'node[type="ip"]',
          style: {
            'shape': 'hexagon',
            'width': 40,
            'height': 40,
            'background-color': '#FAF5FF',
            'border-color': '#7C3AED',
            'border-width': 2.5
          }
        },
        // Merchant Nodes (Rose)
        {
          selector: 'node[type="merchant"]',
          style: {
            'shape': 'tag',
            'width': 42,
            'height': 42,
            'background-color': '#FFF1F2',
            'border-color': '#E11D48',
            'border-width': 2.5
          }
        },
        // Default Edge Styling
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#CBD5E1',
            'target-arrow-color': '#94A3B8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'font-family': 'JetBrains Mono, monospace',
            'color': '#475569',
            'text-background-opacity': 0.9,
            'text-background-color': '#FFFFFF',
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle'
          }
        },
        // Transaction Edges
        {
          selector: 'edge[type="transaction"]',
          style: {
            'width': 3,
            'line-color': '#059669',
            'target-arrow-color': '#059669',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 1.2
          }
        },
        // Circular Return Edge (Red Highlight)
        {
          selector: 'edge[isCircular]',
          style: {
            'width': 3.5,
            'line-color': '#DC2626',
            'line-style': 'dashed',
            'target-arrow-color': '#DC2626',
            'target-arrow-shape': 'triangle',
            'color': '#DC2626',
            'font-weight': 700
          }
        },
        // Device Binding Edges (Dashed Amber)
        {
          selector: 'edge[type="device-binding"]',
          style: {
            'width': 2,
            'line-color': '#D97706',
            'line-style': 'dashed',
            'target-arrow-color': '#D97706'
          }
        },
        // Active / Selected Node State
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#0F172A'
          }
        }
      ],
      layout: {
        name: activeLayout,
        animate: true,
        animationDuration: 400
      }
    });

    // Handle node selection
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      setSelectedNodeData(data);
      if (onSelectEntity) {
        onSelectEntity(data);
      }

      // Highlight 1-hop neighborhood
      cy.elements().removeClass('dimmed highlighted');
      const neighborhood = node.neighborhood().add(node);
      cy.elements().not(neighborhood).addClass('dimmed');
      neighborhood.addClass('highlighted');
    });

    // Reset on background tap
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNodeData(null);
        cy.elements().removeClass('dimmed highlighted');
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [activeLayout, networkId]);

  // Handle Zoom & Pan Controls
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 35);
  const handleReset = () => {
    cyRef.current?.reset();
    cyRef.current?.fit(undefined, 35);
    setSelectedNodeData(null);
  };

  const changeLayout = (layoutName: 'cose' | 'breadthfirst' | 'concentric') => {
    setActiveLayout(layoutName);
    cyRef.current?.layout({ name: layoutName, animate: true, animationDuration: 400 }).run();
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden flex flex-col h-[520px] relative">
      {/* Top Toolbar */}
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#059669]" />
            <span>Interactive Financial Relationship Graph</span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] font-medium border border-[#A7F3D0]">
            Cytoscape.js Engine
          </span>
        </div>

        {/* Layout Switcher & Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white border border-[#CBD5E1] rounded-lg p-0.5">
            <button
              onClick={() => changeLayout('cose')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeLayout === 'cose' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Force Directed
            </button>
            <button
              onClick={() => changeLayout('breadthfirst')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeLayout === 'breadthfirst' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Hierarchy Flow
            </button>
            <button
              onClick={() => changeLayout('concentric')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                activeLayout === 'concentric' ? 'bg-[#059669] text-white shadow-xs' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Concentric Rings
            </button>
          </div>

          <div className="h-4 w-px bg-[#E2E8F0] mx-1" />

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 bg-white border border-[#CBD5E1] rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFit}
              className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
              title="Fit to Screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cytoscape Canvas Area */}
      <div className="flex-1 relative bg-white">
        <div ref={containerRef} className="w-full h-full" />

        {/* Selected Entity Inspector Float Drawer */}
        {selectedNodeData && (
          <div className="absolute top-4 right-4 w-72 bg-white/95 backdrop-blur-sm border border-[#CBD5E1] rounded-xl shadow-lg p-4 text-xs animate-in fade-in slide-in-from-right-3">
            <div className="flex items-start justify-between pb-2 border-b border-[#E2E8F0] mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                  {selectedNodeData.type} Node Details
                </span>
                <h4 className="text-sm font-bold text-[#0F172A] mt-0.5">
                  {selectedNodeData.label}
                </h4>
              </div>
              <button
                onClick={() => setSelectedNodeData(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#475569]">
              <div className="flex justify-between">
                <span>Node Identifier:</span>
                <span className="font-mono font-bold text-[#0F172A]">{selectedNodeData.id}</span>
              </div>
              {selectedNodeData.role && (
                <div className="flex justify-between">
                  <span>Assigned Role:</span>
                  <span className="font-semibold text-rose-600">{selectedNodeData.role}</span>
                </div>
              )}
              {selectedNodeData.score && (
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-mono font-bold text-rose-600">{selectedNodeData.score}/100</span>
                </div>
              )}
              {selectedNodeData.kyc && (
                <div className="flex justify-between">
                  <span>KYC Record:</span>
                  <span className="font-mono text-[#0F172A]">{selectedNodeData.kyc}</span>
                </div>
              )}
              {selectedNodeData.balance && (
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className="font-mono font-bold text-[#059669]">{selectedNodeData.balance}</span>
                </div>
              )}
              {selectedNodeData.bank && (
                <div className="flex justify-between">
                  <span>Institution:</span>
                  <span className="text-[#0F172A]">{selectedNodeData.bank}</span>
                </div>
              )}
              {selectedNodeData.indicator && (
                <div className="p-2 bg-rose-50 border border-rose-200 rounded text-rose-700 font-mono text-[11px] mt-2">
                  ⚠️ {selectedNodeData.indicator}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Graph Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border border-[#E2E8F0] rounded-lg px-3 py-2 text-[11px] flex flex-wrap items-center gap-3 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ECFDF5] border-2 border-[#059669]" />
            <span className="text-[#475569] font-medium">Customer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#EFF6FF] border-2 border-[#2563EB]" />
            <span className="text-[#475569] font-medium">Bank Account</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rotate-45 bg-[#FFFBEB] border-2 border-[#D97706]" />
            <span className="text-[#475569] font-medium">Device / Emulator</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FAF5FF] border-2 border-[#7C3AED]" />
            <span className="text-[#475569] font-medium">IP / Proxy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0 border-t-2 border-dashed border-[#DC2626]" />
            <span className="text-rose-600 font-semibold">Circular Loop Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
};
