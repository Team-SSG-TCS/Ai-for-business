import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  ZoomIn, ZoomOut, RotateCcw, Filter, Eye, ShieldAlert,
  Smartphone, Globe, Building2, User, CreditCard, ArrowRight,
  Search, Maximize2, Layers, AlertTriangle
} from 'lucide-react';
import {
  CUSTOMERS, ACCOUNTS, DEVICES, IP_ADDRESSES, BENEFICIARIES,
  MERCHANTS, formatINR
} from '../../mock/financialData';

export type EntityType = 'Customer' | 'BankAccount' | 'Device' | 'IPAddress' | 'Beneficiary' | 'Merchant' | 'Location';

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  subType?: string;
  riskScore: number;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius: number;
  color: string;
  meta: Record<string, any>;
  collapsed?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'OWNS' | 'TRANSFERRED_TO' | 'USED_DEVICE' | 'LOGGED_IN_FROM' | 'ASSOCIATED_WITH' | 'CONNECTED_TO';
  label?: string;
  amount?: number;
  isSuspicious?: boolean;
}

interface NetworkGraphProps {
  onSelectEntity?: (node: GraphNode | null) => void;
  selectedEntityId?: string | null;
  onInvestigateNetwork?: (networkId: string) => void;
  initialNetworkId?: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  onSelectEntity,
  selectedEntityId,
  onInvestigateNetwork,
  initialNetworkId = 'NET-004'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Graph transformation state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Filters
  const [filterTypes, setFilterTypes] = useState<Record<EntityType, boolean>>({
    Customer: true,
    BankAccount: true,
    Device: true,
    IPAddress: true,
    Beneficiary: true,
    Merchant: true,
    Location: true,
  });

  const [minAmount, setMinAmount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSuspiciousOnly, setShowSuspiciousOnly] = useState<boolean>(false);
  const [highlightPathMode, setHighlightPathMode] = useState<boolean>(false);
  const [pathEndpoints, setPathEndpoints] = useState<{ start: string | null; end: string | null }>({
    start: 'CUST-1004',
    end: 'BEN-401',
  });
  const [activeCommunityHighlight, setActiveCommunityHighlight] = useState<boolean>(true);

  // Color mappings
  const typeColors: Record<EntityType, string> = {
    Customer: '#00D06C',     // Competera Electric Green
    BankAccount: '#06B6D4',  // Cyan
    Device: '#A855F7',       // Purple
    IPAddress: '#EF4444',    // Red/Critical
    Beneficiary: '#34D399',  // Mint Green
    Merchant: '#F59E0B',     // Amber
    Location: '#9CA3AF',     // Slate
  };

  // Generate Initial Graph Data
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // Core target ring (NET-004) centered at (0, 0)
    // Customers
    const cust1 = CUSTOMERS.find(c => c.id === 'CUST-1004')!;
    const cust2 = CUSTOMERS.find(c => c.id === 'CUST-1019')!;
    const cust3 = CUSTOMERS.find(c => c.id === 'CUST-1042')!;
    const cust4 = CUSTOMERS.find(c => c.id === 'CUST-1077')!;

    nodes.push(
      { id: cust1.id, label: cust1.name, type: 'Customer', riskScore: cust1.riskScore, x: -180, y: -120, radius: 24, color: typeColors.Customer, meta: cust1 },
      { id: cust2.id, label: cust2.name, type: 'Customer', riskScore: cust2.riskScore, x: 20, y: -160, radius: 22, color: typeColors.Customer, meta: cust2 },
      { id: cust3.id, label: cust3.name, type: 'Customer', riskScore: cust3.riskScore, x: 190, y: -100, radius: 22, color: typeColors.Customer, meta: cust3 },
      { id: cust4.id, label: cust4.name, type: 'Customer', riskScore: cust4.riskScore, x: 140, y: 120, radius: 22, color: typeColors.Customer, meta: cust4 }
    );

