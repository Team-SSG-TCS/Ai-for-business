# Antigravity Workspace Rules — Knowledge Graph First

## CRITICAL: Token Optimization via Knowledge Graph (`graphify-out/`)

This project is indexed into a persistent knowledge graph located at `graphify-out/`.
The graph maps 634+ symbols, dependencies, API endpoints, microservices, and cross-cutting relationships.

### Mandatory Agent Decision Protocol

To drastically reduce token usage and prevent context bloat:

1. **Graph Query First**:
   - **DO NOT** perform broad grep, glob, or scan multiple source code files into context.
   - **ALWAYS** query the knowledge graph first for any architecture, component discovery, call tracing, or feature modification:
     ```bash
     graphify query "<your question or feature goal>"
     ```
   - For relationship / dependency tracing between two modules:
     ```bash
     graphify path "<SourceComponent>" "<TargetComponent>"
     ```
   - For deep concept or symbol rationale:
     ```bash
     graphify explain "<NodeIdOrSymbol>"
     ```
   - Or read `graphify-out/GRAPH_REPORT.md` to see communities, God nodes, and architectural clusters.

2. **Targeted Reading Only**:
   - Only open the specific file and exact line numbers (`LXX-LYY`) identified by the graph query.
   - Never slurp whole directories or large files unless explicitly needed for edits.

3. **Incremental Graph Sync**:
   - After creating, moving, or editing code files in `client/`, `backend/`, or `ai-service/`, keep the graph updated by running:
     ```bash
     graphify update .
     ```
     (Pure AST extraction, instant and zero token cost).

4. **Visual Exploration File**:
   - The interactive visual HTML graph is located at:
     `graphify-out/graph.html`
     (Open in any browser to inspect communities, god nodes, and network clusters).

