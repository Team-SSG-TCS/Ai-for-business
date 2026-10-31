import os
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure app imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pyvis.network import Network
import networkx as nx
from app.services.graph_engine import get_or_build_master_graph
from app.services.enterprise_dataset import get_master_database

NODE_COLORS = {
    "customer": "#3b82f6",     # Blue
    "account": "#10b981",      # Emerald Green
    "device": "#f59e0b",       # Amber Orange
    "ip": "#8b5cf6",           # Purple
    "merchant": "#06b6d4",     # Cyan
    "beneficiary": "#ef4444",  # Crimson Red
    "location": "#64748b",     # Slate Gray
}

def render_pyvis_visualization(seed_id: str = "ALERT-001", radius: int = 2):
    """
    Renders an interactive NetworkX graph using the official PyVis package.
    """
    G, _ = get_or_build_master_graph()
    db = get_master_database()

    # If an alert is chosen, extract the ego subgraph
    if seed_id != "ALL":
        alert_obj = next((a for a in db.alerts if a["alert_id"] == seed_id), None)
        target = alert_obj["seed_id"] if alert_obj else seed_id
        sub_nodes = set(nx.ego_graph(G.to_undirected(), target, radius=radius).nodes())
        render_G = G.subgraph(sub_nodes).copy()
        output_filename = f"pyvis_{seed_id.lower()}.html"
    else:
        render_G = G.copy()
        output_filename = "pyvis_full_enterprise.html"

    # Style nodes and edges for PyVis
    for node_id, data in render_G.nodes(data=True):
        ntype = data.get("type", "entity")
        color = NODE_COLORS.get(ntype, "#94a3b8")
        data["color"] = color
        data["title"] = f"Type: {ntype.upper()}\nLabel: {data.get('label', node_id)}"
        if ntype == "device":
            data["shape"] = "diamond"
            data["size"] = 28
        elif ntype == "beneficiary":
            data["shape"] = "star"
            data["size"] = 32
        elif ntype == "ip":
            data["shape"] = "square"
            data["size"] = 22
        else:
            data["shape"] = "dot"
            data["size"] = 20

    for u, v, data in render_G.edges(data=True):
        relation = data.get("relation", "")
        if relation == "TRANSFERRED_TO":
            data["color"] = "#10b981"
            data["width"] = 3
        elif relation == "SENT_TO_BENEFICIARY":
            data["color"] = "#ef4444"
            data["width"] = 4
            data["dashes"] = True
        elif relation == "LOGGED_IN_FROM":
            data["color"] = "#f59e0b"
            data["dashes"] = True
        elif relation == "CONNECTED_VIA":
            data["color"] = "#8b5cf6"
            data["dashes"] = True

    # Instantiate PyVis Network
    net = Network(
        height="100vh",
        width="100%",
        bgcolor="#0b0f19",
        font_color="#f1f5f9",
        directed=True,
        notebook=False
    )
    net.from_nx(render_G)
    net.toggle_physics(True)
    net.set_options("""
    {
      "physics": {
        "barnesHut": {
          "gravitationalConstant": -12000,
          "centralGravity": 0.25,
          "springLength": 120,
          "springConstant": 0.05
        }
      }
    }
    """)

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, output_filename)

    net.write_html(out_path)
    print(f"✅ PyVis visualization successfully generated using official `pyvis` package!")
    print(f"📁 Output file: {out_path}")
    print(f"📊 Nodes: {render_G.number_of_nodes()}, Edges: {render_G.number_of_edges()}")

    # Also export Gephi GEXF format (the industry standard for desktop link analysis)
    gexf_path = os.path.join(out_dir, "enterprise_network.gexf")
    # Clean attributes for GEXF export
    clean_G = nx.DiGraph()
    for n, d in G.nodes(data=True):
        clean_G.add_node(n, label=str(d.get("label", n)), type=str(d.get("type", "node")))
    for u, v, d in G.edges(data=True):
        clean_G.add_edge(u, v, relation=str(d.get("relation", "link")))
    nx.write_gexf(clean_G, gexf_path)
    print(f"📁 Gephi (.gexf) export saved to: {gexf_path}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "ALERT-001"
    render_pyvis_visualization(target)