    // Accounts
    nodes.push(
      { id: 'ACC-9004', label: 'ACC-9004 (HDFC)', type: 'BankAccount', riskScore: 92, x: -140, y: 30, radius: 20, color: typeColors.BankAccount, meta: ACCOUNTS[3] },
      { id: 'ACC-9019', label: 'ACC-9019 (ICICI)', type: 'BankAccount', riskScore: 88, x: 20, y: -30, radius: 19, color: typeColors.BankAccount, meta: ACCOUNTS[18] },
      { id: 'ACC-9042', label: 'ACC-9042 (Axis)', type: 'BankAccount', riskScore: 86, x: 160, y: 20, radius: 19, color: typeColors.BankAccount, meta: ACCOUNTS[41] },
      { id: 'ACC-9077', label: 'ACC-9077 (SBI)', type: 'BankAccount', riskScore: 90, x: 30, y: 160, radius: 19, color: typeColors.BankAccount, meta: ACCOUNTS[76] },
      { id: 'ACC-9098', label: 'ACC-9098 (Kotak)', type: 'BankAccount', riskScore: 94, x: -120, y: 180, radius: 20, color: typeColors.BankAccount, meta: ACCOUNTS[97] }
    );

    // Device
    const dev = DEVICES.find(d => d.id === 'DEV-F8821')!;
    nodes.push({
      id: dev.id,
      label: 'DEV-F8821 (Redmi 10S)',
      type: 'Device',
      riskScore: 96,
      x: -40,
      y: -80,
      radius: 22,
      color: typeColors.Device,
      meta: dev
    });

    // IP Address
    const ip1 = IP_ADDRESSES.find(ip => ip.ip === '185.220.101.45')!;
    const ip2 = IP_ADDRESSES.find(ip => ip.ip === '103.21.144.12')!;
    nodes.push(
      { id: ip1.ip, label: '185.220.101.45 (NordVPN)', type: 'IPAddress', riskScore: 94, x: -280, y: -60, radius: 20, color: typeColors.IPAddress, meta: ip1 },
      { id: ip2.ip, label: '103.21.144.12 (Proxy)', type: 'IPAddress', riskScore: 86, x: -10, y: -260, radius: 18, color: typeColors.IPAddress, meta: ip2 }
    );

    // Beneficiary
    const ben1 = BENEFICIARIES[0];
    nodes.push({
      id: ben1.id,
      label: 'BEN-401 (Apex Bullion)',
      type: 'Beneficiary',
      riskScore: 95,
      x: -60,
      y: 280,
      radius: 24,
      color: typeColors.Beneficiary,
      meta: ben1
    });

    // Merchant
    const mer1 = MERCHANTS[0];
    nodes.push({
      id: mer1.id,
      label: 'MER-501 (Zaveri Gold)',
      type: 'Merchant',
      riskScore: 89,
      x: 300,
      y: 40,
      radius: 22,
      color: typeColors.Merchant,
      meta: mer1
    });

    // Location
    nodes.push({
      id: 'LOC-BKC',
      label: 'Bandra Kurla Complex Hub',
      type: 'Location',
      riskScore: 25,
      x: -260,
      y: -200,
      radius: 17,
      color: typeColors.Location,
      meta: { address: 'BKC Bandra West, Mumbai 400051' }
    });

    // Additional benign community nodes around perimeter
    nodes.push(
      { id: 'CUST-1008', label: 'Sunil Joshi', type: 'Customer', riskScore: 28, x: -380, y: 120, radius: 18, color: typeColors.Customer, meta: CUSTOMERS[7] },
      { id: 'ACC-9008', label: 'ACC-9008 (HDFC)', type: 'BankAccount', riskScore: 22, x: -440, y: 220, radius: 17, color: typeColors.BankAccount, meta: ACCOUNTS[7] },
      { id: 'DEV-F8818', label: 'DEV-F8818 (Galaxy S22)', type: 'Device', riskScore: 20, x: -320, y: 240, radius: 17, color: typeColors.Device, meta: DEVICES[8] },
      { id: 'CUST-1033', label: 'Kunal Chopra', type: 'Customer', riskScore: 78, x: 380, y: -160, radius: 19, color: typeColors.Customer, meta: CUSTOMERS[32] },
      { id: 'DEV-F8834', label: 'DEV-F8834 (QEMU VM)', type: 'Device', riskScore: 90, x: 440, y: -60, radius: 19, color: typeColors.Device, meta: DEVICES[24] }
    );

