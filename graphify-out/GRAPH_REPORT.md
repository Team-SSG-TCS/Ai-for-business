# Graph Report - Ai-for-business  (2026-10-31)

## Corpus Check
- 125 files · ~93,796 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 48 file(s) not represented in the graph (top: .csv 39, .example 3, (none) 2)

## Summary
- 634 nodes · 1455 edges · 25 communities (23 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.94)
- Token cost: 1,200 input · 350 output

## Community Hubs (Navigation)
- Investigation Remediation Service
- Client App & Core Layout
- Enterprise Graph & Alerts Engine
- AI Analysis & Content Router
- Client Dependencies & Packages
- Backend Microservice Dependencies
- Dashboard Testers & Status Monitors
- Marketing CTAs & Split Features
- Client App TypeScript Config
- Layout Header & Navigation
- Footer & Feature Tabs
- Marketing Sections & Steppers
- Client Node TypeScript Config
- Root Monorepo Package Config
- Case Studies & Security Band
- AI Service Entrypoint & Health
- Feature Grid & Capabilities
- Industry Solutions Grid
- Oxlint Linter Configuration
- Certification Badges Row
- Enterprise Value Propositions
- System Architecture & Documentation
- Hero Section & Value Headline
- Client TSConfig References

## God Nodes (most connected - your core abstractions)
1. `react` - 46 edges
2. `lucide-react` - 39 edges
3. `Container()` - 31 edges
4. `PageId` - 24 edges
5. `Eyebrow()` - 23 edges
6. `LandingPage()` - 21 edges
7. `MultiAgentInvestigator` - 19 edges
8. `compilerOptions` - 18 edges
9. `ChatRequest` - 17 edges
10. `EnterpriseDatabase` - 16 edges

## Surprising Connections (you probably didn't know these)
- `AI For Business Architecture` --references--> `Multi-Provider LLM Failover`  [EXTRACTED]
  README.md → ai-service/README.md
- `AI For Business Architecture` --references--> `Direct SQL Pooler Architecture`  [EXTRACTED]
  README.md → backend/README.md
- `AI For Business Architecture` --references--> `Competera B2B SaaS Design System`  [EXTRACTED]
  README.md → client/design.md
- `analyze_content()` --uses--> `AnalysisRequest`  [INFERRED]
  ai-service/app/api/v1/endpoints/analyze.py → ai-service/app/schemas/ai.py
- `generate_chat()` --uses--> `ChatRequest`  [INFERRED]
  ai-service/app/api/v1/endpoints/chat.py → ai-service/app/schemas/ai.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Fullstack Microservice Architecture** — readme_ai_for_business_architecture, backend_readme_no_orm_architecture, ai_service_readme_multiprovider_failover [EXTRACTED 1.00]

## Communities (25 total, 2 thin omitted)

### Community 0 - "Investigation Remediation Service"
Cohesion: 0.07
Nodes (35): apply_remediation_fix(), get_case_graph(), get_remediation_audit(), list_cases(), run_custom_investigation(), run_investigation(), scan_dataset_for_anomalies(), AdjudicationResult (+27 more)

### Community 1 - "Client App & Core Layout"
Cohesion: 0.06
Nodes (65): App(), AppLayout(), AppLayoutProps, PageId, MoneyTrailFlow(), MoneyTrailHop, TRAIL_STEPS, EntityType (+57 more)

### Community 2 - "Enterprise Graph & Alerts Engine"
Cohesion: 0.09
Nodes (34): get_enterprise_alerts(), get_full_master_network(), get_investigation_subgraph(), get_master_network_stats(), get_resolved_clusters(), BankAccount, Beneficiary, CaseDataset (+26 more)

### Community 3 - "AI Analysis & Content Router"
Cohesion: 0.06
Nodes (17): analyze_content(), generate_chat(), check_guardrails(), list_available_models(), Settings, AnalysisRequest, AnalysisResponse, ChatRequest (+9 more)

### Community 4 - "Client Dependencies & Packages"
Cohesion: 0.06
Nodes (47): dependencies, axios@^1.21.0, cytoscape@^3.34.4, framer-motion@^14.9.0, lucide-react@^1.65.0, react@^19.3.1, react-dom@^19.3.1, react-is@^19.3.1 (+39 more)

### Community 5 - "Backend Microservice Dependencies"
Cohesion: 0.06
Nodes (36): author, dependencies, cors@^2.8.5, dotenv@^16.4.7, express@^4.21.2, pg@^8.13.1, description, devDependencies (+28 more)

### Community 6 - "Dashboard Testers & Status Monitors"
Cohesion: 0.14
Nodes (18): AiTester(), ServiceItem, ServiceStatus(), AI_BASE_URL, aiApi, BACKEND_BASE_URL, backendApi, checkAiServiceHealth() (+10 more)

