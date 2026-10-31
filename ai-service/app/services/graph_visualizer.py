import json
from app.services.graph_engine import get_or_build_master_graph, extract_investigation_subgraph
from app.services.enterprise_dataset import get_master_database

NODE_STYLES = {
    "customer": {"color": "#3b82f6", "shape": "dot", "size": 25, "icon": "👤"},
    "account": {"color": "#10b981", "shape": "dot", "size": 20, "icon": "💳"},
    "device": {"color": "#f59e0b", "shape": "diamond", "size": 28, "icon": "📱"},
    "ip": {"color": "#8b5cf6", "shape": "square", "size": 22, "icon": "🌐"},
    "merchant": {"color": "#06b6d4", "shape": "triangle", "size": 24, "icon": "🏪"},
    "beneficiary": {"color": "#ef4444", "shape": "star", "size": 32, "icon": "🏛️"},
    "location": {"color": "#64748b", "shape": "dot", "size": 16, "icon": "📍"},
}

def generate_interactive_html(seed_id: str = "ALERT-001", radius: int = 2) -> str:
    """
    Generates a full-screen, dark-mode interactive Vis.js graph canvas
    for any alert or the full enterprise network.
    """
    db = get_master_database()
    
    if seed_id == "ALL":
        _, graph_data = get_or_build_master_graph()
        title = "Global Enterprise Network (All Nodes & Transactions)"
    else:
        graph_data = extract_investigation_subgraph(seed_id, radius=radius)
        alert_obj = next((a for a in db.alerts if a["alert_id"] == seed_id), None)
        title = f"{seed_id}: {alert_obj['title'] if alert_obj else 'Isolated Subgraph'}"

    # Build Vis.js Nodes
    vis_nodes = []
    for n in graph_data.nodes:
        style = NODE_STYLES.get(n.type, {"color": "#94a3b8", "shape": "dot", "size": 20, "icon": "●"})
        
        # Highlight critical nodes
        border_color = "#ef4444" if n.risk_level == "CRITICAL" else "#334155"
        border_width = 3 if n.risk_level == "CRITICAL" else 1

        tooltip = f"<b>{n.label}</b><br>Type: {n.type.upper()}<br>Risk: {n.risk_level}<br>"
        for k, v in n.properties.items():
            tooltip += f"• {k}: {v}<br>"

        vis_nodes.append({
            "id": n.id,
            "label": n.label,
            "title": tooltip,
            "color": {
                "background": style["color"],
                "border": border_color,
                "highlight": {"background": "#ffffff", "border": "#38bdf8"}
            },
            "shape": style["shape"],
            "size": style["size"],
            "borderWidth": border_width,
            "font": {"color": "#e2e8f0", "size": 13, "face": "JetBrains Mono, monospace"},
            "customType": n.type,
            "properties": n.properties
        })

    # Build Vis.js Edges
    vis_edges = []
    for link in graph_data.links:
        label = link.relation
        color = "#475569"
        dashes = False
        width = 1.5

        if link.relation == "TRANSFERRED_TO":
            color = "#10b981"
            width = 3.0
            label = f"${link.amount:,.0f}" if link.amount else link.relation
        elif link.relation == "SENT_TO_BENEFICIARY":
            color = "#ef4444"
            width = 4.0
            dashes = True
            label = f"WIRE: ${link.amount:,.0f}" if link.amount else link.relation
        elif link.relation == "LOGGED_IN_FROM":
            color = "#f59e0b"
            dashes = [5, 5]
        elif link.relation == "CONNECTED_VIA":
            color = "#8b5cf6"
            dashes = [3, 3]

        vis_edges.append({
            "from": link.source,
            "to": link.target,
            "label": label,
            "color": {"color": color, "highlight": "#38bdf8"},
            "arrows": "to",
            "dashes": dashes,
            "width": width,
            "font": {"color": "#94a3b8", "size": 10, "align": "middle", "strokeWidth": 0}
        })

    nodes_json = json.dumps(vis_nodes)
    edges_json = json.dumps(vis_edges)
    metrics_json = json.dumps(graph_data.metrics, indent=2)

    alerts_options = "".join([
        f'<option value="{a["alert_id"]}" {"selected" if a["alert_id"] == seed_id else ""}>{a["alert_id"]} - {a["title"][:45]}...</option>'
        for a in db.alerts
    ])
    alerts_options += f'<option value="ALL" {"selected" if seed_id == "ALL" else ""}>🌐 FULL ENTERPRISE NETWORK (Global View)</option>'

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NetworkX Visualizer | Financial Crime Intelligence</title>
  <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: 'Inter', sans-serif; background-color: #0b0f19; color: #f1f5f9; overflow: hidden; }}
    
    #header {{
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 24px; background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid #1e293b; backdrop-filter: blur(8px);
      z-index: 10; position: relative;
    }}
    .brand {{ display: flex; align-items: center; gap: 12px; }}
    .brand h1 {{ font-size: 16px; font-weight: 700; letter-spacing: 0.5px; color: #38bdf8; }}
    .brand span {{ font-size: 12px; color: #64748b; font-family: 'JetBrains Mono', monospace; }}

    .controls {{ display: flex; align-items: center; gap: 14px; }}
    select, button {{
      background: #1e293b; color: #f8fafc; border: 1px solid #334155;
      padding: 8px 14px; border-radius: 6px; font-size: 13px; font-family: inherit;
      cursor: pointer; transition: all 0.2s;
    }}
    select:focus, button:hover {{ border-color: #38bdf8; outline: none; }}
    button.primary {{ background: #0284c7; border-color: #0284c7; font-weight: 600; }}
    button.primary:hover {{ background: #0369a1; }}

    #container {{ display: flex; height: calc(100vh - 58px); position: relative; }}
    #network {{ flex: 1; height: 100%; background: radial-gradient(circle at center, #111827 0%, #030712 100%); }}

    #sidebar {{
      width: 380px; background: #0f172a; border-left: 1px solid #1e293b;
      display: flex; flex-direction: column; overflow-y: auto; padding: 20px;
    }}
    .card {{ background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 16px; border: 1px solid #334155; }}
    .card h3 {{ font-size: 13px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-family: 'JetBrains Mono', monospace; }}

    .legend {{ display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; }}
    .legend-item {{ display: flex; align-items: center; gap: 8px; }}
    .legend-dot {{ width: 12px; height: 12px; border-radius: 3px; }}

    pre {{ font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #38bdf8; background: #090d16; padding: 12px; border-radius: 6px; overflow-x: auto; }}
    #node-details {{ font-size: 12px; line-height: 1.6; color: #cbd5e1; }}
  </style>
</head>
<body>
  <div id="header">
    <div class="brand">
      <span style="font-size: 20px;">🕸️</span>
      <div>
        <h1>FINANCIAL CRIME NETWORK INVESTIGATOR</h1>
        <span>Topology & Entity Resolution Canvas</span>
      </div>
    </div>
    <div class="controls">
      <label style="font-size: 12px; color: #94a3b8;">Select Alert Seed:</label>
      <select id="caseSelector" onchange="switchCase(this.value)">
        {alerts_options}
      </select>
      <button onclick="network.fit({{animation: true}})">Fit View</button>
      <button class="primary" onclick="togglePhysics()">Toggle Physics</button>
    </div>
  </div>

  <div id="container">
    <div id="network"></div>
    <div id="sidebar">
      <div class="card">
        <h3>Graph Metrics</h3>
        <pre>{metrics_json}</pre>
      </div>

      <div class="card">
        <h3>Entity Legend</h3>
        <div class="legend">
          <div class="legend-item"><div class="legend-dot" style="background: #3b82f6;"></div><span>Customer</span></div>
          <div class="legend-item"><div class="legend-dot" style="background: #10b981;"></div><span>Account</span></div>
          <div class="legend-item"><div class="legend-dot" style="background: #f59e0b;"></div><span>Device</span></div>
          <div class="legend-item"><div class="legend-dot" style="background: #8b5cf6;"></div><span>IP Address</span></div>
          <div class="legend-item"><div class="legend-dot" style="background: #06b6d4;"></div><span>Merchant</span></div>
          <div class="legend-item"><div class="legend-dot" style="background: #ef4444;"></div><span>Beneficiary</span></div>
        </div>
      </div>

      <div class="card" style="flex: 1;">
        <h3>Selected Entity Inspector</h3>
        <div id="node-details">Click on any node in the graph to inspect its properties, transactions, and hardware fingerprints.</div>
      </div>
    </div>
  </div>

  <script>
    const rawNodes = {nodes_json};
    const rawEdges = {edges_json};

    const container = document.getElementById('network');
    const data = {{
      nodes: new vis.DataSet(rawNodes),
      edges: new vis.DataSet(rawEdges)
    }};

    let physicsEnabled = true;
    const options = {{
      physics: {{
        barnesHut: {{
          gravitationalConstant: -18000,
          centralGravity: 0.3,
          springLength: 140,
          springConstant: 0.04
        }},
        stabilization: {{ iterations: 150 }}
      }},
      interaction: {{ hover: true, tooltipDelay: 100 }},
      edges: {{ smooth: {{ type: 'cubicBezier', roundness: 0.2 }} }}
    }};

    const network = new vis.Network(container, data, options);

    // Click handler to inspect entity
    network.on('click', function(params) {{
      if (params.nodes.length > 0) {{
        const nodeId = params.nodes[0];
        const node = rawNodes.find(n => n.id === nodeId);
        if (node) {{
          let html = `<b style="font-size: 14px; color: #38bdf8;">${{node.label}}</b><br>`;
          html += `<span style="color: #94a3b8;">Type: <b>${{node.customType.toUpperCase()}}</b></span><br>`;
          html += `<span style="color: #ef4444;">Risk: <b>${{node.properties.risk_rating || 'NORMAL'}}</b></span><hr style="border: 0; border-top: 1px solid #334155; margin: 8px 0;">`;
          
          for (const [k, v] of Object.entries(node.properties)) {{
            html += `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #1e293b;">
                       <span style="color: #64748b;">${{k}}</span>
                       <span style="color: #e2e8f0; font-family: 'JetBrains Mono', monospace;">${{v}}</span>
                     </div>`;
          }}
          document.getElementById('node-details').innerHTML = html;
        }}
      }}
    }});

    function switchCase(val) {{
      window.location.href = `/graph-view?seed_id=${{val}}`;
    }}

    function togglePhysics() {{
      physicsEnabled = !physicsEnabled;
      network.setOptions({{ physics: {{ enabled: physicsEnabled }} }});
    }}
  </script>
</body>
</html>
"""
    return html_content