    // EDGES - Relationships
    // 1. OWNS
    edges.push(
      { id: 'E-OWN-1', source: 'CUST-1004', target: 'ACC-9004', relation: 'OWNS', isSuspicious: false },
      { id: 'E-OWN-2', source: 'CUST-1019', target: 'ACC-9019', relation: 'OWNS', isSuspicious: false },
      { id: 'E-OWN-3', source: 'CUST-1042', target: 'ACC-9042', relation: 'OWNS', isSuspicious: false },
      { id: 'E-OWN-4', source: 'CUST-1077', target: 'ACC-9077', relation: 'OWNS', isSuspicious: false },
      { id: 'E-OWN-5', source: 'CUST-1008', target: 'ACC-9008', relation: 'OWNS', isSuspicious: false }
    );

    // 2. USED_DEVICE (Shared Hardware)
    edges.push(
      { id: 'E-DEV-1', source: 'CUST-1004', target: 'DEV-F8821', relation: 'USED_DEVICE', isSuspicious: true },
      { id: 'E-DEV-2', source: 'CUST-1019', target: 'DEV-F8821', relation: 'USED_DEVICE', isSuspicious: true },
      { id: 'E-DEV-3', source: 'CUST-1042', target: 'DEV-F8821', relation: 'USED_DEVICE', isSuspicious: true },
      { id: 'E-DEV-4', source: 'CUST-1077', target: 'DEV-F8821', relation: 'USED_DEVICE', isSuspicious: true },
      { id: 'E-DEV-5', source: 'CUST-1008', target: 'DEV-F8818', relation: 'USED_DEVICE', isSuspicious: false },
      { id: 'E-DEV-6', source: 'CUST-1033', target: 'DEV-F8834', relation: 'USED_DEVICE', isSuspicious: true }
    );

    // 3. LOGGED_IN_FROM (IPs)
    edges.push(
      { id: 'E-IP-1', source: 'DEV-F8821', target: '185.220.101.45', relation: 'LOGGED_IN_FROM', isSuspicious: true },
      { id: 'E-IP-2', source: 'DEV-F8821', target: '103.21.144.12', relation: 'LOGGED_IN_FROM', isSuspicious: true }
    );

    // 4. TRANSFERRED_TO (Money Trail)
    edges.push(
      { id: 'E-TX-1', source: 'ACC-9004', target: 'ACC-9019', relation: 'TRANSFERRED_TO', amount: 600000, label: '₹6,00,000 (NEFT)', isSuspicious: true },
      { id: 'E-TX-2', source: 'ACC-9004', target: 'ACC-9042', relation: 'TRANSFERRED_TO', amount: 400000, label: '₹4,00,000 (IMPS)', isSuspicious: true },
      { id: 'E-TX-3', source: 'ACC-9019', target: 'ACC-9077', relation: 'TRANSFERRED_TO', amount: 550000, label: '₹5,50,000 (IMPS)', isSuspicious: true },
      { id: 'E-TX-4', source: 'ACC-9042', target: 'MER-501', relation: 'TRANSFERRED_TO', amount: 380000, label: '₹3,80,000 (RTGS)', isSuspicious: true },
      { id: 'E-TX-5', source: 'ACC-9077', target: 'ACC-9098', relation: 'TRANSFERRED_TO', amount: 500000, label: '₹5,00,000 (RTGS)', isSuspicious: true },
      { id: 'E-TX-6', source: 'ACC-9098', target: 'BEN-401', relation: 'TRANSFERRED_TO', amount: 500000, label: '₹5,00,000 (Settlement)', isSuspicious: true },
      { id: 'E-TX-7', source: 'ACC-9098', target: 'ACC-9004', relation: 'TRANSFERRED_TO', amount: 150000, label: '₹1,50,000 (Circular Loop)', isSuspicious: true },
      { id: 'E-TX-8', source: 'ACC-9008', target: 'ACC-9004', relation: 'TRANSFERRED_TO', amount: 85000, label: '₹85,000', isSuspicious: false }
    );