### Community 7 - "Marketing CTAs & Split Features"
Cohesion: 0.14
Nodes (14): ClosingCTA(), ClosingCTAProps, SplitFeature(), SplitFeatureProps, Button(), ButtonProps, ButtonSize, ButtonVariant (+6 more)

### Community 8 - "Client App TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 9 - "Layout Header & Navigation"
Cohesion: 0.18
Nodes (11): AnnouncementBar(), Header(), HeaderProps, renderNavIcon(), ThemeToggle(), navContent, NavGroup, NavigationContent (+3 more)

### Community 10 - "Footer & Feature Tabs"
Cohesion: 0.16
Nodes (12): Footer(), AwardsStrip(), FeatureTabs(), Container(), ContainerProps, AwardItem, awardsContent, AwardsStripContent (+4 more)

### Community 11 - "Marketing Sections & Steppers"
Cohesion: 0.16
Nodes (12): LogoMarquee(), NewsGrid(), ProcessStepper(), Eyebrow(), EyebrowProps, LogoItem, marqueeContent, NewsArticleItem (+4 more)

### Community 12 - "Client Node TypeScript Config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 13 - "Root Monorepo Package Config"
Cohesion: 0.12
Nodes (16): author, description, devDependencies, concurrently@^10.0.6, keywords, license, name, scripts (+8 more)

### Community 14 - "Case Studies & Security Band"
Cohesion: 0.19
Nodes (10): CaseStudies(), CaseStudiesProps, SecurityBand(), caseStudiesContent, CaseStudyItem, CaseStudyStat, SecurityBandContent, securityContent (+2 more)

### Community 15 - "AI Service Entrypoint & Health"
Cohesion: 0.19
Nodes (3): get_graph_visualization(), health_check(), root()

### Community 16 - "Feature Grid & Capabilities"
Cohesion: 0.38
Nodes (5): FeatureGrid(), renderFeatureIcon(), FeatureCardItem, FeatureGridContent, featuresContent

### Community 17 - "Industry Solutions Grid"
Cohesion: 0.38
Nodes (5): IndustryGrid(), renderIndustryIcon(), industriesContent, IndustryGridContent, IndustryTileItem

### Community 18 - "Oxlint Linter Configuration"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 19 - "Certification Badges Row"
Cohesion: 0.40
Nodes (4): BadgeRow(), BadgeItem, BadgeRowContent, badgesContent

### Community 20 - "Enterprise Value Propositions"
Cohesion: 0.47
Nodes (4): renderChipIcon(), ValueProps(), ValuePropContent, valuePropsContent

### Community 21 - "System Architecture & Documentation"
Cohesion: 0.40
Nodes (4): Enterprise AI Guardrails, Multi-Provider LLM Failover, Competera B2B SaaS Design System, AI For Business Architecture

### Community 22 - "Hero Section & Value Headline"
Cohesion: 0.50
Nodes (3): Hero(), HeroProps, heroContent

## Knowledge Gaps
- **2 isolated node(s):** `Enterprise AI Guardrails`, `Competera B2B SaaS Design System`
  These have ≤1 connection - possible missing edges. (Counts symbols only; 221 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Layout Header & Navigation` to `Client App & Core Layout`, `Client Dependencies & Packages`, `Dashboard Testers & Status Monitors`, `Marketing CTAs & Split Features`, `Footer & Feature Tabs`, `Marketing Sections & Steppers`, `Case Studies & Security Band`, `Feature Grid & Capabilities`, `Industry Solutions Grid`, `Certification Badges Row`, `Enterprise Value Propositions`, `Hero Section & Value Headline`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `Enterprise AI Guardrails`, `Competera B2B SaaS Design System` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Investigation Remediation Service` be split into smaller, more focused modules?**
  _Cohesion score 0.06670584778136938 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Layout Header & Navigation` to `Client App & Core Layout`, `Client Dependencies & Packages`, `Dashboard Testers & Status Monitors`, `Marketing CTAs & Split Features`, `Footer & Feature Tabs`, `Marketing Sections & Steppers`, `Case Studies & Security Band`, `Feature Grid & Capabilities`, `Industry Solutions Grid`, `Enterprise Value Propositions`, `Hero Section & Value Headline`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `Client App & Core Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.05671466353217749 - nodes in this community are weakly interconnected._
- **Should `Enterprise Graph & Alerts Engine` be split into smaller, more focused modules?**
  _Cohesion score 0.08684684684684685 - nodes in this community are weakly interconnected._
- **Should `AI Analysis & Content Router` be split into smaller, more focused modules?**
  _Cohesion score 0.05921325051759834 - nodes in this community are weakly interconnected._