    // 5. ASSOCIATED_WITH / CONNECTED_TO
    edges.push(
      { id: 'E-ASC-1', source: 'CUST-1004', target: 'LOC-BKC', relation: 'CONNECTED_TO', isSuspicious: false },
      { id: 'E-ASC-2', source: 'CUST-1019', target: 'LOC-BKC', relation: 'CONNECTED_TO', isSuspicious: false }
    );

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes);
  const [edges] = useState<GraphEdge[]>(initialEdges);

  // Sync selectedEntityId with internal state
  useEffect(() => {
    if (selectedEntityId) {
      const found = nodes.find(n => n.id === selectedEntityId);
      if (found) {
        setSelectedNode(found);
      }
    }
  }, [selectedEntityId, nodes]);

  // Center graph initially
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, []);

  // Filtered nodes and edges
  const visibleNodes = useMemo(() => {
    return nodes.filter(node => {
      if (!filterTypes[node.type]) return false;
      if (showSuspiciousOnly && node.riskScore < 70) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = node.id.toLowerCase().includes(q);
        const matchesLabel = node.label.toLowerCase().includes(q);
        if (!matchesId && !matchesLabel) return false;
      }
      return true;
    });
  }, [nodes, filterTypes, showSuspiciousOnly, searchQuery]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map(n => n.id)), [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter(edge => {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return false;
      if (minAmount > 0 && edge.amount && edge.amount < minAmount) return false;
      if (showSuspiciousOnly && !edge.isSuspicious) return false;
      return true;
    });
  }, [edges, visibleNodeIds, minAmount, showSuspiciousOnly]);

  // Find shortest path between two points if active
  const shortestPathEdges = useMemo(() => {
    if (!highlightPathMode || !pathEndpoints.start || !pathEndpoints.end) return new Set<string>();

    const start = pathEndpoints.start;
    const target = pathEndpoints.end;

    // Simple BFS
    const queue: { current: string; path: string[] }[] = [{ current: start, path: [] }];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (current === target) {
        return new Set(path);
      }

      for (const edge of visibleEdges) {
        let neighbor = '';
        if (edge.source === current) neighbor = edge.target;
        else if (edge.target === current) neighbor = edge.source;

        if (neighbor && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push({ current: neighbor, path: [...path, edge.id] });
        }
      }
    }
    return new Set<string>();
  }, [highlightPathMode, pathEndpoints, visibleEdges]);

  // Canvas render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Apply zoom & pan
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid dots
    const gridSize = 40;
    const gridRange = 2000;
    ctx.fillStyle = '#182235';
    for (let x = -gridRange; x <= gridRange; x += gridSize) {
      for (let y = -gridRange; y <= gridRange; y += gridSize) {
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }

    // Community highlight polygon
    if (activeCommunityHighlight) {
      ctx.beginPath();
      ctx.ellipse(-10, 40, 310, 260, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label for cluster
      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillText('SUSPICIOUS NETWORK CLUSTER: NET-004', -270, -210);
    }

    // Draw Edges
    const nodeMap = new Map<string, GraphNode>(visibleNodes.map(n => [n.id, n]));

    visibleEdges.forEach(edge => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (!src || !tgt) return;

      const isPathEdge = shortestPathEdges.has(edge.id);
      const isConnectedToSelected = selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);

      if (isPathEdge) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#F59E0B';
        ctx.shadowBlur = 10;
      } else if (isConnectedToSelected) {
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#6366F1';
        ctx.shadowBlur = 6;
      } else if (edge.isSuspicious) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = edge.amount ? 2.2 : 1.5;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw arrow towards target
      const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
      const arrowLength = 8;
      const targetEdgeX = tgt.x - Math.cos(angle) * (tgt.radius + 2);
      const targetEdgeY = tgt.y - Math.sin(angle) * (tgt.radius + 2);

      ctx.beginPath();
      ctx.moveTo(targetEdgeX, targetEdgeY);
      ctx.lineTo(
        targetEdgeX - arrowLength * Math.cos(angle - Math.PI / 6),
        targetEdgeY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        targetEdgeX - arrowLength * Math.cos(angle + Math.PI / 6),
        targetEdgeY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = isPathEdge ? '#F59E0B' : (edge.isSuspicious ? 'rgba(239, 68, 68, 0.9)' : 'rgba(148, 163, 184, 0.6)');
      ctx.fill();

      // Draw label if edge has money or special relationship
      if (edge.label && (isPathEdge || isConnectedToSelected || zoom > 0.85)) {
        const midX = (src.x + tgt.x) / 2;
        const midY = (src.y + tgt.y) / 2;

        ctx.fillStyle = '#0B0F19';
        ctx.fillRect(midX - 35, midY - 9, 70, 18);
        ctx.strokeStyle = isPathEdge ? '#F59E0B' : (edge.isSuspicious ? 'rgba(239, 68, 68, 0.5)' : '#273449');
        ctx.lineWidth = 1;
        ctx.strokeRect(midX - 35, midY - 9, 70, 18);

        ctx.fillStyle = isPathEdge ? '#FDE047' : (edge.isSuspicious ? '#FCA5A5' : '#94A3B8');
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.label, midX, midY);
      }
    });

    // Draw Nodes
    visibleNodes.forEach(node => {
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode?.id === node.id;
      const isPathNode = highlightPathMode && (node.id === pathEndpoints.start || node.id === pathEndpoints.end);

      // Node shadow / glow if critical risk or selected
      if (isSelected || isPathNode || node.riskScore > 85) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + (isSelected ? 7 : 4), 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? 'rgba(99, 102, 241, 0.25)'
          : (node.riskScore > 85 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)');
        ctx.fill();
      }

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#131B2B';
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : (isHovered ? 2.5 : 1.8);
      ctx.strokeStyle = isSelected ? '#FFFFFF' : node.color;
      ctx.stroke();

      // Inner icon or glyph circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();

      // Node text label
      ctx.fillStyle = isSelected ? '#FFFFFF' : '#F8FAFC';
      ctx.font = isSelected ? '600 12px Inter, sans-serif' : '500 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(node.label, node.x, node.y + node.radius + 5);

      // Risk score pill below
      if (node.riskScore > 0) {
        const riskY = node.y + node.radius + 20;
        const pillWidth = 32;
        const pillHeight = 14;

        ctx.fillStyle = node.riskScore >= 80 ? 'rgba(239, 68, 68, 0.2)' : (node.riskScore >= 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)');
        ctx.fillRect(node.x - pillWidth / 2, riskY, pillWidth, pillHeight);

        ctx.strokeStyle = node.riskScore >= 80 ? '#EF4444' : (node.riskScore >= 50 ? '#F59E0B' : '#22C55E');
        ctx.lineWidth = 0.8;
        ctx.strokeRect(node.x - pillWidth / 2, riskY, pillWidth, pillHeight);

        ctx.fillStyle = node.riskScore >= 80 ? '#EF4444' : (node.riskScore >= 50 ? '#F59E0B' : '#22C55E');
        ctx.font = '600 8.5px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${node.riskScore}`, node.x, riskY + pillHeight / 2);
      }
    });

    ctx.restore();
  }, [pan, zoom, visibleNodes, visibleEdges, selectedNode, hoveredNode, shortestPathEdges, activeCommunityHighlight, highlightPathMode, pathEndpoints]);

  // Request Animation Frame loop
  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      render();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [render]);

  // Mouse interaction helpers
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);

    // Check if clicked a node
    const clickedNode = [...visibleNodes].reverse().find(node => {
      const dx = node.x - coords.x;
      const dy = node.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 5;
    });

    if (clickedNode) {
      setDraggedNode(clickedNode);
      setSelectedNode(clickedNode);
      if (onSelectEntity) onSelectEntity(clickedNode);
    } else {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);

    if (draggedNode) {
      // Update dragged node position
      setNodes(prev => prev.map(n => n.id === draggedNode.id ? { ...n, x: coords.x, y: coords.y } : n));
      return;
    }

    if (isDraggingCanvas) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Hover check
    const hovered = visibleNodes.find(node => {
      const dx = node.x - coords.x;
      const dy = node.y - coords.y;
      return Math.sqrt(dx * dx + dy * dy) <= node.radius + 5;
    });

    setHoveredNode(hovered || null);
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggedNode(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(z => Math.max(0.3, Math.min(3, z * zoomFactor)));
  };

  const handleResetZoom = () => {
    setZoom(1);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPan({ x: rect.width / 2, y: rect.height / 2 });
    }
  };

  // Expand neighboring entities
  const handleExpandNeighbors = (nodeId: string) => {
    // Generate synthetic neighboring connected node
    const newId = `EXP-NODE-${Date.now().toString().slice(-4)}`;
    const baseNode = nodes.find(n => n.id === nodeId);
    if (!baseNode) return;

    const newNode: GraphNode = {
      id: newId,
      label: `Associated Account (${newId})`,
      type: 'BankAccount',
      riskScore: Math.floor(Math.random() * 40) + 30,
      x: baseNode.x + (Math.random() * 120 - 60),
      y: baseNode.y + (Math.random() * 120 - 60),
      radius: 18,
      color: typeColors.BankAccount,
      meta: { customerId: baseNode.id, balance: 145000, bankName: 'Axis Bank' }
    };

    setNodes(prev => [...prev, newNode]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full gap-4 relative">
      {/* 70% Graph View Area */}
      <div
        ref={containerRef}
        className="flex-1 min-h-[620px] bg-[#0D110F] rounded-xl border border-[#1C2420] relative overflow-hidden flex flex-col"
      >
        {/* Top Control Toolbar */}
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Search and filters */}
          <div className="flex items-center gap-2 pointer-events-auto bg-[#131715]/95 backdrop-blur-md p-1.5 rounded-lg border border-[#1C2420] shadow-md">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search account, customer, IP..."
                className="pl-8 pr-3 py-1.5 bg-[#08090A] text-xs text-white rounded border border-[#1C2420] focus:outline-none focus:border-[#00D06C] w-52"
              />
            </div>

            <button
              onClick={() => setShowSuspiciousOnly(!showSuspiciousOnly)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 border transition-colors ${
                showSuspiciousOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-[#08090A] text-gray-300 border-[#1C2420] hover:bg-[#161C19]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Suspicious Only</span>
            </button>

            <button
              onClick={() => setActiveCommunityHighlight(!activeCommunityHighlight)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 border transition-colors ${
                activeCommunityHighlight
                  ? 'bg-[#0D2619] text-[#00D06C] border-[#00D06C]/50'
                  : 'bg-[#08090A] text-gray-300 border-[#1C2420] hover:bg-[#161C19]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Clusters</span>
            </button>

            <button
              onClick={() => setHighlightPathMode(!highlightPathMode)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 border transition-colors ${
                highlightPathMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-[#08090A] text-gray-300 border-[#1C2420] hover:bg-[#161C19]'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Trace Flow</span>
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 pointer-events-auto bg-[#131B2B]/95 backdrop-blur-md p-1 rounded-lg border border-[#273449] shadow-lg">
            <button
              onClick={() => setZoom(z => Math.min(3, z * 1.2))}
              className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.3, z * 0.8))}
              className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-gray-800 text-gray-300 hover:text-white rounded"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend bar at bottom */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#131B2B]/95 backdrop-blur-md px-3 py-2 rounded-lg border border-[#273449] text-xs">
          <span className="text-gray-400 font-semibold mr-1">Entities:</span>
          {(Object.keys(typeColors) as EntityType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilterTypes(prev => ({ ...prev, [type]: !prev[type] }))}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-opacity ${
                filterTypes[type] ? 'opacity-100 bg-gray-800/60' : 'opacity-40 line-through'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[type] }} />
              <span className="text-gray-200">{type}</span>
            </button>
          ))}
        </div>

        {/* Interactive HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Right-Side Entity Details Panel (30% width) */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-3">
        {selectedNode ? (
          <div className="bg-[#131B2B] border border-[#273449] rounded-xl p-4 flex flex-col gap-4 shadow-xl animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#273449]">
              <div>
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${typeColors[selectedNode.type]}22`,
                    color: typeColors[selectedNode.type],
                    border: `1px solid ${typeColors[selectedNode.type]}44`,
                  }}
                >
                  {selectedNode.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedNode.label}</h3>
                <span className="text-xs font-mono text-gray-400">{selectedNode.id}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase block">Risk Score</span>
                <span
                  className={`text-lg font-bold font-mono ${
                    selectedNode.riskScore >= 80 ? 'text-rose-400' : (selectedNode.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400')
                  }`}
                >
                  {selectedNode.riskScore} / 100
                </span>
              </div>
            </div>

            {/* Entity metadata attributes */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#182235]">
                <span className="text-gray-400">Connected Entities:</span>
                <span className="text-white font-medium">
                  {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length} nodes
                </span>
              </div>

              {selectedNode.type === 'Customer' && (
                <>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">PAN Card Mask:</span>
                    <span className="text-white font-mono">{selectedNode.meta.panMask || 'ABCDE••••F'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">KYC Status:</span>
                    <span className="text-emerald-400 font-semibold">{selectedNode.meta.kycStatus || 'VERIFIED'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">City / Jurisdiction:</span>
                    <span className="text-white">{selectedNode.meta.city || 'Mumbai, Maharashtra'}</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'BankAccount' && (
                <>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Bank & Branch IFSC:</span>
                    <span className="text-white font-mono">{selectedNode.meta.ifsc || 'HDFC0001842'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Reported Balance:</span>
                    <span className="text-white font-mono">{formatINR(selectedNode.meta.balance || 450000)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Account Type:</span>
                    <span className="text-cyan-400">{selectedNode.meta.type || 'SAVINGS'}</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'Device' && (
                <>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Hardware Fingerprint:</span>
                    <span className="text-purple-400 font-mono truncate max-w-[160px]">{selectedNode.meta.fingerprintHash}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">QEMU / Emulator:</span>
                    <span className={selectedNode.meta.isEmulator ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {selectedNode.meta.isEmulator ? 'DETECTED' : 'CLEAN'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Sessions Logged:</span>
                    <span className="text-white font-mono">{selectedNode.meta.sessionCount || 84} sessions</span>
                  </div>
                </>
              )}

              {selectedNode.type === 'IPAddress' && (
                <>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Classification:</span>
                    <span className="text-rose-400 font-bold">{selectedNode.meta.classification}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">ISP / Autonomous Sys:</span>
                    <span className="text-white">{selectedNode.meta.isp} ({selectedNode.meta.asn})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#182235]">
                    <span className="text-gray-400">Origin Geolocation:</span>
                    <span className="text-white">{selectedNode.meta.city}, {selectedNode.meta.country}</span>
                  </div>
                </>
              )}
            </div>

            {/* Risk Indicators */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-300">Observed Risk Indicators</span>
              <div className="bg-[#0B0F19] p-2.5 rounded border border-[#273449] space-y-1.5 text-xs text-gray-300">
                <div className="flex items-start gap-1.5 text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-rose-400" />
                  <span>Linked to shared hardware fingerprint across multiple distinct KYC identities.</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-300">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                  <span>Sudden velocity burst (&gt; ₹10 Lakh) exhausted within 45 minutes of receipt.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => handleExpandNeighbors(selectedNode.id)}
                className="w-full py-2 bg-[#161C19] hover:bg-[#1C2420] text-gray-200 rounded border border-[#1C2420] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Expand Neighboring Entities</span>
              </button>

              <button
                onClick={() => onInvestigateNetwork ? onInvestigateNetwork('NET-004') : null}
                className="w-full py-2.5 bg-[#00D06C] hover:bg-[#05B860] text-black rounded font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00D06C]/25 transition-all"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Investigate Selected Network</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-6 flex flex-col items-center justify-center text-center text-[#9CA3AF] h-80">
            <Layers className="w-10 h-10 text-gray-600 mb-3" />
            <h4 className="text-sm font-semibold text-gray-300">No Entity Selected</h4>
            <p className="text-xs text-[#9CA3AF] mt-1 max-w-xs">
              Click on any customer, bank account, device, or IP node to inspect live telemetry and connected risk relationships.
            </p>
          </div>
        )}

        {/* Network Context Summary Card */}
        <div className="bg-[#131715] border border-[#1C2420] rounded-xl p-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF] font-semibold">Active Cluster:</span>
            <span className="font-mono text-[#00D06C] font-bold">NET-004</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF]">Total Flagged Flow:</span>
            <span className="font-mono text-white font-bold">₹1.00 Cr (10,00,000)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF]">Topology Category:</span>
            <span className="text-rose-400 font-medium">Mule Funnel / Circular Loop</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#9CA3AF]">Hop Count:</span>
            <span className="text-gray-300 font-mono">5 sequential hops</span>
          </div>
        </div>
      </div>
    </div>
  );
};
